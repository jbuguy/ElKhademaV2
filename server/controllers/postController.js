import { Comment } from "../models/comment.js";
import { Post } from "../models/post.model.js"

export const addPost = async (req, res) => {
  const { content, media } = req.body;
  const userId = req.user.id;
  let post = await Post.create({ content, media, userId });
  post = await post.populate("userId", "username profilePic");
  res.status(200).json(post);
}
export const getAllPosts = async (req, res) => {
  const userId = req.user.id;
  const posts = await Post.find().populate("userId", "username profilePic").sort({ createdAt: -1 }).lean();
  const postsWithLikes = posts.map(post => ({
    ...post,
    liked: post.likes?.some(id => id.toString() === userId.toString()) || false,
    totalLikes: post.likes?.length || 0,
  }));

  res.status(200).json(postsWithLikes);
}
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const post = await Post.findOneAndDelete({ userId, _id: id });
  if (!post)
    return res.status(404).json({ message: "post not found" });
  res.status(204).json(post);
}
export const updatePost = async (req, res) => {
  const { content, media } = req.body;
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, { content, media });

  if (!post)
    return res.status(404).json({ message: "post not found" });

  res.status(201).json(post);
}
export const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("userId", "username profilePic");

  if (!post)
    return res.status(404).json({ message: "post not found" });

  res.status(200).json(post);
}
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content, media } = req.body;
  const userId = req.user.id;

  let comment = await Comment.create({ content, media, postId: id, userId });
  comment = await comment.populate("userId", "username profilePic");

  res.status(201).json(comment);
};
export const getComments = async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ postId: id }).populate("userId", "username profilePic");
  res.status(200).json(comments)
}
export const addLike = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  const response = await Post.findByIdAndUpdate(id, { $addToSet: { likes: userid } }, { new: true });
  res.status(200).json({ totalLikes: response.likes.length, liked: true })
};
export const deleteLike = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  const response = await Post.findByIdAndUpdate(id, { $pull: { likes: userid } }, { new: true });
  res.status(200).json({ totalLikes: response.likes.length, liked: false })
}
