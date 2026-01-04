import { Search, MapPin } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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

const SearchBar = () => (
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
                    defaultValue="UX Designer"
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
                    defaultValue="San Francisco, USA"
                />
            </div>
            <button
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
                const { data } = await api.get(`/user/profile/id/${job.postedBy}`);
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
                            <img src={posterProfile.profile.profilePic} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            job.postedBy.slice(0, 2).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-medium">{posterProfile?.profile.companyName}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <MapPin size={12} />{" "}

                                    {job.location.city + ", " + job.location.country}
                            </span>
                        </div>
                    </div>
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

    const [jobs, setJobs] = useState(null);
    useEffect(() => {
        api.get("/jobs", {
            headers: {
                authorization: `Bearer ${user.token}`,
            },
        }).then((res) => setJobs(res.data));
    }, []);

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

    return (
        <>
            {user.role === "company" && <CreateJobCTA />}
            <div className="min-h-screen bg-[#fafbfc] font-sans">
                <Hero />
                <SearchBar />

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
                                <span>$200</span>
                                <span>$4,960</span>
                            </div>

                            <div className="relative h-1 bg-gray-200 rounded-full mt-2">
                                <div className="absolute left-0 right-1/4 h-full bg-[#e63946] rounded-full"></div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#e63946] rounded-full border-2 border-white shadow cursor-pointer"></div>
                                <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#e63946] rounded-full border-2 border-white shadow cursor-pointer"></div>
                            </div>
                        </FilterSection>

                        <FilterSection title="Experience Level">
                            <Checkbox
                                label="Entry/Junior"
                                checked={filters.junior}
                                onChange={() => {}}
                            />
                            <Checkbox
                                label="Middle"
                                checked={filters.middle}
                                onChange={() => {}}
                            />
                            <Checkbox
                                label="Senior"
                                checked={filters.senior}
                                onChange={() => {}}
                            />
                        </FilterSection>
                    </div>

                    <div
                        className="md:col-span-9 overflow-auto px-3"
                        style={{ height: "100vh" }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-400 text-sm">
                                Showing 68 results
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
                            {jobs ? jobs.map((job) => (
                                <Link to={`/jobs/${job._id}`}
                                className="block transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl shadow-md rounded-xl">
                                    <JobCard key={job._id} job={job} />
                                </Link>
                            )) : <p>No jobs found</p>}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
