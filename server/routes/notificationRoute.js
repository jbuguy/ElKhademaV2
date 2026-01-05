import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:id/read", markAsRead);
router.put("/mark-all-read", markAllAsRead);

export default router;
