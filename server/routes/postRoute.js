import { Router } from "express"
import { addComment, addLike, addPost, deleteLike, deletePost, getAllPosts, getComments, getPost, updatePost } from "../controllers/postController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.route("/").get(getAllPosts);
router.route("/").post(addPost);
router.route("/:id").delete(deletePost);
router.route("/:id").put(updatePost);
router.route("/:id").get(getPost);
router.route("/:id/comments").get(getComments);
router.route("/:id/comments").post(addComment);
router.route("/:id/like").post(addLike);
router.route("/:id/like").delete(deleteLike);
// TODO:missing routes to add likes and managing a feed and post per user

export default router;
