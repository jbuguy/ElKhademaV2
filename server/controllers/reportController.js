import { Report } from "../models/report.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.js";
import { Message } from "../models/message.model.js";

export const createReport = async (req, res) => {
    try {
        const { type, targetId, reason, description } = req.body;
        if (!type || !targetId || !reason) {
            return res
                .status(400)
                .json({ error: "type, targetId and reason are required" });
        }

        // optionally verify target exists
        let targetExists = true;
        if (type === "post") targetExists = !!(await Post.findById(targetId));
        else if (type === "comment")
            targetExists = !!(await Comment.findById(targetId));
        else if (type === "message")
            targetExists = !!(await Message.findById(targetId));

        if (!targetExists)
            return res.status(404).json({ error: "Target not found" });

        // prevent duplicate open reports by same user
        const existing = await Report.findOne({
            type,
            targetId,
            reporter: req.user._id,
            status: { $in: ["open", "in_review"] },
        });
        if (existing)
            return res
                .status(409)
                .json({ error: "You already reported this item" });

        const report = await Report.create({
            type,
            targetId,
            reason,
            description,
            reporter: req.user._id,
        });
        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ reporter: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getReportsAdmin = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("reporter", "username email")
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const updateReport = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const updated = await Report.findByIdAndUpdate(
            req.params.id,
            { ...(status && { status }), ...(adminNote && { adminNote }) },
            { new: true }
        );
        if (!updated)
            return res.status(404).json({ error: "Report not found" });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const r = await Report.findByIdAndDelete(req.params.id);
        if (!r) return res.status(404).json({ error: "Report not found" });
        res.json({ message: "Report removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
