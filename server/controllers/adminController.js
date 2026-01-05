import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { role, active } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            {
                ...(role !== undefined && { role }),
                ...(active !== undefined && { active }),
            },
            { new: true }
        ).select("-password");
        if (!updated) return res.status(404).json({ error: "User not found" });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // remove user's posts
        await Post.deleteMany({ userId: id });

        res.json({ message: "User and posts removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
