import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
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
import { JobCard } from "./jobs";
import { useNavigate, useLocation } from "react-router-dom";
import { useJobCreation } from "../hooks/useJobCreation.js";

const Hero = ({ isEditing }) => (
    <div className="bg-emerald-600 text-white py-8 px-4 rounded-t-xl">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">
                {isEditing ? "Edit " : "Post a"} Job
            </h1>
            <p className="text-teal-100">
                {isEditing
                    ? "Edit your job listing"
                    : "Fill in the details to create your job listing"}
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
                    name="title"
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
                    name="category"
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
                    name="description"
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
                    name="jobType"
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
                    name="experienceLevel"
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
                    name="deadline"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            </div>
        </div>
    </div>
);
const JobLocationForm = ({ job, handleChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    Location
                </div>
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="isRemote"
                        className="relative inline-flex items-center cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            id="isRemote"
                            name="location.isRemote"
                            checked={job.location.isRemote}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>{" "}
                    </label>
                    <label
                        htmlFor="isRemote"
                        className="text-sm font-medium text-gray-700"
                    >
                        This is a remote position
                    </label>
                </div>
            </h2>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            value={job.location.city}
                            name="location.city"
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
                            name="location.country"
                            value={job.location.country}
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
                        name="location.address"
                        value={job.location.address}
                        onChange={handleChange}
                        placeholder="Full address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
};
const JobSalaryForm = ({ job, handleChange, setJob }) => {
    useEffect(() => {
        const { min, max, currency } = job.salary;

        const format = (num) => {
            if (!num) return "";
            return num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num;
        };

        let calculatedRange = "Not disclosed";

        if (min || max) {
            calculatedRange = `${currency} ${format(min) || "0"} - ${format(max) || "0"}`;
        }

        setJob((prev) => ({
            ...prev,
            salary: {
                ...prev.salary,
                salaryRange: calculatedRange,
            },
        }));
    }, [job.salary.min, job.salary.max, job.salary.currency]);
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-teal-600" />
                    Salary Information
                </div>
                <div className="flex items-center gap-3">
                    <label
                        htmlFor="hideSalary"
                        className="relative inline-flex items-center cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            name="salary.hideSalary"
                            id="hideSalary"
                            checked={job.salary.hideSalary}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                    <label
                        htmlFor="hideSalary"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        Hide salary from job listing
                    </label>
                </div>
            </h2>

            <div className="space-y-4">
                {!job.salary.hideSalary && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Salary
                                </label>
                                <input
                                    type="number"
                                    name="salary.min"
                                    value={job.salary.min}
                                    onChange={(e) => {
                                        handleChange(e);
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
                                    name="salary.max"
                                    value={job.salary.max}
                                    onChange={(e) => {
                                        handleChange(e);
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
                                    value={job.salary.currency}
                                    name="salary.currency"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                    <option value="AUD">AUD</option>
                                    <option value="TND">TND</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Period
                                </label>
                                <select
                                    value={job.salary.period}
                                    name="salary.period"
                                    onChange={(e) => {
                                        handleChange(e);
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
                                <label
                                    htmlFor="isNegotiable"
                                    className="relative inline-flex items-center cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        name="salary.isNegotiable"
                                        id="isNegotiable"
                                        checked={job.salary.isNegotiable}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
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
    const addRequirement = (event) => {
        const newRequirements = [...job.requirements, event.target.value];
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
    const addResponsibility = (event) => {
        const newResponsibility = [...job.responsibilities, event.target.value];
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
                    onKeyUp={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    style={{ margin: "0px" }}
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
                    onKeyUp={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    placeholder="e.g., User Research, Prototyping"
                    style={{ margin: "0px" }}
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
        <div className="sticky top-50 ">
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
const SubmitButtons = ({ job, setJob, isEditing }) => {
    const { createjob, updatejob } = useJobCreation();
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "",
    });
    const Navigate = useNavigate();
    const handleSubmit = async (status) => {
        if (!job.title || !job.category || !job.description) {
            setNotification({
                show: true,
                message: "Please fill in all required fields (*)",
                type: "error",
            });
            return;
        }
        try {
            const jobToSubmit = { ...job, status };
            if (isEditing) {
                await updatejob(jobToSubmit);
                setNotification({
                    show: true,
                    message: "Job updated successfully!",
                    type: "success",
                });
                setTimeout(() => {
                    Navigate("/jobs");
                }, 3000);
            } else {
                await createjob(jobToSubmit);
                setNotification({
                    show: true,
                    message: "Job posted successfully!",
                    type: "success",
                });

                setTimeout(() => {
                    Navigate("/jobs");
                }, 3000);
            }
        } catch (err) {
            setNotification({ show: true, message: err, type: "error" });
        }
    };

    return (
        <>
            <div className="relative">
                {notification.show && (
                    <div
                        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 text-white font-semibold transition-all duration-500 
                    ${
                        notification.type === "success"
                            ? "bg-green-800"
                            : "bg-red-800"
                    }`}
                    >
                        {notification.message}
                    </div>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => handleSubmit("published")}
                    className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-medium transition-colors"
                >
                    {isEditing ? "Update Job" : "Publish Job"}
                </button>
                {!isEditing && (
                    <button
                        onClick={() => handleSubmit("draft")}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Save as Draft
                    </button>
                )}
            </div>
        </>
    );
};
export default function JobCreation() {
    const { user } = useAuthContext();
    const Navigate = useNavigate();
    const location = useLocation();
    const jobToEdit = location.state?.jobToEdit;
    const [job, setJob] = useState(
        jobToEdit || {
            title: "",
            postedBy: user._id,
            description: "",
            category: "",
            jobType: "Full Time",
            experienceLevel: "Mid Level",
            deadline: "",
            location: {
                city: "",
                country: "",
                isRemote: false,
                address: "",
            },
            salary: {
                min: "",
                max: "",
                salaryRange: "",
                currency: "USD",
                period: "yearly",
                isNegotiable: false,
                hideSalary: false,
            },
            requirements: [""],
            responsibilities: [""],
            tags: [],
            skills: [],
            status: "",
        }
    );
    const isEditing = Boolean(jobToEdit);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;

        setJob((prev) => {
            if (name.includes(".")) {
                const [parent, child] = name.split(".");
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: finalValue,
                    },
                };
            }
            return {
                ...prev,
                [name]: finalValue,
            };
        });
    };
    if (jobToEdit && user._id !== jobToEdit.postedBy) {
        Navigate("/jobs");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Hero isEditing={isEditing} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            <BasicInfoForm
                                job={job}
                                handleChange={handleChange}
                            />
                            <JobDetailsForm
                                job={job}
                                handleChange={handleChange}
                            />
                            <JobLocationForm
                                job={job}
                                handleChange={handleChange}
                            />
                            <JobSalaryForm
                                job={job}
                                setJob={setJob}
                                handleChange={handleChange}
                            />
                            <JobRequirements job={job} setJob={setJob} />
                            <JobResponsibilitiesForm
                                job={job}
                                setJob={setJob}
                            />
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
                            <SubmitButtons
                                job={job}
                                setJob={setJob}
                                isEditing={isEditing}
                            />
                        </div>
                    </div>
                    <Previewjob key={job.id} job={job} />
                </div>
            </div>
        </div>
    );
}
