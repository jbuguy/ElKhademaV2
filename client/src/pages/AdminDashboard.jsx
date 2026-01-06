import { useEffect, useState } from "react";
import api from "../utils/api.js";
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    ChevronDown,
    Users,
    FileText,
    TrendingUp,
    AlertCircle,
} from "lucide-react";

const USERS_PER_PAGE = 8;
const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
];

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usersPage, setUsersPage] = useState(1);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoadingReports(true);
            const res = await api.get("/admin/reports");
            setReports(res.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoadingReports(false);
        }
    };

    // Pagination helpers
    const visibleUsers = users.slice(0, usersPage * USERS_PER_PAGE);
    const hasMoreUsers = visibleUsers.length < users.length;

    // Chart data
    const roleData = users.reduce((acc, u) => {
        const existing = acc.find((x) => x.name === u.role);
        if (existing) existing.value++;
        else acc.push({ name: u.role || "unassigned", value: 1 });
        return acc;
    }, []);

    const activeData = [
        { name: "Active", value: users.filter((u) => u.active).length },
        { name: "Inactive", value: users.filter((u) => !u.active).length },
    ];

    const reportStatusData = reports.reduce((acc, r) => {
        const existing = acc.find((x) => x.name === r.status);
        if (existing) existing.value++;
        else acc.push({ name: r.status || "unknown", value: 1 });
        return acc;
    }, []);

    const updateRole = async (id, role) => {
        try {
            await api.patch(`/admin/user/${id}`, { role });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const toggleActive = async (id, active) => {
        try {
            await api.patch(`/admin/user/${id}`, { active });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const removeUser = async (id) => {
        if (!confirm("Delete this user and their posts?")) return;
        try {
            await api.delete(`/admin/user/${id}`);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const updateReportStatus = async (id, status) => {
        try {
            await api.patch(`/admin/report/${id}`, { status });
            fetchReports();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const removeReport = async (id) => {
        if (!confirm("Delete this report?")) return;
        try {
            await api.delete(`/admin/report/${id}`);
            fetchReports();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600 text-lg">
                    Loading dashboard...
                </div>
            </div>
        );
    if (error)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-600 text-lg">Error: {error}</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage users, reports, and system analytics
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">
                                    Total Users
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {users.length}
                                </p>
                            </div>
                            <Users className="w-12 h-12 opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium">
                                    Active Users
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {users.filter((u) => u.active).length}
                                </p>
                            </div>
                            <TrendingUp className="w-12 h-12 opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium">
                                    Total Reports
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {reports.length}
                                </p>
                            </div>
                            <FileText className="w-12 h-12 opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-rose-100 text-sm font-medium">
                                    Open Reports
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {
                                        reports.filter(
                                            (r) => r.status === "open"
                                        ).length
                                    }
                                </p>
                            </div>
                            <AlertCircle className="w-12 h-12 opacity-30" />
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Users by Role */}
                    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                        <h3 className="text-gray-900 font-semibold mb-4">
                            Users by Role
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#f3f4f6",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        color: "#111827",
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Active Status */}
                    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                        <h3 className="text-gray-900 font-semibold mb-4">
                            User Status
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={activeData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#f3f4f6",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        color: "#111827",
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Report Status */}
                    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                        <h3 className="text-gray-900 font-semibold mb-4">
                            Reports by Status
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={reportStatusData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#f3f4f6",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        color: "#111827",
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#f59e0b"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Users Management
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleUsers.map((u) => (
                                    <tr
                                        key={u._id}
                                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-gray-900">
                                            {u.username}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.role}
                                                onChange={(e) =>
                                                    updateRole(
                                                        u._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-white border border-gray-300 text-gray-900 px-3 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="user">
                                                    user
                                                </option>
                                                <option value="company">
                                                    company
                                                </option>
                                                <option value="admin">
                                                    admin
                                                </option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={u.active || false}
                                                    onChange={(e) =>
                                                        toggleActive(
                                                            u._id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="w-4 h-4"
                                                />
                                                <span
                                                    className={`text-sm font-medium ${
                                                        u.active
                                                            ? "text-emerald-600"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {u.active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    removeUser(u._id)
                                                }
                                                className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded text-sm transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {hasMoreUsers && (
                        <div className="p-6 border-t border-gray-200 flex justify-center">
                            <button
                                onClick={() => setUsersPage(usersPage + 1)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 shadow-md"
                            >
                                Load More Users
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {!hasMoreUsers && users.length > USERS_PER_PAGE && (
                        <div className="p-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                            Showing all {users.length} users
                        </div>
                    )}
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Reports Management
                        </h2>
                    </div>
                    {loadingReports ? (
                        <div className="p-6 text-center text-gray-600">
                            Loading reports...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Target ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Reporter
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((r) => (
                                        <tr
                                            key={r._id}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-gray-900 text-sm font-medium">
                                                {r.type}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {r.targetId?.substring(0, 12)}
                                                ...
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 text-sm">
                                                {r.reporter?.username ||
                                                    r.reporter?.email}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {r.reason}
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={r.status}
                                                    onChange={(e) =>
                                                        updateReportStatus(
                                                            r._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-white border border-gray-300 text-gray-900 px-3 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="open">
                                                        open
                                                    </option>
                                                    <option value="in_review">
                                                        in_review
                                                    </option>
                                                    <option value="closed">
                                                        closed
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        removeReport(r._id)
                                                    }
                                                    className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded text-sm transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
