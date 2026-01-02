import { Router } from "express";
import {
    loginUser,
    registerUser,
    getProfileByUsername,
    getProfilePosts,
    updateProfile,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/signup").post(registerUser);
router.route("/profile/:username").get(getProfileByUsername);
router.route("/profile/:username/posts").get(getProfilePosts);
router.route("/profile").put(requireAuth, updateProfile);
export default router;
