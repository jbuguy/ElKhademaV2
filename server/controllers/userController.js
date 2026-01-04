import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { Post } from "../models/post.model.js";
import { generateToken } from "../utils/jwt.js";

/* =========================
   AUTH
========================= */

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Invalid email" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(404).json({ error: "Invalid credentials" });

        const token = generateToken(user);

        res.status(200).json({
            token,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            role: user.role,
            _id: user._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { email, password, role = "user" } = req.body;

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ error: "Email must be unique" });

        const user = await User.create({
            email,
            password,
            username: email, // default username
            role,
        });

        await Profile.create({
            userId: user._id,
            profileType: role,
            email,
        });

        const token = generateToken(user);

        res.status(201).json({
            token,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            role: user.role,
            _id: user._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =========================
   PROFILE
========================= */

export const getProfileByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {},
            { new: true, upsert: true }
        );

        res.status(200).json({ user, profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {},
            { new: true, upsert: true }
        );

        res.status(200).json({ user, profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =========================
   POSTS
========================= */

export const getProfilePosts = async (req, res) => {
    try {
        const { username } = req.params;
        const viewerId = req.user?.id;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const posts = await Post.find({ userId: user._id })
            .populate("userId", "username profilePic")
            .populate({
                path: "sharedFrom",
                populate: {
                    path: "userId",
                    select: "username profilePic",
                },
            })
            .sort({ createdAt: -1 })
            .lean();

        const formattedPosts = posts.map((post) => ({
            ...post,
            liked: viewerId
                ? post.likes?.some(
                      (id) => id.toString() === viewerId.toString()
                  )
                : false,
            totalLikes: post.likes?.length || 0,
        }));

        res.status(200).json(formattedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* =========================
   UPDATE PROFILE
========================= */

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Separate user fields from profile fields
        const { username, profilePic, ...profileUpdates } = req.body;

        // Mark profile complete
        profileUpdates.isProfileComplete = true;

        /* ---------- Username update ---------- */
        if (username) {
            const usernameExists = await User.findOne({
                username,
                _id: { $ne: userId },
            });

            if (usernameExists) {
                return res
                    .status(400)
                    .json({ error: "Username already taken" });
            }
        }

        /* ---------- Update Profile ---------- */
        const profile = await Profile.findOneAndUpdate(
            { userId },
            profileUpdates,
            { new: true, upsert: true }
        );

        /* ---------- Update User ---------- */
        const userUpdate = {};
        if (username) userUpdate.username = username;
        if (profilePic) userUpdate.profilePic = profilePic;

        if (Object.keys(userUpdate).length > 0) {
            await User.findByIdAndUpdate(userId, userUpdate, { new: true });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
