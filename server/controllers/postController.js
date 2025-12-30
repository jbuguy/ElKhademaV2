import { Comment } from "../models/comment.js";
import { Post } from "../models/post.model.js";
import { Profile } from "../models/profile.model.js";

export const addPost = async (req, res) => {
  const { content, media } = req.body;
  const userId = req.user.id;
  let post = await Post.create({ content, media, userId });
  post = await post.populate("userId", "username profilePic");
  
  // Get display name from profile
  const profile = await Profile.findOne({ userId });
  const postObj = post.toObject();
  postObj.userId.displayName = profile?.displayName || "";
  
  res.status(200).json(postObj);
}
export const getAllPosts = async (req, res) => {
  const userId = req.user.id;
  const posts = await Post.find()
    .populate("userId", "username profilePic")
    .populate({
      path: "sharedFrom",
      populate: { path: "userId", select: "username profilePic" }
    })
    .sort({ createdAt: -1 })
    .lean();
  
  // Get all profiles for display names
  const userIds = posts.map(p => p.userId._id);
  const sharedUserIds = posts
    .filter(p => p.sharedFrom && p.sharedFrom.userId)
    .map(p => p.sharedFrom.userId._id);
  const allUserIds = [...new Set([...userIds, ...sharedUserIds])];
  
  const profiles = await Profile.find({ userId: { $in: allUserIds } }).lean();
  const profileMap = {};
  profiles.forEach(p => {
    profileMap[p.userId.toString()] = p.displayName || "";
  });
  
  const postsWithLikes = posts.map(post => {
    const postData = {
      ...post,
      userId: {
        ...post.userId,
        displayName: profileMap[post.userId._id.toString()] || ""
      },
      liked: post.likes?.some(id => id.toString() === userId.toString()) || false,
      totalLikes: post.likes?.length || 0,
    };
    
    // Add display name to sharedFrom user if exists
    if (post.sharedFrom && post.sharedFrom.userId) {
      postData.sharedFrom = {
        ...post.sharedFrom,
        userId: {
          ...post.sharedFrom.userId,
          displayName: profileMap[post.sharedFrom.userId._id.toString()] || ""
        }
      };
    }
    
    return postData;
  });

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
  
  // Get display name from profile
  const profile = await Profile.findOne({ userId });
  const commentObj = comment.toObject();
  commentObj.userId.displayName = profile?.displayName || "";

  res.status(201).json(commentObj);
};
export const getComments = async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ postId: id }).populate("userId", "username profilePic").lean();
  
  // Get all profiles for display names
  const userIds = comments.map(c => c.userId._id);
  const profiles = await Profile.find({ userId: { $in: userIds } }).lean();
  const profileMap = {};
  profiles.forEach(p => {
    profileMap[p.userId.toString()] = p.displayName || "";
  });
  
  const commentsWithDisplayNames = comments.map(comment => ({
    ...comment,
    userId: {
      ...comment.userId,
      displayName: profileMap[comment.userId._id.toString()] || ""
    }
  }));
  
  res.status(200).json(commentsWithDisplayNames);
}
export const addLike = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  const response = await Post.findByIdAndUpdate(id, { $addToSet: { likes: userid } }, { new: true });
  res.status(200).json({ totalLikes: response.likes.length, liked: true })
};
export const sharePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Get the original post
    const originalPost = await Post.findById(id).populate("userId", "username profilePic");
    if (!originalPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Create a shared post
    let sharedPost = await Post.create({
      content: originalPost.content,
      media: originalPost.media,
      userId: userId,
      sharedFrom: originalPost._id
    });
    
    // Populate the shared post data
    sharedPost = await sharedPost.populate("userId", "username profilePic");
    sharedPost = await sharedPost.populate({
      path: "sharedFrom",
      populate: { path: "userId", select: "username profilePic" }
    });
    
    // Get display name for current user
    const profile = await Profile.findOne({ userId });
    const sharedPostObj = sharedPost.toObject();
    sharedPostObj.userId.displayName = profile?.displayName || "";
    
    // Get display name for original poster
    if (sharedPost.sharedFrom && sharedPost.sharedFrom.userId) {
      const originalProfile = await Profile.findOne({ userId: sharedPost.sharedFrom.userId._id });
      sharedPostObj.sharedFrom.userId.displayName = originalProfile?.displayName || "";
    }
    
    res.status(201).json(sharedPostObj);
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({ error: error.message });
  }
};export const deleteLike = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  const response = await Post.findByIdAndUpdate(id, { $pull: { likes: userid } }, { new: true });
  res.status(200).json({ totalLikes: response.likes.length, liked: false })
}
