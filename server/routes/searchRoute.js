import express from "express";
import { globalSearch, searchSuggestions } from "../controllers/searchController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, globalSearch);
router.get("/suggestions", requireAuth, searchSuggestions);

export default router;
