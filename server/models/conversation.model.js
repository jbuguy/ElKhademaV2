import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});
export const conversation = mongoose.model("conversation", conversationSchema);
