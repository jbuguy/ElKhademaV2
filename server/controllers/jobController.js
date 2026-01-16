import { Jobs } from "../models/jobs.model.js";

export const createJob = async (req, res) => {
    const {
        title,
        description,
        requirements,
        responsibilities,
        jobType,
        experienceLevel,
        location,
        salary,
        tags,
        skills,
        category,
        status,
        deadline,
    } = req.body;
    try {
        const job = await Jobs.create({
            title,
            description,
            requirements,
            responsibilities,
            jobType,
            experienceLevel,
            location,
            salary,
            tags,
            skills,
            category,
            status,
            postedBy: req.user.id, // Use authenticated user's ID
            deadline,
        });
        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(400).json({ error: error.message });
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const {
            q,
            location,
            jobType,
            minSalary,
            maxSalary,
            skills,
            tags,
            experienceLevel,
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        const filter = {};

        if (q) {
            filter.$text = { $search: q };
        }

        if (location) {
            const locRegex = new RegExp(location, "i");
            filter.$or = [
                { "location.city": locRegex },
                { "location.country": locRegex },
            ];
        }

        if (jobType) {
            const types = jobType.split(",").map((t) => t.trim());
            filter.jobType = { $in: types };
        }

        if (experienceLevel) {
            const exps = experienceLevel.split(",").map((e) => e.trim());
            filter.experienceLevel = { $in: exps };
        }

        if (skills) {
            const skillsArr = skills.split(",").map((s) => s.trim());
            filter.skills = { $in: skillsArr };
        }

        if (tags) {
            const tagsArr = tags.split(",").map((t) => t.trim());
            filter.tags = { $in: tagsArr };
        }

        if (minSalary || maxSalary) {
            filter.$and = filter.$and || [];
            if (minSalary) {
                filter.$and.push({ "salary.max": { $gte: Number(minSalary) } });
            }
            if (maxSalary) {
                filter.$and.push({ "salary.min": { $lte: Number(maxSalary) } });
            }
        }

        const pageNum = Math.max(1, Number(page));
        const lim = Math.min(100, Number(limit));
        const skip = (pageNum - 1) * lim;

        let query;
        if (q) {
            query = Jobs.find(filter, { score: { $meta: "textScore" } }).sort({
                score: { $meta: "textScore" },
            });
        } else {
            const orderNum = order === "desc" ? -1 : 1;
            query = Jobs.find(filter).sort({ [sortBy]: orderNum });
        }

        const total = await Jobs.countDocuments(filter);
        const jobs = await query.skip(skip).limit(lim).exec();

        res.status(200).json({ jobs, total, page: pageNum, limit: lim });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getJobById = async (req, res) => {
    const { jobId } = req.params;
    try {
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteJob = async (req, res) => {
    const { jobId } = req.params;
    const result = req.body;

    try {
        if (!result.user || result.user._id !== result.job.postedBy) {
            return res.status(401).json({
                error: "Unauthorized access",
            });
        }
        const job = await Jobs.findByIdAndDelete(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateJobById = async (req, res) => {
    const { jobId } = req.params;
    const updatedjob = req.body;

    try {
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        if (updatedjob.user_id !== job.postedBy.toString()) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        Object.assign(job, {
            title: updatedjob.title,
            description: updatedjob.description,
            requirements: updatedjob.requirements,
            responsibilities: updatedjob.responsibilities,
            jobType: updatedjob.jobType,
            experienceLevel: updatedjob.experienceLevel,
            location: updatedjob.location,
            salary: updatedjob.salary,
            tags: updatedjob.tags,
            skills: updatedjob.skills,
            category: updatedjob.category,
            status: updatedjob.status,
            deadline: updatedjob.deadline,
        });

        await job.save();
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const applyForJob = async (req, res) => {
    const { jobId } = req.params;
    const applicationData = req.body;
    const userId = req.user.id;

    try {
        const job = await Jobs.findById(jobId).populate('postedBy', '_id username');
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        // Check if user already applied
        const alreadyApplied = job.applicants.some(
            app => app.user.toString() === userId
        );
        if (alreadyApplied) {
            return res.status(400).json({ error: "You have already applied to this job" });
        }

        job.applicants.push({
            user: userId,
            resume: applicationData.resume,
            coverLetter: applicationData.coverLetter,
        });
        await job.save();

        // Create notification for company
        const { createNotification } = await import("./notificationController.js");
        await createNotification(
            job.postedBy._id,
            userId,
            "application",
            jobId,
            { jobTitle: job.title }
        );

        res.status(200).json({ message: "Application submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const changeApplicantStatus = async (req, res) => {
    const { jobId, applicantId } = req.params;
    const { status, userId } = req.body;

    try {
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        if (job.postedBy.toString() !== userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const applicant = job.applicants.id(applicantId);
        if (!applicant) {
            return res.status(404).json({ error: "Applicant not found" });
        }
        applicant.status = status;
        console.log(job, status);
        await job.save();
        res.status(200).json({
            message: "Applicant status updated successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCompanyApplications = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find all jobs posted by this company
        const jobs = await Jobs.find({ postedBy: userId })
            .populate({
                path: 'applicants.user',
                select: 'username email profilePic'
            })
            .select('title applicants postedBy createdAt location jobType')
            .sort({ 'applicants.appliedAt': -1 });

        // Flatten applications with job info
        const applications = [];
        jobs.forEach(job => {
            job.applicants.forEach(applicant => {
                applications.push({
                    _id: applicant._id,
                    jobId: job._id,
                    jobTitle: job.title,
                    jobLocation: job.location,
                    jobType: job.jobType,
                    applicant: applicant.user,
                    resume: applicant.resume,
                    coverLetter: applicant.coverLetter,
                    appliedAt: applicant.appliedAt,
                    status: applicant.status
                });
            });
        });

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
