import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    companyName: {
      type: String,
      trim: true,
      maxLength: 100,
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
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    profileType: {
      type: String,
      enum: ["user", "admin", "company"],
      default: "user",
    },
    // Company-specific fields
    foundedDate: {
      type: Date,
    },
    founderName: {
      type: String,
    },
    companyDescription: {
      type: String,
      maxLength: 1000,
    },
    industry: {
      type: String,
    },
    companySize: {
      type: String,
    },
    website: {
      type: String,
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
