import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import api from "../utils/api.js";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicationModal } from "./jobApplication.jsx";
import { Link } from "react-router-dom";
import {
    MapPin,
    Briefcase,
    DollarSign,
    Calendar,
    Clock,
    Users,
    Building2,
    Globe,
    Mail,
    Phone,
    Award,
    CheckCircle,
    Trash,
    Edit,
    AlertTriangle,
    Download,
    FileText,
    XCircle,
} from "lucide-react";
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-scale-in">
                <div className="bg-red-500 p-4 flex items-center gap-3">
                    <AlertTriangle className="text-white" size={24} />
                    <h3 className="text-xl font-bold text-white">
                        Confirm Deletion
                    </h3>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 mb-2">
                        Are you sure you want to delete this job posting?
                    </p>
                    <p className="text-gray-900 font-semibold mb-4">
                        "{jobTitle}"
                    </p>
                    <p className="text-sm text-gray-600 bg-red-50 border border-red-200 rounded p-3">
                        <strong>Warning:</strong> This action cannot be undone.
                        All applicants and related data will be permanently
                        removed.
                    </p>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        Delete Job
                    </button>
                </div>
            </div>
        </div>
    );
};
const JobHeader = ({
    user,
    openApplication,
    job,
    poster,
    handleDeleteClick,
}) => {
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate("/jobs/form", { state: { jobToEdit: job } });
    };
    return (
        <div className="bg-emerald-600 text-white p-8 rounded-lg shadow-lg mb-6">
            <div className="flex items-start gap-6">
                <img
                    src={poster?.profilePic}
                    alt={poster?.companyName}
                    className="w-20 h-20 rounded-lg bg-white p-2 shadow-md"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2 text-emerald-50 mb-3">
                        <Building2 size={18} />
                        <span className="text-lg font-medium">
                            {poster?.companyName}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>
                                {job.location.city}, {job.location.country}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Briefcase size={16} />
                            <span>{job.jobType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Award size={16} />
                            <span>{job.experienceLevel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>
                                {job.applicants?.filter(
                                    (app) => app.status === "pending"
                                )?.length || 0}{" "}
                                Pending
                            </span>
                        </div>
                    </div>
                </div>
                {user.role === "user" ? (
                    job?.applicants?.find(
                        (app) =>
                            app.user?._id === user._id || app.user === user._id
                    ) ? (
                        <button
                            disabled
                            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md cursor-default capitalize"
                        >
                            {
                                job.applicants.find(
                                    (app) =>
                                        app.user?._id === user._id ||
                                        app.user === user._id
                                ).status
                            }
                        </button>
                    ) : (
                        <button
                            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-md"
                            onClick={() => openApplication()}
                        >
                            Apply Now
                        </button>
                    )
                ) : (
                    user._id === job.postedBy && (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleEdit}
                                className="bg-white  flex gap-5 text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-md"
                            >
                                <Edit /> Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="bg-red-600 flex gap-5 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
                            >
                                <Trash /> Delete
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

const JobDetails = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
                icon={<DollarSign className="text-emerald-500" size={20} />}
                label="Salary Range"
                value={
                    !job.salary.hideSalary ? job.salaryRange : "Not disclosed"
                }
            />
            <DetailItem
                icon={<Calendar className="text-emerald-500" size={20} />}
                label="Application Deadline"
                value={new Date(job.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })}
            />
            <DetailItem
                icon={<Clock className="text-emerald-500" size={20} />}
                label="Posted"
                value={new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })}
            />
            <DetailItem
                icon={<Users className="text-emerald-500" size={20} />}
                label="Category"
                value={job.category}
            />
        </div>
    </div>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {icon}
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm text-gray-800 font-semibold">{value}</p>
        </div>
    </div>
);

const JobDescription = ({ description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About This Role
        </h2>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

const JobRequirements = ({ requirements, responsibilities }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Requirements
            </h2>
            <ul className="space-y-2">
                {requirements.map((req, index) => (
                    <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                    >
                        <CheckCircle
                            className="text-emerald-500 mt-0.5 flex-shrink-0"
                            size={18}
                        />
                        <span>{req}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Responsibilities
            </h2>
            <ul className="space-y-2">
                {responsibilities.map((resp, index) => (
                    <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                    >
                        <CheckCircle
                            className="text-emerald-500 mt-0.5 flex-shrink-0"
                            size={18}
                        />
                        <span>{resp}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const SkillsTags = ({ skills, tags }) => (
    <>
        {skills && skills.length > 0 && tags && tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {skills && skills.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">
                            Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {tags && tags.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
        ;
    </>
);
const ApplicantCard = ({ applicant, onStatusUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const handleStatusUpdate = async (newStatus) => {
        setIsUpdating(true);
        await onStatusUpdate(applicant._id, newStatus);
        setIsUpdating(false);
    };
    useEffect(() => {
        const fetchUser = async () => {
            if (!applicant.user) {
                setIsLoadingUser(false);
                return;
            }

            try {
                const res = await api.get(`/user/profile/id/${applicant.user}`);
                setUserData(res.data.profile);
            } catch (error) {
                console.error("Error fetching applicant details:", error);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUser();
    }, [applicant.user]);
    const getStatusColor = (status) => {
        switch (status) {
            case "accepted":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };
    console.log(userData);
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 font-semibold text-lg">
                                    {userData?.profilePic ? (
                                        <img
                                            src={userData?.profilePic}
                                            alt=""
                                        />
                                    ) : (
                                        "loading"
                                    )}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {isLoadingUser
                                        ? "Loading..."
                                        : (userData?.firstName ||
                                              userData?.email) +
                                          " " +
                                          (userData?.lastName || "")}
                                </h3>
                                <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                        applicant.status
                                    )}`}
                                >
                                    {applicant.status.charAt(0).toUpperCase() +
                                        applicant.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                            {userData?.email && (
                                <div className="flex items-center gap-1">
                                    <Mail size={14} />
                                    <span>{userData.email}</span>
                                </div>
                            )}
                            {userData?.phoneNumber && (
                                <div className="flex items-center gap-1">
                                    <Phone size={14} />
                                    <span>{userData.phoneNumber}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>
                                    Applied{" "}
                                    {new Date(
                                        applicant.appliedAt
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {applicant.resume && (
                                <a
                                    href={`http://localhost:5001/api/media/pdf/${applicant.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                                >
                                    <Download size={14} />
                                    Resume
                                </a>
                            )}
                            {applicant.coverLetter && (
                                <a
                                    href={`http://localhost:5001/api/media/pdf/${applicant.coverLetter}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                                >
                                    <FileText size={14} />
                                    Cover Letter
                                </a>
                            )}
                        </div>
                    </div>

                    {applicant.status === "pending" && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleStatusUpdate("hired")}
                                disabled={isUpdating}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Accept"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button
                                onClick={() => handleStatusUpdate("rejected")}
                                disabled={isUpdating}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {applicant.additionalInfo && (
                    <div className="mt-3">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp size={16} />
                                    Hide Details
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={16} />
                                    Show Details
                                </>
                            )}
                        </button>
                        {isExpanded && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                {applicant.additionalInfo}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ApplicantsManager = ({ job, onStatusUpdate }) => {
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredApplicants = job.applicants?.filter((app) => {
        if (filterStatus === "all") return true;
        return app.status === filterStatus;
    });

    const counts = {
        all: job.applicants?.length || 0,
        pending:
            job.applicants?.filter((app) => app.status === "pending").length ||
            0,
        accepted:
            job.applicants?.filter((app) => app.status === "accepted").length ||
            0,
        rejected:
            job.applicants?.filter((app) => app.status === "rejected").length ||
            0,
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Users className="text-emerald-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                        Applicants
                    </h2>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {counts.all}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                        filterStatus === "all"
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    All ({counts.all})
                </button>
                <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                        filterStatus === "pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Pending ({counts.pending})
                </button>
                <button
                    onClick={() => setFilterStatus("accepted")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                        filterStatus === "accepted"
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Accepted ({counts.accepted})
                </button>
                <button
                    onClick={() => setFilterStatus("rejected")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                        filterStatus === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    Rejected ({counts.rejected})
                </button>
            </div>

            {filteredApplicants && filteredApplicants.length > 0 ? (
                <div className="space-y-3">
                    {filteredApplicants.map((applicant) => (
                        <ApplicantCard
                            key={applicant._id}
                            applicant={applicant}
                            onStatusUpdate={onStatusUpdate}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">No applicants yet</p>
                    <p className="text-sm mt-1">
                        {filterStatus === "all"
                            ? "Applications will appear here once candidates apply"
                            : `No ${filterStatus} applications`}
                    </p>
                </div>
            )}
        </div>
    );
};
const CompanyInfo = ({ poster }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About {poster?.companyName}
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
            {poster?.companyDescription}
        </p>

        <div className="space-y-3 mb-4">
            <InfoRow
                icon={<Building2 size={18} />}
                label="Industry"
                value={poster?.industry}
            />
            <InfoRow
                icon={<Users size={18} />}
                label="Company Size"
                value={`${poster?.companySize} employees`}
            />
            <InfoRow
                icon={<MapPin size={18} />}
                label="Location"
                value={poster?.location}
            />
            {poster?.foundedDate && (
                <InfoRow
                    icon={<Calendar size={18} />}
                    label="Founded"
                    value={new Date(poster.foundedDate).getFullYear()}
                />
            )}
        </div>

        <div className="border-t pt-4 space-y-2">
            {poster?.website && (
                <a
                    href={poster.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                >
                    <Globe size={18} />
                    <span className="text-sm">{poster.website}</span>
                </a>
            )}
            {poster?.email && (
                <a
                    href={`mailto:${poster.email}`}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                >
                    <Mail size={18} />
                    <span className="text-sm">{poster.email}</span>
                </a>
            )}
            {poster?.phoneNumber && (
                <a
                    href={`tel:${poster.phoneNumber}`}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                >
                    <Phone size={18} />
                    <span className="text-sm">{poster.phoneNumber}</span>
                </a>
            )}
        </div>
    </div>
);
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-gray-700">
        <span className="text-emerald-500">{icon}</span>
        <span className="text-sm font-medium">{label}:</span>
        <span className="text-sm">{value}</span>
    </div>
);
export default function JobView() {
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const { user } = useAuthContext();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [poster, setPoster] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const onStatusUpdate = async (applicantId, newStatus) => {
        try {
            await api.patch(
                `/jobs/${jobId}/applicants/${applicantId}`,
                { status: newStatus, userId: user._id },
                {
                    headers: { authorization: `Bearer ${user.token}` },
                }
            );
            setJob((prevJob) => {
                const updatedApplicants = prevJob.applicants.map((app) =>
                    app._id === applicantId
                        ? { ...app, status: newStatus }
                        : app
                );
                return { ...prevJob, applicants: updatedApplicants };
            });
        } catch (error) {
            console.error("Error updating applicant status:", error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (!user || !jobId) return;

            try {
                const jobRes = await api.get(`/jobs/${jobId}`, {
                    headers: { authorization: `Bearer ${user.token}` },
                });
                setJob(jobRes.data);
                const posterRes = await api.get(
                    `/user/profile/id/${jobRes.data.postedBy}`,
                    {
                        headers: { authorization: `Bearer ${user.token}` },
                    }
                );
                setPoster(posterRes.data.profile);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [user, jobId]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        console.log("Deleting job:", jobId);
        try {
            await api.delete(`/jobs/${jobId}`, {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
                data: { user, job },
            });

            setShowDeleteModal(false);
            navigate("/jobs");
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };
    console.log(job);
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job details...</p>
                    <Link
                        to="/jobs"
                        className="mt-4 inline-block text-emerald-600 hover:underline"
                    >
                        Back to Job Listings
                    </Link>
                </div>
            </div>
        );
    }
    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Job not found</p>
                <Link
                    to="/jobs"
                    className="mt-4 inline-block text-emerald-600 hover:underline"
                >
                    Back to Job Listings
                </Link>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {isApplicationModalOpen && (
                <ApplicationModal
                    isOpen={isApplicationModalOpen}
                    onClose={() => setIsApplicationModalOpen(false)}
                    job={job}
                />
            )}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                jobTitle={job.title}
            />
            <div className="max-w-6xl mx-auto px-4">
                <JobHeader
                    user={user}
                    openApplication={() => setIsApplicationModalOpen(true)}
                    job={job}
                    poster={poster}
                    handleDeleteClick={handleDeleteClick}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <JobDetails job={job} />
                        <JobDescription description={job.description} />
                        <JobRequirements
                            requirements={job.requirements}
                            responsibilities={job.responsibilities}
                        />
                        <SkillsTags skills={job.skills} tags={job.tags} />
                        {user._id === job.postedBy && (
                            <ApplicantsManager
                                job={job}
                                onStatusUpdate={onStatusUpdate}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <CompanyInfo poster={poster} />
                    </div>
                </div>
            </div>
        </div>
    );
}
