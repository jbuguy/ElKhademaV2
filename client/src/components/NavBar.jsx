import { Link, useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js";
import { useState } from "react";
import {
    Home,
    Briefcase,
    User,
    Settings,
    Search,
    LogOut,
    MessageCircle,
    Wrench,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown.jsx";

export function NavBar() {
    const logout = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const isActive = (path) =>
        location.pathname === path
            ? "text-emerald-600 bg-emerald-50"
            : "text-slate-600 hover:text-emerald-600";

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex items-center">
                    <img src="../../public/vite.svg" alt="logo" className="h-10 w-10 shrink-0" />
                    <h1 className="font-bold leading-none tracking-tighter text-gray-900 mt-2.5" style={{letterSpacing:"-5",fontSize:"28px"}}>
                        hadema
                    </h1>
                    </div>
                </Link>

                {user ? (
                    <>
                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 w-150 focus-within:ring-2 focus-within:ring-emerald-500 transition"
                        >
                            <Search size={20} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="ml-3 mt-0.5 flex-1 outline-none text-sm  bg-transparent"
                            />
                        </form>

                        {/* Navigation Icons */}
                        <nav className="flex items-center gap-2">
                            <Link
                                to="/"
                                className={`p-2.5 rounded-full transition ${isActive(
                                    "/"
                                )}`}
                            >
                                <Home size={20} />
                            </Link>

                            <Link
                                to="/jobs"
                                className={`p-2.5 rounded-full transition ${isActive(
                                    "/jobs"
                                )}`}
                            >
                                <Briefcase size={20} />
                            </Link>

                            <Link
                                to="/profile"
                                className={`p-2.5 rounded-full transition ${isActive(
                                    "/profile"
                                )}`}
                            >
                                <User size={20} />
                            </Link>

                            {user.role === "admin" && (
                                <Link
                                    to="/admin"
                                    className={`p-2.5 rounded-full transition ${isActive(
                                        "/admin"
                                    )}`}
                                >
                                    <Wrench size={20} />
                                </Link>
                            )}

                            <Link
                                to="/messages"
                                className="p-2.5 rounded-full text-slate-600 hover:text-emerald-600 transition"
                            >
                                <MessageCircle size={20} />
                            </Link>

                            <NotificationDropdown />

                            <button
                                onClick={logout}
                                title="Logout"
                                className="p-2.5 rounded-full text-slate-600 hover:text-red-600 transition"
                            >
                                <LogOut size={20} />
                            </button>
                        </nav>
                    </>
                ) : (
                    /* Auth buttons */
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-emerald-600 font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
