import { Router } from "express";
const router = Router();
import {
    getFollowers,
    getFollowing,
    getConnections,
    getConnectionStatus,
    getConnectionRequests,
    sendConnectionRequest,
    removeConnection,
    acceptConnection,
    rejectConnection,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

router.get("/followers/:username", getFollowers);
router.get("/following/:username", getFollowing);
router.get("/connections/:username", getConnections);
router.get("/connection-status/:username", requireAuth, getConnectionStatus);
router.get("/connection-requests", requireAuth, getConnectionRequests);
router.post(
    "/send-connection-request/:username",
    requireAuth,
    sendConnectionRequest
);
router.post("/accept-connection/:requestId", requireAuth, acceptConnection);
router.post("/reject-connection/:requestId", requireAuth, rejectConnection);
router.delete("/remove-connection/:userId", requireAuth, removeConnection);

export default router;
