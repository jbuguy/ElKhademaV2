import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
    {
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        lastMessage: { ref: "Message", type: Schema.Types.ObjectId },
        displayName: String,
        displayPic: String,
    },
    {
        timestamps: true,
    },
);
ConversationSchema.index({ members: 1 }, { unique: true });
export const Conversation = mongoose.model("conversation", conversationSchema);
