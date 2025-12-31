import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: String,
  },
  { timestamps: true }
);
export const Message = mongoose.model("Message", MessageSchema);
