import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";
import {
    FileText,
    Download,
    Mail,
    MapPin,
    Briefcase,
    Calendar,
    Clock,
    Filter,
    Search,
    ChevronDown,
    MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        reviewed: "bg-blue-100 text-blue-800 border-blue-200",
        interviewing: "bg-purple-100 text-purple-800 border-purple-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
        hired: "bg-green-100 text-green-800 border-green-200",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                styles[status] || styles.pending
            }`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const ApplicationCard = ({ application, onStatusChange, onMessage }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setIsChangingStatus(true);
        await onStatusChange(application.jobId, application._id, newStatus);
        setIsChangingStatus(false);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const downloadFile = (fileId, fileName) => {
        window.open(
            `http://localhost:5001/api/media/pdf/${fileId}`,
            "_blank"
        );
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md">
            <div
                className="p-6 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <img
                            src={
                                application.applicant?.profilePic ||
                                "https://ui-avatars.com/api/?name=" +
                                    application.applicant?.username
                            }
                            alt={application.applicant?.username}
                            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100"
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {application.applicant?.username}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                <Mail size={14} />
                                <span>{application.applicant?.email}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-1 text-slate-700">
                                    <Briefcase size={14} />
                                    <span className="font-medium">
                                        {application.jobTitle}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-600">
                                    <Calendar size={14} />
                                    <span>
                                        Applied {formatDate(application.appliedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <StatusBadge status={application.status} />
                        <ChevronDown
                            className={`text-slate-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                            }`}
                            size={20}
                        />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">
                                Job Details
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin size={14} />
                                    <span>
                                        {application.jobLocation?.city},{" "}
                                        {application.jobLocation?.country}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Briefcase size={14} />
                                    <span>{application.jobType}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">
                                Application Documents
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() =>
                                        downloadFile(
                                            application.resume,
                                            "Resume.pdf"
                                        )
                                    }
                                    className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    <Download size={14} />
                                    <span>Download Resume</span>
                                </button>
                                <button
                                    onClick={() =>
                                        downloadFile(
                                            application.coverLetter,
                                            "CoverLetter.pdf"
                                        )
                                    }
                                    className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    <FileText size={14} />
                                    <span>Download Cover Letter</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                        <button
                            onClick={() => onMessage(application.applicant)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                            <MessageSquare size={16} />
                            <span>Message Applicant</span>
                        </button>

                        <div className="flex gap-2">
                            {application.status !== "reviewed" && (
                                <button
                                    onClick={() => handleStatusChange("reviewed")}
                                    disabled={isChangingStatus}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium disabled:opacity-50"
                                >
                                    Mark Reviewed
                                </button>
                            )}
                            {application.status !== "interviewing" && (
                                <button
                                    onClick={() =>
                                        handleStatusChange("interviewing")
                                    }
                                    disabled={isChangingStatus}
                                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium disabled:opacity-50"
                                >
                                    Schedule Interview
                                </button>
                            )}
                            {application.status !== "hired" && (
                                <button
                                    onClick={() => handleStatusChange("hired")}
                                    disabled={isChangingStatus}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium disabled:opacity-50"
                                >
                                    Mark Hired
                                </button>
                            )}
                            {application.status !== "rejected" && (
                                <button
                                    onClick={() => handleStatusChange("rejected")}
                                    disabled={isChangingStatus}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CompanyApplications = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        if (!user || user.role !== "company") {
            navigate("/");
            return;
        }
        fetchApplications();
    }, [user, navigate]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await api.get("/jobs/company/applications");
            setApplications(response.data.applications);
            setFilteredApplications(response.data.applications);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = applications;

        if (searchTerm) {
            filtered = filtered.filter(
                (app) =>
                    app.applicant?.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    app.applicant?.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((app) => app.status === statusFilter);
        }

        setFilteredApplications(filtered);
    }, [searchTerm, statusFilter, applications]);

    const handleStatusChange = async (jobId, applicantId, newStatus) => {
        try {
            await api.patch(`/jobs/${jobId}/applicants/${applicantId}`, {
                status: newStatus,
                userId: user._id,
            });
            // Refresh applications
            fetchApplications();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update application status");
        }
    };

    const handleMessage = (applicant) => {
        navigate("/messages", { state: { startChatWith: applicant } });
    };

    const stats = {
        total: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        reviewed: applications.filter((a) => a.status === "reviewed").length,
        interviewing: applications.filter((a) => a.status === "interviewing")
            .length,
        hired: applications.filter((a) => a.status === "hired").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-lg text-slate-600">Loading applications...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="page-container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Job Applications
                    </h1>
                    <p className="text-slate-600">
                        Manage applications for your job postings
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <div className="text-2xl font-bold text-slate-900">
                            {stats.total}
                        </div>
                        <div className="text-sm text-slate-600">Total Applications</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-800">
                            {stats.pending}
                        </div>
                        <div className="text-sm text-yellow-700">Pending</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-800">
                            {stats.reviewed}
                        </div>
                        <div className="text-sm text-blue-700">Reviewed</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-2xl font-bold text-purple-800">
                            {stats.interviewing}
                        </div>
                        <div className="text-sm text-purple-700">Interviewing</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-800">
                            {stats.hired}
                        </div>
                        <div className="text-sm text-green-700">Hired</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by applicant name, email, or job title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                        </select>
                    </div>
                </div>

                {/* Applications List */}
                {filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                        <FileText className="mx-auto mb-4 text-slate-300" size={48} />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                            No applications found
                        </h3>
                        <p className="text-slate-600">
                            {applications.length === 0
                                ? "You haven't received any applications yet"
                                : "No applications match your filters"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((application) => (
                            <ApplicationCard
                                key={application._id}
                                application={application}
                                onStatusChange={handleStatusChange}
                                onMessage={handleMessage}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyApplications;
