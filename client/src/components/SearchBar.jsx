import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Search, User, Briefcase, FileText } from "lucide-react";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                setLoading(true);
                const res = await api.get(
                    `/search/suggestions?q=${encodeURIComponent(query)}`,
                    {
                        headers: { authorization: `Bearer ${user.token}` },
                    }
                );
                setSuggestions(res.data.suggestions || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [query, user.token]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.text);
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
    };

    const getIcon = (type) => {
        switch (type) {
            case "user":
                return <User size={16} />;
            case "job":
                return <Briefcase size={16} />;
            case "post":
                return <FileText size={16} />;
            default:
                return <Search size={16} />;
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search people, jobs, posts..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                        className="ml-2 flex-1 outline-none text-sm bg-transparent"
                    />
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                        >
                            <span className="text-slate-500">{getIcon(suggestion.type)}</span>
                            <span className="text-slate-800">{suggestion.text}</span>
                            <span className="ml-auto text-xs text-slate-400 capitalize">
                                {suggestion.type}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
