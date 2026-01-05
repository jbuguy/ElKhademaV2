import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    createJob,
    getAllJobs,
    getJobById,
    deleteJob,
    updateJobById,
    applyForJob,
    changeApplicantStatus,
} from "../controllers/jobController.js";
const router = Router();
router.use(requireAuth);
router.get("/", getAllJobs);
router.post("/create", createJob);
router.post("/:jobId/apply", applyForJob);
router.patch("/:jobId/applicants/:applicantId", changeApplicantStatus);
router.get("/:jobId", getJobById);
router.delete("/:jobId", deleteJob);
router.put("/:jobId", updateJobById);
export default router;
