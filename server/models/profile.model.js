import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    birthday: {
      type: Date,
    },
    location: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "https://i.pravatar.cc/150?img=1",
    },
    pastJobs: [{
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
    }],
    skills: [String],
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
