import { Link, useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js";
import {
    Home,
    Briefcase,
    User,
    Settings,
    LogOut,
    MessageCircle,
    Wrench,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown.jsx";
import SearchBar from "./SearchBar.jsx";

export function NavBar() {
    const logout = useLogout();
    const location = useLocation();
    const { user } = useAuthContext();

    const isActive = (path) =>
        location.pathname === path
            ? "text-emerald-600 bg-emerald-50"
            : "text-slate-600 hover:text-emerald-600";

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <h1 className="text-2xl font-bold text-emerald-600">
                        ElKhadema
                    </h1>
                </Link>

                {user ? (
                    <>
                        {/* Search */}
                        <div className="hidden md:block w-80">
                            <SearchBar />
                        </div>

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
