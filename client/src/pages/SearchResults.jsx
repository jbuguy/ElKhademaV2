import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { Search, User, Briefcase, FileText, MapPin, Calendar } from "lucide-react";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";
import { format } from "date-fns";

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const typeParam = searchParams.get("type") || "all";
    
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(typeParam);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query || query.length < 2) return;

            try {
                setLoading(true);
                // Always fetch all types to show counts
                const res = await api.get(
                    `/search?q=${encodeURIComponent(query)}&type=all`,
                    {
                        headers: { authorization: `Bearer ${user.token}` },
                    }
                );
                setResults(res.data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, user.token]);

    const tabs = [
        { id: "all", label: "All", icon: Search },
        { id: "user", label: "People", icon: User },
        { id: "job", label: "Jobs", icon: Briefcase },
        { id: "post", label: "Posts", icon: FileText },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ q: query, type: tabId });
    };

    if (!query) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center py-20">
                        <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">
                            Start Searching
                        </h2>
                        <p className="text-slate-500">
                            Use the search bar to find people, jobs, and posts
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Search Results
                    </h1>
                    <p className="text-slate-600">
                        {results?.totalResults || 0} results for "{query}"
                    </p>
                </div>

                <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-2">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const count =
                                tab.id === "all"
                                    ? results?.totalResults
                                    : results?.results?.[
                                          tab.id === "user" ? "users" : tab.id === "job" ? "jobs" : "posts"
                                      ]?.length || 0;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                        activeTab === tab.id
                                            ? "bg-emerald-600 text-white shadow-md"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                    {count > 0 && (
                                        <span
                                            className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                                activeTab === tab.id
                                                    ? "bg-white/20 text-white"
                                                    : "bg-slate-200 text-slate-700"
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {(activeTab === "all" || activeTab === "user") &&
                            results?.results?.users?.length > 0 && (
                                <ResultSection title="People" icon={User}>
                                    {results.results.users.map((user) => (
                                        <UserCard key={user._id} user={user} />
                                    ))}
                                </ResultSection>
                            )}

                        {(activeTab === "all" || activeTab === "job") &&
                            results?.results?.jobs?.length > 0 && (
                                <ResultSection title="Jobs" icon={Briefcase}>
                                    {results.results.jobs.map((job) => (
                                        <JobCard key={job._id} job={job} query={query} />
                                    ))}
                                </ResultSection>
                            )}

                        {(activeTab === "all" || activeTab === "post") &&
                            results?.results?.posts?.length > 0 && (
                                <ResultSection title="Posts" icon={FileText}>
                                    {results.results.posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))}
                                </ResultSection>
                            )}

                        {results?.totalResults === 0 && (
                            <div className="text-center py-20">
                                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                    No results found
                                </h3>
                                <p className="text-slate-500">
                                    Try different keywords
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultSection({ title, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Icon size={20} className="text-emerald-600" />
                    {title}
                </h2>
            </div>
            <div className="divide-y divide-slate-200">{children}</div>
        </div>
    );
}

function UserCard({ user }) {
    return (
        <Link
            to={`/profile/${user.username}`}
            className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4"
        >
            <img
                src={user.profilePic || "https://i.pravatar.cc/150"}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                    {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-slate-600">@{user.username}</p>
                {user.location && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {user.location}
                    </p>
                )}
            </div>
        </Link>
    );
}

function JobCard({ job, query }) {
    const locationStr = job.location?.city 
        ? `${job.location.city}${job.location.country ? ', ' + job.location.country : ''}`
        : '';
    
    return (
        <Link
            to={`/jobs?search=${encodeURIComponent(query)}`}
            className="px-6 py-4 hover:bg-slate-50 transition-colors"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">{job.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{job.postedBy?.username}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                        {locationStr && (
                            <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {locationStr}
                            </span>
                        )}
                        {job.jobType && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                                {job.jobType}
                            </span>
                        )}
                    </div>
                </div>
                {job.createdAt && (
                    <span className="text-xs text-slate-400">
                        {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </span>
                )}
            </div>
        </Link>
    );
}

function PostCard({ post }) {
    return (
        <Link
            to={`/post/${post._id}`}
            className="px-6 py-4 hover:bg-slate-50 transition-colors"
        >
            <div className="flex items-start gap-3">
                <img
                    src={post.userId?.profilePic || "https://i.pravatar.cc/150"}
                    alt={post.userId?.username}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-1">
                        <span className="font-medium text-slate-800">
                            @{post.userId?.username}
                        </span>
                    </p>
                    <p className="text-slate-800 line-clamp-3">{post.content}</p>
                    {post.createdAt && (
                        <span className="text-xs text-slate-400 mt-2 inline-block">
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
