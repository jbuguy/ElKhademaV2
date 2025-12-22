import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
    {
        follow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
export const follow = mongoose.model("follow", followSchema);
