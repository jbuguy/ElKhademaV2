import { Router } from "express"
import { addComment, addPost, deletePost, getAllPosts, getComments, getPost, updatePost } from "../controllers/postController.js";

const router = Router();

router.route("/").get(getAllPosts);
router.route("/").post(addPost);
router.route("/:id").delete(deletePost);
router.route("/:id").put(updatePost);
router.route("/:id").get(getPost);
router.route("/:id/comments").get(getComments);
router.route("/:id/comments").post(addComment);
// TODO:missing routes to add likes and managing a feed and post per user

export default router;
