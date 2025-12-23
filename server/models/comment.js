import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
