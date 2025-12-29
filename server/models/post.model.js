import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    media: [{
      url: {
        type: String,
        required: true
      },
      type: {
        type: String, enum: ["image", "video", "pdf"]
      }
    }],
  },

  { timestamps: true }
);
export const Post = mongoose.model("Post", postSchema);
