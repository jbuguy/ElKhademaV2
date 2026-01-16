import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["like", "comment", "share", "application"],
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobs"
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
