import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { createReport, getMyReports } from "../controllers/reportController.js";

const router = express.Router();

// Create a report (post/comment/message)
router.post("/", requireAuth, createReport);
// Get current user's reports
router.get("/my", requireAuth, getMyReports);

export default router;
