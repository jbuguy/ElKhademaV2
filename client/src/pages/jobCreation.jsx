import React, { useState } from "react";
import {
    Briefcase,
    MapPin,
    DollarSign,
    Calendar,
    Tag,
    Users,
    FileText,
    Award,
} from "lucide-react";
import JobCard from "./jobs";
const Hero = () => (
    <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
            <p className="text-teal-100">
                Fill in the details to create your job listing
            </p>
        </div>
    </div>
);
const BasicInfoForm = ({ job, handleChange }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-600" />
            Basic Information
        </h2>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                </label>
                <input
                    type="text"
                    value={job.title}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="e.g., Senior UX Designer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                </label>
                <select
                    value={job.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="">Select category</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                </label>
                <textarea
                    value={job.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe the role, what the candidate will do, and what makes this opportunity exciting..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
            </div>
        </div>
    </div>
);
const JobDetailsForm = ({ job, handleChange }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Job Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type *
                </label>
                <select
                    value={job.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level *
                </label>
                <select
                    value={job.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Executive">Executive</option>
                </select>
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                </label>
                <input
                    type="date"
                    value={job.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            </div>
        </div>
    </div>
);
const JobLocationForm = ({ job, handleChange }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Location
        </h2>

        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isRemote"
                    checked={job.isRemote}
                    onChange={handleChange}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label
                    htmlFor="isRemote"
                    className="text-sm font-medium text-gray-700"
                >
                    This is a remote position
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                    </label>
                    <input
                        type="text"
                        value={job.city}
                        onChange={handleChange}
                        placeholder="e.g., San Francisco"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                    </label>
                    <input
                        type="text"
                        value={job.country}
                        onChange={handleChange}
                        placeholder="e.g., USA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address (Optional)
                </label>
                <input
                    type="text"
                    value={job.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            </div>
        </div>
    </div>
);
const JobSalaryForm = ({ job, setJob, handleChange }) => {
    const formatSalary = () => {
        if (job.hideSalary) handleSalary("Not disclosed");
        if (!job.salaryMin && !job.salaryMax) handleSalary("Not disclosed");
        const format = (num) =>
            num >= 1000 ? `$${(num / 1000).toFixed(0)}k` : `$${num}`;
        if (job.salaryMin && job.salaryMax)
            handleSalary(
                `${format(parseInt(job.salaryMin))} - ${format(
                    parseInt(job.salaryMax)
                )}`
            );
        if (job.salaryMin)
            handleSalary(`From ${format(parseInt(job.salaryMin))}`);
        if (job.salaryMax)
            handleSalary(`Up to ${format(parseInt(job.salaryMax))}`);
        handleSalary("Not disclosed");
    };
    const handleSalary = (value) => {
        setJob((prev) => ({ ...prev, salary: value }));
    };
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                Salary Information
            </h2>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="hideSalary"
                        checked={job.hideSalary}
                        onChange={(e) => {
                            handleChange(e);
                            formatSalary();
                        }}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label
                        htmlFor="hideSalary"
                        className="text-sm font-medium text-gray-700"
                    >
                        Hide salary from job listing
                    </label>
                </div>

                {!job.hideSalary && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Salary
                                </label>
                                <input
                                    type="number"
                                    value={job.salaryMin}
                                    onChange={(e) => {
                                        handleChange(e);
                                        formatSalary();
                                    }}
                                    placeholder="50000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Maximum Salary
                                </label>
                                <input
                                    type="number"
                                    value={job.salaryMax}
                                    onChange={(e) => {
                                        handleChange(e);
                                        formatSalary();
                                    }}
                                    placeholder="80000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Currency
                                </label>
                                <select
                                    value={job.currency}
                                    onChange={(e) => {
                                        handleChange(e);
                                        formatSalary();
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                    <option value="AUD">AUD</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Period
                                </label>
                                <select
                                    value={job.period}
                                    onChange={(e) => {
                                        handleChange(e);
                                        formatSalary();
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="flex items-center pt-7">
                                <input
                                    type="checkbox"
                                    id="isNegotiable"
                                    checked={job.isNegotiable}
                                    onChange={(e) => {
                                        handleChange(e);
                                        formatSalary();
                                    }}
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <label
                                    htmlFor="isNegotiable"
                                    className="ml-2 text-sm font-medium text-gray-700"
                                >
                                    Salary is negotiable
                                </label>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
const JobRequirements = ({ job, setJob }) => {
    const addRequirement = (value) => {
        const newRequirements = [...job.requirements, value];
        setJob((prev) => ({ ...prev, requirements: newRequirements }));
    };
    const updateRequirement = (index, value) => {
        const newRequirements = [...job.requirements];
        newRequirements[index] = value;
        setJob((prev) => ({ ...prev, requirements: newRequirements }));
    };
    const removeRequirement = (index) => {
        const newRequirements = job.requirements.filter((_, i) => i !== index);
        setJob((prev) => ({ ...prev, requirements: newRequirements }));
    };
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                Requirements
            </h2>

            <div className="space-y-3">
                {job.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={req}
                            onChange={(e) =>
                                updateRequirement(index, e.target.value)
                            }
                            placeholder="e.g., 5+ years of experience in UX design"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => removeRequirement(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={addRequirement}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                >
                    + Add Requirement
                </button>
            </div>
        </div>
    );
};
const JobResponsibilitiesForm = ({ job, setJob }) => {
    const addResponsibility = (value) => {
        const newResponsibility = [...job.responsibilities, value];
        setJob((prev) => ({ ...prev, responsibilities: newResponsibility }));
    };
    const removeResponsibility = (index) => {
        const newResponsibility = job.responsibilities.filter(
            (_, i) => i !== index
        );
        setJob((prev) => ({ ...prev, responsibilities: newResponsibility }));
    };
    const updateResponsibility = (index, value) => {
        const newResponsibility = [...job.responsibilities];
        newResponsibility[index] = value;
        setJob((prev) => ({ ...prev, responsibilities: newResponsibility }));
    };
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Responsibilities
            </h2>

            <div className="space-y-3">
                {job.responsibilities.map((resp, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={resp}
                            onChange={(e) =>
                                updateResponsibility(index, e.target.value)
                            }
                            placeholder="e.g., Lead design projects from concept to delivery"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => removeResponsibility(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={addResponsibility}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                >
                    + Add Responsibility
                </button>
            </div>
        </div>
    );
};
const TagsForm = ({ job, setJob }) => {
    const [tagInput, setTagInput] = useState("");

    const addTag = () => {
        if (tagInput.trim() && !job.tags.includes(tagInput.trim())) {
            setJob((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        const newTags = job.tags.filter((tag) => tag !== tagToRemove);
        setJob((prev) => ({ ...prev, tags: newTags }));
    };
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (for search)
            </label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="e.g., React, Figma, Design Systems"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                    onClick={addTag}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                    Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                    >
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-900 ml-1 font-bold"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};
const SkillsForm = ({ job, setJob }) => {
    const [skillInput, setSkillInput] = useState("");
    const addSkill = () => {
        if (skillInput.trim() && !job.skills.includes(skillInput.trim())) {
            setJob((prev) => ({
                ...prev,
                skills: [...job.skills, skillInput.trim()],
            }));
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) =>
        setJob((prev) => ({
            ...prev,
            skills: job.skills.filter((skill) => skill !== skillToRemove),
        }));

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
            </label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    placeholder="e.g., User Research, Prototyping"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                    Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-1"
                    >
                        {skill}
                        <button
                            onClick={() => removeSkill(skill)}
                            className="hover:text-teal-900 ml-1 font-bold"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};
const Previewjob = ({ job }) => (
    <div className="lg:col-span-1">
        <div className="sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>

            <JobCard key={job.id} job={job} />

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                    <strong>Preview Tip:</strong> This shows how your job will
                    appear in search results
                </p>
            </div>
        </div>
    </div>
);
const SubmitButtons = ({ job, setJob }) => {
    const handleSubmit = () => {
        if (
            !job.title ||
            !job.category ||
            !job.description ||
            !job.city ||
            !job.country
        ) {
            alert("Please fill in all required fields (marked with *)");
            return;
        }
        setJob((prev) => ({ ...prev, status: "Posted" }));
        console.log("Job Posted:", job);
        alert("Job posted successfully! Check console for data.");
    };

    const handleSaveDraft = () => {
        setJob((prev) => ({ ...prev, status: "Drafted" }));
        console.log("Draft Saved:", job);
        alert("Draft saved successfully! Check console for data.");
    };
    return (
        <div className="flex gap-4">
            <button
                onClick={handleSubmit}
                className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-medium transition-colors"
            >
                Publish Job
            </button>
            <button
                onClick={handleSaveDraft}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
                Save as Draft
            </button>
        </div>
    );
};
export default function JobCreation() {
    const [job, setJob] = useState({
        title: "",
        description: "",
        category: "",
        jobType: "Full Time",
        experienceLevel: "Mid Level",
        deadline: "",
        city: "",
        country: "",
        isRemote: false,
        address: "",
        salaryMin: "",
        salaryMax: "",
        salary: "",
        currency: "USD",
        period: "yearly",
        isNegotiable: false,
        hideSalary: false,
        requirements: [""],
        responsibilities: [""],
        tags: [],
        skills: [],
        status: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setJob((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Hero />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            <BasicInfoForm job={job} handleChange={handleChange} />
                            <JobDetailsForm job={job} handleChange={handleChange} />
                            <JobLocationForm job={job} handleChange={handleChange} />
                            <JobSalaryForm job={job} setJob={setJob} handleChange={handleChange} />
                            <JobRequirements job={job} setJob={setJob} />
                            <JobResponsibilitiesForm job={job} setJob={setJob} />
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-teal-600" />
                                    Tags & Skills
                                </h2>
                                <div className="space-y-4">
                                    <TagsForm job={job} setJob={setJob} />
                                    <SkillsForm job={job} setJob={setJob} />
                                </div>
                            </div>
                            <SubmitButtons job={job} setJob={setJob} />
                        </div>
                    </div>
                    <Previewjob key={job.id} job={job} />
                </div>
            </div>
        </div>
    );
}
