import { Comment } from "../models/comment.js";
import { Post } from "../models/post.model.js"

export const addPost = async (req, res) => {
  const { content } = req.body;
  const post = await Post.create({ content });
  res.status(200).json(post);
}
export const getAllPosts = async (_req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
}
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.deleteById(id);
  if (!post)
    return res.status(404).json({ message: "post not found" });
  res.status(201).json(post);
}
export const updatePost = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const post = await Post.updateById(id, { content });
  if (!post)
    return res.status(404).json({ message: "post not found" });
  res.status(201).json(post);
}
export const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post)
    return res.status(404).json({ message: "post not found" });
  res.status(200).json(post);
}
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = Comment.create({ content, postId: id });
  res.status(201).json(comment);
};
export const getComments = async (req, res) => {
  const { id } = req.params;
  const comments = Comment.find({ postId: id });
  res.status(200).json(comments)
}
