import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { Post } from "../models/post.model.js";
import { Jobs } from "../models/jobs.model.js";

const calculateRelevance = (text, searchTerm) => {
    if (!text || !searchTerm) return 0;
    const lowerText = text.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    
    if (lowerText === lowerTerm) return 100;
    if (lowerText.startsWith(lowerTerm)) return 80;
    if (lowerText.includes(` ${lowerTerm}`)) return 60;
    if (lowerText.includes(lowerTerm)) return 40;
    
    let matches = 0;
    for (let char of lowerTerm) {
        if (lowerText.includes(char)) matches++;
    }
    return Math.floor((matches / lowerTerm.length) * 20);
};

export const globalSearch = async (req, res) => {
    try {
        const { q, type, limit = 20 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                error: "Search query must be at least 2 characters",
            });
        }

        const searchTerm = q.trim();
        const searchLimit = parseInt(limit);
        const results = {};

        // Search People
        if (!type || type === "all" || type === "user") {
            const profiles = await Profile.find({
                $or: [
                    { firstName: { $regex: searchTerm, $options: "i" } },
                    { lastName: { $regex: searchTerm, $options: "i" } },
                ],
            }).select("userId firstName lastName location").lean();

            const profileUserIds = profiles.map((p) => p.userId);

            const users = await User.find({
                role: "user",
                $or: [
                    { username: { $regex: searchTerm, $options: "i" } },
                    { _id: { $in: profileUserIds } },
                ],
            })
                .select("username profilePic")
                .limit(searchLimit)
                .lean();

            const profileMap = profiles.reduce((acc, p) => {
                acc[p.userId.toString()] = p;
                return acc;
            }, {});

            results.users = users.map((user) => {
                const profile = profileMap[user._id.toString()] || {};
                const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
                const relevance = Math.max(
                    calculateRelevance(user.username, searchTerm),
                    calculateRelevance(profile.firstName, searchTerm),
                    calculateRelevance(profile.lastName, searchTerm),
                    calculateRelevance(fullName, searchTerm)
                );

                return {
                    ...user,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    location: profile.location,
                    type: "user",
                    relevance,
                };
            }).sort((a, b) => b.relevance - a.relevance);
        }

        // Search Jobs
        if (!type || type === "all" || type === "job") {
            const jobs = await Jobs.find({
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { "location.city": { $regex: searchTerm, $options: "i" } },
                    { "location.country": { $regex: searchTerm, $options: "i" } },
                    { jobType: { $regex: searchTerm, $options: "i" } },
                ],
            })
                .populate("postedBy", "username profilePic")
                .sort({ createdAt: -1 })
                .limit(searchLimit)
                .lean();

            results.jobs = jobs.map((job) => {
                const titleRelevance = calculateRelevance(job.title, searchTerm);
                const locationRelevance = calculateRelevance(job.location?.city, searchTerm);
                const countryRelevance = calculateRelevance(job.location?.country, searchTerm);
                
                const relevance = Math.max(
                    titleRelevance * 1.5,
                    locationRelevance,
                    countryRelevance
                );

                return {
                    ...job,
                    type: "job",
                    relevance,
                };
            }).sort((a, b) => b.relevance - a.relevance);
        }

        // Search Posts
        if (!type || type === "all" || type === "post") {
            const posts = await Post.find({
                content: { $regex: searchTerm, $options: "i" },
            })
                .populate("userId", "username profilePic")
                .sort({ createdAt: -1 })
                .limit(searchLimit)
                .lean();

            results.posts = posts.map((post) => {
                const relevance = calculateRelevance(post.content, searchTerm);

                return {
                    ...post,
                    type: "post",
                    relevance,
                };
            }).sort((a, b) => b.relevance - a.relevance);
        }

        const totalResults =
            (results.users?.length || 0) +
            (results.jobs?.length || 0) +
            (results.posts?.length || 0);

        res.status(200).json({
            query: searchTerm,
            totalResults,
            results,
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const searchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({ suggestions: [] });
        }

        const searchTerm = q.trim();
        const suggestions = [];

        const users = await User.find({
            username: { $regex: `^${searchTerm}`, $options: "i" },
        })
            .select("username profilePic")
            .limit(5)
            .lean();

        suggestions.push(
            ...users.map((u) => ({
                text: u.username,
                type: "user",
                icon: u.profilePic,
            }))
        );

        const jobs = await Jobs.find({
            title: { $regex: `^${searchTerm}`, $options: "i" },
        })
            .select("title")
            .limit(5)
            .lean();

        suggestions.push(
            ...jobs.map((j) => ({
                text: j.title,
                type: "job",
            }))
        );

        res.json({ suggestions: suggestions.slice(0, 10) });
    } catch (error) {
        console.error("Suggestions error:", error);
        res.status(500).json({ error: error.message });
    }
};