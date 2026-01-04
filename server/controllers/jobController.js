import { Jobs } from "../models/jobs.model.js";

export const createJob = async (req, res) => {
    const createdjob = req.body;
    try {
        await Jobs.create({
            title: createdjob.title,
            description: createdjob.description,
            requirements: createdjob.requirements,
            responsibilities: createdjob.responsibilities,
            jobType: createdjob.jobType,
            experienceLevel: createdjob.experienceLevel,
            location: createdjob.location,
            salary: createdjob.salary,
            tags: createdjob.tags,
            skills: createdjob.skills,
            category: createdjob.category,
            status: createdjob.status,
            postedBy: createdjob.postedBy,
            deadline: createdjob.deadline,
        });
        res.status(201).json(createdjob);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Jobs.find();
        res.status(200).json(jobs);
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

    try {
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        job.applicants.push({
            user: applicationData.user_id,
            resume: applicationData.resume,
            coverLetter: applicationData.coverLetter,
        });
        await job.save();
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
