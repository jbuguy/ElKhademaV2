import { Link, useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js";
import { useState } from "react";
import {
    FaSearch,
    FaHome,
    FaBriefcase,
    FaCommentDots,
    FaUserCircle,
    FaSignOutAlt,
    FaTools,
} from "react-icons/fa";
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

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <h1 className="text-2xl font-bold text-[#1aac83] transition">
                            ElKhadema
                        </h1>
                    </Link>

                    {user ? (
                        <>
                            {/* Center: Search Bar */}
                            <form
                                onSubmit={handleSearch}
                                className="flex-1 max-w-lg"
                            >
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#1aac83] bg-white text-gray-700 placeholder-gray-400 transition"
                                />
                            </form>

                            {/* Right: Icons */}
                            <nav className="flex items-center gap-3">
                                <Link
                                    to="/"
                                    className={`p-2 rounded-lg transition-all ${
                                        isActive("/")
                                            ? "text-[#1aac83] border-2 border-[#1aac83]"
                                            : "text-gray-600 hover:text-[#1aac83]"
                                    }`}
                                >
                                    <FaHome className="text-2xl" />
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`p-2 rounded-lg transition-all ${
                                        isActive("/profile")
                                            ? "text-[#1aac83] border-2 border-[#1aac83]"
                                            : "text-gray-600 hover:text-[#1aac83]"
                                    }`}
                                >
                                    <FaUserCircle className="text-2xl" />
                                </Link>
                                <Link
                                    to="/jobs"
                                    className={`p-2 rounded-lg transition-all ${
                                        isActive("/jobs")
                                            ? "text-[#1aac83] border-2 border-[#1aac83]"
                                            : "text-gray-600 hover:text-[#1aac83]"
                                    }`}
                                >
                                    <FaBriefcase className="text-2xl" />
                                </Link>
                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className={`p-2 rounded-lg transition-all ${
                                            isActive("/admin")
                                                ? "text-[#1aac83] border-2 border-[#1aac83]"
                                                : "text-gray-600 hover:text-[#1aac83]"
                                        }`}
                                    >
                                        <FaTools className="text-2xl" />
                                    </Link>
                                )}
                                <Link to={"/messages"}>
                                    <button className="text-gray-600 hover:text-[#1aac83] transition-all border-0 bg-transparent p-0">
                                        <FaCommentDots className="text-2xl" />
                                    </button>
                                </Link>
                                <NotificationDropdown />
                                <button
                                    onClick={logout}
                                    className="text-gray-600 hover:text-[#1aac83] transition-all border-0 bg-transparent p-0"
                                    title="Logout"
                                >
                                    <FaSignOutAlt className="text-2xl" />
                                </button>
                            </nav>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-[#1aac83] font-medium rounded-lg transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-[#1aac83] text-white font-medium rounded-lg hover:bg-[#158f6b] transition"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
