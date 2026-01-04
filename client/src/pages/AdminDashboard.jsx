import { useEffect, useState } from "react";
import api from "../utils/api.js";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="p-6">Loading users...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Username</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Active</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t">
                                <td className="px-4 py-2">{u.username}</td>
                                <td className="px-4 py-2">{u.email}</td>
                                <td className="px-4 py-2">
                                    <select
                                        value={u.role}
                                        onChange={(e) =>
                                            updateRole(u._id, e.target.value)
                                        }
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="user">user</option>
                                        <option value="company">company</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={u.active || false}
                                        onChange={(e) =>
                                            toggleActive(
                                                u._id,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => removeUser(u._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-3">Reports</h2>
                {loadingReports ? (
                    <div>Loading reports...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">
                                        Type
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Target ID
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Reporter
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Reason
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((r) => (
                                    <tr key={r._id} className="border-t">
                                        <td className="px-4 py-2">{r.type}</td>
                                        <td className="px-4 py-2">
                                            {r.targetId}
                                        </td>
                                        <td className="px-4 py-2">
                                            {r.reporter?.username ||
                                                r.reporter?.email}
                                        </td>
                                        <td className="px-4 py-2">
                                            {r.reason}
                                        </td>
                                        <td className="px-4 py-2">
                                            {r.status}
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={r.status}
                                                onChange={(e) =>
                                                    updateReportStatus(
                                                        r._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border px-2 py-1 rounded mr-2"
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
                                            <button
                                                onClick={() =>
                                                    removeReport(r._id)
                                                }
                                                className="px-3 py-1 bg-red-500 text-white rounded"
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
    );
}
