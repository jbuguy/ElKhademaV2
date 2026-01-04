import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["post", "comment", "message"],
            required: true,
        },
        targetId: { type: Schema.Types.ObjectId, required: true },
        reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["open", "in_review", "closed"],
            default: "open",
        },
        adminNote: { type: String },
    },
    { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
