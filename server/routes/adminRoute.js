import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import {
    getUsers,
    updateUser,
    deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", requireAuth, authorizeRoles("admin"), getUsers);
router.patch("/user/:id", requireAuth, authorizeRoles("admin"), updateUser);
router.delete("/user/:id", requireAuth, authorizeRoles("admin"), deleteUser);

// Reports management
import {
    getReportsAdmin,
    updateReport,
    deleteReport,
} from "../controllers/reportController.js";
router.get("/reports", requireAuth, authorizeRoles("admin"), getReportsAdmin);
router.patch("/report/:id", requireAuth, authorizeRoles("admin"), updateReport);
router.delete(
    "/report/:id",
    requireAuth,
    authorizeRoles("admin"),
    deleteReport
);

export default router;
