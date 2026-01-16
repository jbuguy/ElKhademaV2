import { Search, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router";
import api from "../utils/api.js";

const Hero = () => (
    <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-400 px-8 pt-12 pb-28 flex justify-between items-center overflow-visible rounded-t-3xl shadow-lg">
        <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
                Find Your Dream Job
            </h1>
            <p className="text-lg text-white/90 mb-2 font-medium">
                Discover opportunities tailored for you
            </p>
        </div>
        <div className="hidden lg:flex items-end absolute right-20 bottom-0">
            <div className="relative z-10">
                <img
                    src="https://ouch-cdn2.icons8.com/rN-3w156_5y_E6j6y7Z-wE9kH8k0_Y_6j5-3_1.png"
                    alt="Woman Illustration"
                    className="h-64 object-contain opacity-90 drop-shadow-2xl"
                    onError={(e) => (e.target.style.display = "none")}
                />
            </div>
        </div>
    </div>
);

const SearchBar = ({
    searchTerm,
    setSearchTerm,
    locationTerm,
    setLocationTerm,
    onSearch,
}) => (
    <div className="max-w-6xl mx-auto -mt-12 px-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row items-center gap-4 border border-slate-100">
            <div className="flex-1 flex items-center gap-3 px-4 border-b md:border-b-0 md:border-r border-slate-200 py-2 w-auto">
                <Search className="text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Job title, e.g. UX Designer"
                    className="w-full outline-none text-slate-700 font-medium bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
                <MapPin className="text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Location"
                    className="w-full outline-none text-slate-700 font-medium bg-transparent"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={() => onSearch()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-10 py-3 rounded-xl transition shadow-md w-full md:w-auto"
            >
                Search
            </button>
        </div>
    </div>
);
export const JobCard = ({ job }) => {
    const navigate = useNavigate();
    const [posterProfile, setPosterProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    
    useEffect(() => {
        if (!job?.postedBy || isLoadingProfile) return;

        const fetchProfile = async () => {
            setIsLoadingProfile(true);
            try {
                const { data } = await api.get(
                    `/user/profile/id/${job.postedBy}`
                );
                setPosterProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [job?.postedBy]);
    const color = useMemo(() => {
        const targetName = job.postedBy || "";
        const hue =
            Array.from(targetName).reduce(
                (acc, char) => acc + char.charCodeAt(0),
                0
            ) % 360;

        return `hsl(${hue}, 70%, 50%)`;
    }, [job.postedBy]);
    return (
        <div 
            onClick={() => navigate(`/jobs/${job._id}`)}
            className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition cursor-pointer mb-6"
        >
            <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex gap-4">
                    <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-2 ring-emerald-100`}
                        style={{ backgroundColor: color }}
                    >
                        {posterProfile?.profile?.profilePic && posterProfile.profile.profilePic.trim() !== "" ? (
                            <img
                                src={posterProfile.profile.profilePic}
                                alt="Company Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.textContent = job.postedBy.slice(0, 2).toUpperCase();
                                }}
                            />
                        ) : (
                            job.postedBy?.slice(0, 2).toUpperCase() || "?"
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-900">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span className="font-medium">
                                {posterProfile?.profile.companyName}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {job.location.city +
                                    ", " +
                                    job.location.country}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="font-bold text-emerald-600 text-lg">
                    {!job.salary.hideSalary
                        ? job.salary.salaryRange
                        : "Not disclosed"}
                </div>
            </div>

            <p className="text-slate-600 text-base leading-relaxed mb-6">
                {job.description}
            </p>

            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2 flex-wrap">
                    {job.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                    {job.deadline}
                </span>
            </div>
        </div>
    );
};

const FilterSection = ({ title, children }) => (
    <div className="pb-6 border-b border-slate-200 last:border-b-0 last:pb-0">
        <h4 className="font-bold text-slate-800 mb-4 text-base">{title}</h4>
        <div className="space-y-2.5">{children}</div>
    </div>
);
const Checkbox = ({ label, checked, onChange }) => (
    <label className="inline-flex items-center gap-3 cursor-pointer group hover:bg-emerald-50/50 px-2 py-1.5 rounded-lg transition-colors">
        <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                checked
                    ? "bg-emerald-600 border-emerald-600 scale-105"
                    : "border-slate-300 bg-white group-hover:border-emerald-400"
            }`}
        >
            {checked && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition">
            {label}
        </span>
        <input type="checkbox" hidden checked={checked} onChange={onChange} />
    </label>
);

const CreateJobCTA = () => {
    const { user } = useAuthContext();
    
    return (
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl p-8 text-white shadow-xl sticky top-20 z-30 mb-8 border border-emerald-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <h3 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
                        Looking to Hire?
                    </h3>
                    <p className="text-white/90 text-lg font-medium">
                        Post your job opportunity and connect with top talent
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to="/applications">
                        <button className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg whitespace-nowrap border border-white/20">
                            View Applications
                        </button>
                    </Link>
                    <Link to="/jobs/form">
                        <button className="bg-white text-emerald-600 hover:bg-emerald-50 px-10 py-3 rounded-xl font-bold transition-colors shadow-lg whitespace-nowrap border border-emerald-200">
                            Post a Job
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default function Jobs() {
    const { user } = useAuthContext();

    const [filters, setFilters] = useState({
        fullTime: true,
        partTime: true,
        internship: false,
        remote: false,
        contract: false,
        junior: false,
        middle: false,
        senior: true,
    });

    const [jobs, setJobs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const SALARY_MIN = 0;
    const SALARY_MAX = 200000;
    const [salaryRange, setSalaryRange] = useState({ min: 200, max: 200000 });
    const salaryDebounceRef = useRef(null);
    const [activeThumb, setActiveThumb] = useState(null); 

    const fetchJobs = async (opts = {}) => {
        if (!user) return;
        setLoading(true);
        try {
            const params = {
                page: opts.page || page,
                limit,
            };

            if (searchTerm) params.q = searchTerm;
            if (locationTerm) params.location = locationTerm;

            const jobTypes = [];
            if (filters.fullTime) jobTypes.push("Full Time");
            if (filters.partTime) jobTypes.push("Part Time");
            if (filters.internship) jobTypes.push("Internship");
            if (filters.contract) jobTypes.push("Contract");
            if (filters.remote) jobTypes.push("Remote");
            if (jobTypes.length) params.jobType = jobTypes.join(",");

            const exps = [];
            if (filters.junior) exps.push("Junior");
            if (filters.middle) exps.push("Mid Level");
            if (filters.senior) exps.push("Senior");
            if (exps.length) params.experienceLevel = exps.join(",");

            // Salary filters
            if (typeof salaryRange?.min !== "undefined")
                params.minSalary = salaryRange.min;
            if (typeof salaryRange?.max !== "undefined")
                params.maxSalary = salaryRange.max;

            const { data } = await api.get("/jobs", {
                params,
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
            });

            setJobs(data.jobs || []);
            setTotal(data.total || 0);
            setPage(data.page || page);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced fetch on salary range change
    useEffect(() => {
        if (!user) return;
        setPage(1);
        if (salaryDebounceRef.current) clearTimeout(salaryDebounceRef.current);
        salaryDebounceRef.current = setTimeout(() => {
            fetchJobs({ page: 1 });
            salaryDebounceRef.current = null;
        }, 300);
        return () => {
            if (salaryDebounceRef.current)
                clearTimeout(salaryDebounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [salaryRange]);
    useEffect(() => {
        // initial fetch when user available
        if (user) fetchJobs({ page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        // refetch when filters change
        if (user) {
            setPage(1);
            fetchJobs({ page: 1 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
        <>
            {user.role === "company" && <CreateJobCTA />}
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
                <Hero />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    locationTerm={locationTerm}
                    setLocationTerm={setLocationTerm}
                    onSearch={() => {
                        setPage(1);
                        fetchJobs({ page: 1 });
                    }}
                />

                <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-3">
                        <div className="sticky top-4 bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-6">
                        <FilterSection title="Job Type">
                            <Checkbox
                                label="Full Time"
                                checked={filters.fullTime}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        fullTime: !filters.fullTime,
                                    })
                                }
                            />
                            <Checkbox
                                label="Part Time"
                                checked={filters.partTime}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        partTime: !filters.partTime,
                                    })
                                }
                            />
                            <Checkbox
                                label="Internship"
                                checked={filters.internship}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        internship: !filters.internship,
                                    })
                                }
                            />
                            <Checkbox
                                label="Remote"
                                checked={filters.remote}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        remote: !filters.remote,
                                    })
                                }
                            />
                            <Checkbox
                                label="Contract"
                                checked={filters.contract}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        contract: !filters.contract,
                                    })
                                }
                            />
                        </FilterSection>

                        <FilterSection title="Salary">
                            <div className="flex justify-between text-base font-semibold text-slate-700 mb-4 px-1">
                                <span>${salaryRange.min.toLocaleString()}</span>
                                <span>${salaryRange.max.toLocaleString()}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block font-medium">Min Salary</label>
                                        <input
                                            type="number"
                                            className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 no-spin bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition font-medium"
                                            value={salaryRange.min}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setSalaryRange({
                                                    ...salaryRange,
                                                    min: val,
                                                });
                                            }}
                                            onBlur={(e) => {
                                                const val = Number(e.target.value) || SALARY_MIN;
                                                setSalaryRange({
                                                    ...salaryRange,
                                                    min: Math.min(Math.max(val, SALARY_MIN), salaryRange.max - 1),
                                                });
                                            }}
                                            placeholder="0"
                                            min={SALARY_MIN}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block font-medium">Max Salary</label>
                                        <input
                                            type="number"
                                            className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 no-spin bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition font-medium"
                                            value={salaryRange.max}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setSalaryRange({
                                                    ...salaryRange,
                                                    max: val,
                                                });
                                            }}
                                            onBlur={(e) => {
                                                const val = Number(e.target.value) || SALARY_MAX;
                                                setSalaryRange({
                                                    ...salaryRange,
                                                    max: Math.max(val, salaryRange.min + 1),
                                                });
                                            }}
                                            placeholder="200000"
                                            min={salaryRange.min + 1}
                                        />
                                    </div>
                                </div>
                            </div>
                        </FilterSection>

                        <FilterSection title="Experience Level">
                            <Checkbox
                                label="Entry/Junior"
                                checked={filters.junior}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        junior: !filters.junior,
                                    })
                                }
                            />
                            <Checkbox
                                label="Middle"
                                checked={filters.middle}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        middle: !filters.middle,
                                    })
                                }
                            />
                            <Checkbox
                                label="Senior"
                                checked={filters.senior}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        senior: !filters.senior,
                                    })
                                }
                            />
                        </FilterSection>
                        </div>
                    </div>

                    <div className="lg:col-span-9">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <p className="text-slate-600 text-sm font-medium">
                                <span className="text-emerald-600 font-bold">{total}</span> jobs found
                            </p>
                            <div className="flex items-center gap-3 text-sm">
                                <label
                                    htmlFor="sortby"
                                    className="font-medium text-slate-600"
                                >
                                    Sort by:
                                </label>
                                <select
                                    className="form-control rounded-lg border-2 border-slate-200 px-4 py-2 bg-white hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition font-medium text-slate-700 cursor-pointer"
                                    name="sortby"
                                    id="sortby"
                                >
                                    <option>Newest</option>
                                    <option>Hottest</option>
                                    <option>Most Viewed</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600 mb-4"></div>
                                    <p className="text-slate-500 text-lg font-medium">Finding perfect jobs for you...</p>
                                </div>
                            ) : jobs && jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <JobCard
                                        key={job._id || job.id}
                                        job={job}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-slate-600 text-xl font-semibold mb-2">No jobs found</p>
                                    <p className="text-slate-400 text-sm">Try adjusting your filters or search criteria</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
