import { Search, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router";
import api from "../utils/api.js";

const Hero = () => (
    <div className="relative bg-[#1aac83] px-8 pt-10 pb-24 flex justify-between items-center overflow-visible rounded-t-xl">
        <div className="max-w-2xl">
            <h1 className="text-5xl font-serif text-white mb-6">
                Find Your Dream Job
            </h1>
        </div>

        {/* Abstract representation of the illustration in the image */}
        <div className="hidden lg:flex items-end absolute right-20 bottom-0">
            {/* Simple CSS illustration placeholder */}
            <div className="relative z-10">
                <img
                    src="https://ouch-cdn2.icons8.com/rN-3w156_5y_E6j6y7Z-wE9kH8k0_Y_6j5-3_1.png"
                    alt="Woman Illustration"
                    className="h-64 object-contain opacity-90 drop-shadow-lg"
                    // Note: Since I can't generate the exact image, I'm using a placeholder logic or external asset
                    // Replace this src with your specific local asset if needed.
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
    <div className="max-w-6xl mx-auto -mt-8 px-4 relative z-20">
        <div className="bg-white rounded-lg shadow-lg p-3 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 flex items-center justify-center gap-3 px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 w-auto">
                <Search
                    className="text-gray-400 w-5 h-5"
                    style={{ marginTop: "10px", marginBottom: "20px" }}
                />
                <input
                    type="text"
                    placeholder="UX Designer"
                    className="w-auto outline-none text-gray-700 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
                <MapPin
                    className="text-gray-400 w-5 h-5"
                    style={{ marginTop: "10px", marginBottom: "20px" }}
                />
                <input
                    type="text"
                    placeholder="Location"
                    className="w-full outline-none text-gray-700 font-medium"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={() => onSearch()}
                style={{ marginTop: "10px", marginBottom: "20px" }}
                className="bg-[#286ed6] hover:bg-[#286ed6] text-white font-semibold px-10 py-3 rounded transition shadow-md w-full md:w-auto"
            >
                Search
            </button>
        </div>
    </div>
);
export const JobCard = ({ job }) => {
    const [posterProfile, setPosterProfile] = useState(null);
    useEffect(() => {
        if (!job?.postedBy) return;

        const fetchProfile = async () => {
            try {
                console.log("Fetching profile for username:", job.postedBy);
                const { data } = await api.get(
                    `/user/profile/id/${job.postedBy}`
                );
                setPosterProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [job.postedBy]);
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition mb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl overflow-hidden`}
                        style={{ backgroundColor: color }}
                    >
                        {posterProfile?.profile.profilePic ? (
                            <img
                                src={posterProfile.profile.profilePic}
                                alt="Logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            job.postedBy.slice(0, 2).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-medium">
                                {posterProfile?.profile.companyName}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <MapPin size={12} />{" "}
                                {job.location.city +
                                    ", " +
                                    job.location.country}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="font-bold text-gray-800">
                    {!job.salary.hideSalary
                        ? job.salary.salaryRange
                        : "Not disclosed"}
                </div>

                <div className="font-bold text-gray-800">{!job.salary.hideSalary ? job.salaryRange : "Not disclosed"}</div>

            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {job.description}
            </p>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {job.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">
                    {job.deadline}
                </span>
            </div>
        </div>
    );
};

const FilterSection = ({ title, children }) => (
    <div className="mb-8">
        <h4 className="font-bold text-gray-800 mb-4">{title}</h4>
        <div className="space-y-3">{children}</div>
    </div>
);
const Checkbox = ({ label, checked, onChange }) => (
    <label className="inline-flex items-start gap-3 cursor-pointer group">
        <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                checked
                    ? "bg-[#286ed6] border-[#a6bcdb]"
                    : "border-gray-300 bg-white"
            }`}
        >
            {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
        <span className="text-gray-600 text-sm group-hover:text-gray-800 transition">
            {label}
        </span>
        <input type="checkbox" hidden checked={checked} onChange={onChange} />
    </label>
);

const CreateJobCTA = () => (
    <div className="bg-gradient-to-br from-[#1aac83] to-[#15a078] rounded-xl p-8 text-white shadow-lg sticky top-4 z-30 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Looking to Hire?</h3>
                <p className="text-white/90">
                    Post your job opportunity and connect with top talent
                </p>
            </div>
            <Link to="/jobs/form">
                <button className="bg-white text-[#1aac83] hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors shadow-md whitespace-nowrap">
                    Post a Job
                </button>
            </Link>
        </div>
    </div>
);
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
    const [salaryRange, setSalaryRange] = useState({ min: 200, max: 4960 });
    const salaryDebounceRef = useRef(null);
    const [activeThumb, setActiveThumb] = useState(null); // 'min' | 'max' | null

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
            <div className="min-h-screen bg-[#fafbfc] font-sans">
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

                <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-">
                    <div className="md:col-span-3">
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
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span>${salaryRange.min.toLocaleString()}</span>
                                <span>${salaryRange.max.toLocaleString()}</span>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    {/* Lower handle */}
                                    <input
                                        type="range"
                                        min={SALARY_MIN}
                                        max={SALARY_MAX}
                                        value={salaryRange.min}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            // Prevent min exceeding max
                                            const nextMin = Math.min(
                                                val,
                                                salaryRange.max - 1
                                            );
                                            setSalaryRange({
                                                ...salaryRange,
                                                min: nextMin,
                                            });
                                        }}
                                        onPointerDown={() =>
                                            setActiveThumb("min")
                                        }
                                        onPointerUp={() => setActiveThumb(null)}
                                        style={{
                                            zIndex:
                                                activeThumb === "min" ? 2 : 1,
                                        }}
                                        className="salary-range lower w-full appearance-none h-1 bg-transparent"
                                    />

                                    {/* Upper handle */}
                                    <input
                                        type="range"
                                        min={SALARY_MIN}
                                        max={SALARY_MAX}
                                        value={salaryRange.max}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            const nextMax = Math.max(
                                                val,
                                                salaryRange.min + 1
                                            );
                                            setSalaryRange({
                                                ...salaryRange,
                                                max: nextMax,
                                            });
                                        }}
                                        className="salary-range upper w-full appearance-none h-1 bg-transparent absolute top-0 left-0"
                                    />

                                    {/* Visual track */}
                                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full">
                                        <div
                                            className="h-full bg-[#e63946] rounded-full"
                                            style={{
                                                marginLeft: `${
                                                    (salaryRange.min /
                                                        SALARY_MAX) *
                                                    100
                                                }%`,
                                                marginRight: `${
                                                    100 -
                                                    (salaryRange.max /
                                                        SALARY_MAX) *
                                                        100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-1/2 flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-full border rounded px-2 py-1 no-spin"
                                            value={salaryRange.min}
                                            onChange={(e) => {
                                                const val =
                                                    Number(e.target.value) || 0;
                                                setSalaryRange({
                                                    ...salaryRange,
                                                    min: Math.min(
                                                        val,
                                                        salaryRange.max - 1
                                                    ),
                                                });
                                            }}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                aria-label="increase min"
                                                onClick={() =>
                                                    setSalaryRange((s) => ({
                                                        ...s,
                                                        min: Math.min(
                                                            s.max - 1,
                                                            s.min + 100
                                                        ),
                                                    }))
                                                }
                                                className="p-1 border rounded bg-white"
                                            >
                                                <ChevronUp size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="decrease min"
                                                onClick={() =>
                                                    setSalaryRange((s) => ({
                                                        ...s,
                                                        min: Math.max(
                                                            SALARY_MIN,
                                                            s.min - 100
                                                        ),
                                                    }))
                                                }
                                                className="p-1 border rounded bg-white"
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-1/2 flex items-center gap-2 justify-end">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                aria-label="increase max"
                                                onClick={() =>
                                                    setSalaryRange((s) => ({
                                                        ...s,
                                                        max: Math.min(
                                                            SALARY_MAX,
                                                            s.max + 100
                                                        ),
                                                    }))
                                                }
                                                className="p-1 border rounded bg-white"
                                            >
                                                <ChevronUp size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="decrease max"
                                                onClick={() =>
                                                    setSalaryRange((s) => ({
                                                        ...s,
                                                        max: Math.max(
                                                            salaryRange.min + 1,
                                                            s.max - 100
                                                        ),
                                                    }))
                                                }
                                                className="p-1 border rounded bg-white"
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>
                                        <input
                                            type="number"
                                            className="w-32 border rounded px-2 py-1 no-spin"
                                            value={salaryRange.max}
                                            onChange={(e) => {
                                                const val =
                                                    Number(e.target.value) || 0;
                                                setSalaryRange({
                                                    ...salaryRange,
                                                    max: Math.max(
                                                        val,
                                                        salaryRange.min + 1
                                                    ),
                                                });
                                            }}
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

                    <div
                        className="md:col-span-9 overflow-auto px-3"
                        style={{ height: "100vh" }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-400 text-sm">
                                Showing {total} results
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <div className="form-group">
                                    <label htmlFor="sortby">Sort by</label>
                                    <select
                                        className="form-control"
                                        name="sortby"
                                        id="sortby"
                                    >
                                        <option>Newest</option>
                                        <option>Hotest</option>
                                        <option>Most Viewed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : jobs && jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <JobCard
                                        key={job._id || job.id}
                                        job={job}
                                    />
                                ))
                            ) : (
                                <p>No jobs found</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
