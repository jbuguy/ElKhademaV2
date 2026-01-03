import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createJob, getAllJobs } from "../controllers/jobController.js";
const router = Router();
router.use(requireAuth);
router.get("/", getAllJobs);
router.post("/create", createJob);

export default router;
