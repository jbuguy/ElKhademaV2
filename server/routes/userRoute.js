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
    followUser,
    unfollowUser,
    getfollowStatus,
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
router.post("/follow/:userid", requireAuth, followUser);
router.delete("/follow/:userid", requireAuth, unfollowUser);
router.get("/follow/:userid", requireAuth, getfollowStatus);

export default router;
