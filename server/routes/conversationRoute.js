import { Router } from "express";
import { createConversation, editMessage, getAllConversations, getConversation, sendMessage } from "../controllers/conversationController.js";

const router = Router();

router.get("/:id", getConversation);
router.post("/:id/messages", sendMessage);
router.put("/:id/messages/:slug", editMessage);
router.post("/", createConversation);
router.get("/", getAllConversations);
export default router;
