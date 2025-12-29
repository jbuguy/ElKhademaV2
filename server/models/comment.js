import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  media: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String, enum: ["image", "video", "pdf"]
    }
  }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
