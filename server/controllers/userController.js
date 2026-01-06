import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { Post } from "../models/post.model.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

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

// Google OAuth token verification and login/signup
export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ error: "Missing idToken" });

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, email_verified, name, picture } = payload;

        if (!email || !email_verified)
            return res
                .status(400)
                .json({ error: "Google account email not verified" });

        let user = await User.findOne({ email });

        // parse name into first/last
        const nameParts = (name || "").trim().split(/\s+/).filter(Boolean);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        if (!user) {
            // Prefer a username derived from the Google name, fall back to email local part
            let base = (name || "")
                .toLowerCase()
                .replace(/[^a-z0-9._-]+/g, ".") // replace spaces/invalid chars with dots
                .replace(/(^\.+|\.+$)/g, "") // trim leading/trailing dots
                .replace(/\.{2,}/g, "."); // collapse consecutive dots

            if (!base) {
                base = (email.split("@")[0] || "user")
                    .replace(/[^a-z0-9_-]+/g, "")
                    .toLowerCase();
            }

            // enforce max length for base to leave room for suffixes
            base = base.slice(0, 30) || "user";

            let username = base;
            let suffix = 1;
            while (await User.findOne({ username })) {
                const suffixStr = String(suffix);
                // ensure username length stays within 30 chars
                const maxBaseLen = Math.max(1, 30 - suffixStr.length);
                username = `${base.slice(0, maxBaseLen)}${suffixStr}`;
                suffix += 1;
            }

            const randomPassword = crypto.randomBytes(12).toString("hex");
            user = await User.create({
                email,
                username,
                password: randomPassword,
                profilePic: picture,
                active: true,
            });

            await Profile.create({
                userId: user._id,
                email,
                profilePic: picture,
                firstName,
                lastName,
            });
        } else {
            // existing user: keep profilePic and names in sync with Google data if provided
            const userUpdate = {};
            if (picture && user.profilePic !== picture)
                userUpdate.profilePic = picture;
            if (Object.keys(userUpdate).length) {
                await User.findByIdAndUpdate(user._id, userUpdate);
                user = await User.findById(user._id);
            }

            await Profile.findOneAndUpdate(
                { userId: user._id },
                { $set: { email, profilePic: picture, firstName, lastName } },
                { new: true, upsert: true }
            );
        }

        const token = generateToken(user);

        // compute displayName for convenience (first + last or fallback to username)
        const profile = await Profile.findOne({ userId: user._id }).lean();
        const displayName =
            `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
            user.username;

        res.status(200).json({
            token,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            displayName,
            role: user.role,
            _id: user._id,
        });
    } catch (error) {
        console.error("Google auth error:", error);
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
