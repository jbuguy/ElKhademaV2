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
import {
    Home as HomeIcon,
    Briefcase,
    User,
    Settings,
    Search,
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

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <h1 className="text-2xl font-bold text-emerald-600">
                        ElKhadema
                    </h1>
                </div>

                <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ml-2 flex-1 outline-none text-sm bg-transparent placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 hover:bg-slate-100 rounded-full transition-colors">
                        <Settings size={20} className="text-slate-600" />
                    </button>
                    <button className="p-2.5 hover:bg-slate-100 rounded-full transition-colors">
                        <User size={20} className="text-slate-600" />
                    </button>
                </div>
            </div>
        </header>
    );
}
