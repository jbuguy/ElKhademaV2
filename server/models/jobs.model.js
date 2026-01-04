import mongoose, { Schema } from "mongoose";

const jobsSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            maxlength: [100, "Job title cannot exceed 100 characters"],
            index: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
        },
        requirements: {
            type: [String],
            default: [],
        },
        responsibilities: {
            type: [String],
            default: [],
        },
        jobType: {
            type: String,
            required: true,
            enum: [
                "Full Time",
                "Part Time",
                "Contract",
                "Freelance",
                "Internship",
                "Remote",
            ],
            default: "Full Time",
            index: true,
        },
        experienceLevel: {
            type: String,
            enum: [
                "Entry Level",
                "Junior",
                "Mid Level",
                "Senior",
                "Lead",
                "Executive",
            ],
            default: "Mid Level",
            index: true,
        },
        location: {
            city: { type: String, required: true },
            country: { type: String, required: true },
            isRemote: { type: Boolean, default: false },
            address: String,
        },

        salary: {
            min: { type: Number, default: "0" },
            max: { type: Number, default: "0" },
            currency: {
                type: String,
                default: "USD",
                uppercase: true,
            },
            period: {
                type: String,
                enum: ["hourly", "weekly", "monthly", "yearly"],
                default: "yearly",
            },
            isNegotiable: { type: Boolean, default: false },
            hideSalary: { type: Boolean, default: false },
        },

        tags: {
            type: [String],
            index: true,
        },
        skills: [
            {
                type: String,
            },
        ],
        category: {
            type: String,
            index: true,
        },

        status: {
            type: String,
            enum: ["draft", "published", "closed", "archived"],
            default: "draft",
        },

        applicants: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                resume: String,
                coverLetter: String,
                appliedAt: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: [
                        "pending",
                        "reviewed",
                        "interviewing",
                        "rejected",
                        "hired",
                    ],
                    default: "pending",
                },
            },
        ],

        // --- Meta Data ---
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // The recruiter/admin who posted the job
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        deadline: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

jobsSchema.virtual("salaryRange").get(function () {
    if (!this.salary.min && !this.salary.max) return "Not disclosed";
    const format = (num) => (num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num);
    return `${
        this.salary.currency
    } ${format(this.salary.min)} - ${format(this.salary.max)}`;
});

jobsSchema.index({ title: "text", description: "text", tags: "text" });

export const Jobs = mongoose.model("Jobs", jobsSchema);
