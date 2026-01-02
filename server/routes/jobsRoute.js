import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
// router.get("/");

export default router;
