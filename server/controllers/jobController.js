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
