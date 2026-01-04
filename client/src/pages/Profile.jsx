import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";
import Posts from "../components/Posts";
import { uploadMedia } from "../utils/uploadMedia";
import { ImageUpload } from "../components/ImageUpload";

function Profile() {
    const { username: paramUsername } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");
    const [profileImage, setProfileImage] = useState(null);
    const [videoCvFile, setVideoCvFile] = useState(null);
    const [videoCvPreview, setVideoCvPreview] = useState(null);
    const [removeVideo, setRemoveVideo] = useState(false);

    useEffect(() => {
        if (!videoCvFile) return;
        const url =
            typeof videoCvFile === "string"
                ? videoCvFile
                : URL.createObjectURL(videoCvFile);
        setVideoCvPreview(url);
        return () => {
            if (typeof videoCvFile !== "string") URL.revokeObjectURL(url);
        };
    }, [videoCvFile]);

    useEffect(() => {
        if (profile?.videoCv) setVideoCvPreview(profile.videoCv);
    }, [profile]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        description: "",
        birthday: "",
        location: "",
        phoneNumber: "",
        email: "",
        gender: "",
        skills: [],
        pastJobs: [],
        education: [],
        // Company fields
        foundedDate: "",
        founderName: "",
        companyDescription: "",
        industry: "",
        companySize: "",
        website: "",
    });

    const toISODate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

    const username =
        paramUsername ??
        currentUser?.username ??
        currentUser?.email?.split("@")[0];
    const isOwner = Boolean(
        currentUser &&
            (currentUser.username === username ||
                currentUser.email?.split("@")[0] === username)
    );

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const profileRes = await api.get(`/user/profile/${username}`);
                const p = profileRes.data.profile || {};
                setUser(profileRes.data.user);
                setProfile(p);

                const postsRes = await api.get(
                    `/user/profile/${username}/posts`
                );
                setPosts(postsRes.data);

                if (isOwner) {
                    setFormData({
                        firstName: p.firstName || "",
                        lastName: p.lastName || "",
                        companyName: p.companyName || "",
                        description: p.description || "",
                        birthday: toISODate(p.birthday),
                        location: p.location || "",
                        phoneNumber: p.phoneNumber || "",
                        email: p.email || "",
                        gender: p.gender || "",
                        skills: p.skills || [],
                        pastJobs: p.pastJobs || [],
                        education: p.education || [],
                        foundedDate: toISODate(p.foundedDate),
                        founderName: p.founderName || "",
                        companyDescription: p.companyDescription || "",
                        industry: p.industry || "",
                        companySize: p.companySize || "",
                        website: p.website || "",
                    });

                    if (location.state?.openEdit) {
                        setIsEditing(true);
                        setActiveTab("about");
                        if (!p.isProfileComplete)
                            setNeedsProfileCompletion(true);
                    }
                }
            } catch (err) {
                console.error(
                    "Error fetching profile:",
                    err?.response?.data || err
                );
                setError("Profile not found");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        } else {
            setLoading(false);
            setError("No username provided");
        }
    }, [username, isOwner, location.state?.openEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const updatedFormData = { ...formData };

            if (profileImage) {
                const uploadResult = await uploadMedia(profileImage, "image");
                updatedFormData.profilePic = uploadResult?.secure_url;
            }

            if (removeVideo) {
                updatedFormData.videoCv = null;
            } else if (videoCvFile) {
                const uploadResult = await uploadMedia(videoCvFile, "post");
                updatedFormData.videoCv = uploadResult?.secure_url;
            }

            const res = await api.put("/user/profile", updatedFormData, {
                headers: { authorization: `Bearer ${currentUser.token}` },
            });

            setProfile(res.data);

            if (updatedFormData.profilePic) {
                setUser((u) => ({
                    ...u,
                    profilePic: updatedFormData.profilePic,
                }));
            }

            setNeedsProfileCompletion(false);
            setIsEditing(false);
            setProfileImage(null);

            if (location.state?.openEdit) navigate("/", { replace: true });
        } catch (err) {
            console.error(
                "Error updating profile:",
                err?.response?.data || err
            );
            setError(
                err.response?.data?.error ||
                    "Failed to update profile. Please try again."
            );
        }
    };

    const handleAddSkill = () => {
        setFormData({ ...formData, skills: [...formData.skills, ""] });
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData({ ...formData, skills: newSkills });
    };

    const handleRemoveSkill = (index) => {
        const newSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: newSkills });
    };

    const handleAddJob = () => {
        setFormData({
            ...formData,
            pastJobs: [
                ...formData.pastJobs,
                {
                    title: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                },
            ],
        });
    };

    const handleJobChange = (index, field, value) => {
        const newJobs = [...formData.pastJobs];
        newJobs[index][field] = value;
        setFormData({ ...formData, pastJobs: newJobs });
    };

    const handleRemoveJob = (index) => {
        const newJobs = formData.pastJobs.filter((_, i) => i !== index);
        setFormData({ ...formData, pastJobs: newJobs });
    };

    const handleAddEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                {
                    institution: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                },
            ],
        });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...formData.education];
        newEducation[index][field] = value;
        setFormData({ ...formData, education: newEducation });
    };

    const handleRemoveEducation = (index) => {
        const newEducation = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: newEducation });
    };

    const handleGenerateCV = () => {
        window.print();
    };

    // Hide navbar when profile completion is required
    useEffect(() => {
        if (needsProfileCompletion) {
            document
                .querySelector("header")
                ?.style.setProperty("display", "none");
        } else {
            document.querySelector("header")?.style.setProperty("display", "");
        }

        return () => {
            document.querySelector("header")?.style.setProperty("display", "");
        };
    }, [needsProfileCompletion]);

    // Block navigation if profile setup is not complete
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (needsProfileCompletion) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [needsProfileCompletion]);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!profile || !user) {
        return <div>Profile not found</div>;
    }

    return (
        <div className="profile">
            <div className="profile-container">
                <div className="profile-header">
                    <img
                        src={
                            user.profilePic || "https://via.placeholder.com/150"
                        }
                        alt={user.username}
                        className="profile-image"
                    />
                    <div className="profile-info">
                        <h2>
                            {profile.companyName ||
                                `${profile.firstName || ""} ${
                                    profile.lastName || ""
                                }`.trim() ||
                                user.username}
                        </h2>
                        <p className="username-tag">{user.username}</p>
                        {isOwner && !isEditing && (
                            <div className="profile-actions">
                                <button
                                    onClick={() =>
                                        navigate("/profile/editprofile")
                                    }
                                    className="edit-btn"
                                >
                                    Edit Profile
                                </button>
                                {profile.profileType !== "company" && (
                                    <button
                                        onClick={handleGenerateCV}
                                        className="edit-btn"
                                    >
                                        Generate CV
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {!isEditing && (
                    <div className="profile-tabs">
                        <button
                            className={`tab-btn ${
                                activeTab === "posts" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("posts")}
                        >
                            Posts
                        </button>
                        <button
                            className={`tab-btn ${
                                activeTab === "about" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("about")}
                        >
                            About Me
                        </button>
                    </div>
                )}

                {isEditing && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        {error && <div className="error">{error}</div>}

                        <ImageUpload
                            label={"Profile Image"}
                            buttonLabel={"Choose Picture"}
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            isLoading={false}
                            preview={profileImage}
                        />

                        {/* Preview */}
                        {(profileImage || user.profilePic) && (
                            <div
                                className="image-preview"
                                style={{ marginTop: 10 }}
                            >
                                <img
                                    src={
                                        profileImage
                                            ? URL.createObjectURL(profileImage)
                                            : user.profilePic
                                    }
                                    alt="Preview"
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                    }}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Video CV:</label>
                            <div
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    alignItems: "center",
                                    marginTop: 8,
                                }}
                            >
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => {
                                        setVideoCvFile(e.target.files[0]);
                                        setRemoveVideo(false);
                                    }}
                                    style={{ display: "none" }}
                                    id="video-cv-input-profile"
                                />
                                <label
                                    htmlFor="video-cv-input-profile"
                                    className="text-green-500 hover:text-green-700 cursor-pointer"
                                >
                                    Choose Video CV
                                </label>
                                {(videoCvPreview || profile?.videoCv) && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                        }}
                                    >
                                        <video
                                            src={
                                                videoCvPreview ||
                                                profile.videoCv
                                            }
                                            width={200}
                                            controls
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVideoCvFile(null);
                                                setVideoCvPreview(null);
                                                setRemoveVideo(true);
                                            }}
                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "#6b7280",
                                    marginTop: 8,
                                }}
                            >
                                MP4, MOV (max 50MB)
                            </p>
                        </div>

                        {profile?.profileType === "company" ? (
                            <div className="form-group">
                                <label>Company Name:</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyName: e.target.value,
                                        })
                                    }
                                    placeholder="Your company name"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                firstName: e.target.value,
                                            })
                                        }
                                        placeholder="Your first name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                lastName: e.target.value,
                                            })
                                        }
                                        placeholder="Your last name"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="your.email@example.com"
                                disabled={true}
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    cursor: "not-allowed",
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phoneNumber: e.target.value,
                                    })
                                }
                                placeholder="+1234567890"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location:</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                    })
                                }
                                placeholder="City, Country"
                            />
                        </div>

                        {profile?.profileType !== "company" && (
                            <div className="form-group">
                                <label>Gender:</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            gender: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        )}

                        {profile?.profileType !== "company" && (
                            <div className="form-group">
                                <label>Birthday:</label>
                                <input
                                    type="date"
                                    value={formData.birthday}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            birthday: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        )}

                        {profile?.profileType === "company" ? (
                            <>
                                <div className="form-group">
                                    <label>Company Description:</label>
                                    <textarea
                                        value={formData.companyDescription}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                companyDescription:
                                                    e.target.value,
                                            })
                                        }
                                        rows="4"
                                        placeholder="Tell us about your company..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Founded Date:</label>
                                    <input
                                        type="date"
                                        value={formData.foundedDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                foundedDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Founder Name:</label>
                                    <input
                                        type="text"
                                        value={formData.founderName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                founderName: e.target.value,
                                            })
                                        }
                                        placeholder="Name of founder(s)"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Industry:</label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                industry: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Technology, Healthcare, Finance"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Company Size:</label>
                                    <input
                                        type="text"
                                        value={formData.companySize}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                companySize: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., 1-10, 11-50, 51-200, 200+"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Website:</label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                website: e.target.value,
                                            })
                                        }
                                        placeholder="https://www.example.com"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        )}

                        {profile?.profileType !== "company" && (
                            <div className="form-section">
                                <h3>Skills</h3>
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="array-item">
                                        <input
                                            type="text"
                                            value={skill}
                                            onChange={(e) =>
                                                handleSkillChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter skill"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveSkill(index)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="add-btn"
                                >
                                    + Add Skill
                                </button>
                            </div>
                        )}

                        {profile?.profileType !== "company" && (
                            <div className="form-section">
                                <h3>Work Experience</h3>
                                {formData.pastJobs.map((job, index) => (
                                    <div key={index} className="array-item-box">
                                        <input
                                            type="text"
                                            value={job.title}
                                            onChange={(e) =>
                                                handleJobChange(
                                                    index,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Job Title"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={job.company}
                                            onChange={(e) =>
                                                handleJobChange(
                                                    index,
                                                    "company",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Company"
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={
                                                job.startDate
                                                    ? new Date(job.startDate)
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                handleJobChange(
                                                    index,
                                                    "startDate",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Start Date"
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={
                                                job.endDate
                                                    ? new Date(job.endDate)
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                handleJobChange(
                                                    index,
                                                    "endDate",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="End Date"
                                            disabled={job.current}
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={job.current}
                                                onChange={(e) =>
                                                    handleJobChange(
                                                        index,
                                                        "current",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            Currently working here
                                        </label>
                                        <textarea
                                            value={job.description}
                                            onChange={(e) =>
                                                handleJobChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Job Description"
                                            rows="2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveJob(index)
                                            }
                                        >
                                            Remove Job
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddJob}
                                    className="add-btn"
                                >
                                    + Add Work Experience
                                </button>
                            </div>
                        )}

                        {profile?.profileType !== "company" && (
                            <div className="form-section">
                                <h3>Education</h3>
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="array-item-box">
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "institution",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Institution"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "degree",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Degree"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={edu.field}
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "field",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Field of Study"
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={
                                                edu.startDate
                                                    ? new Date(edu.startDate)
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "startDate",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Start Date"
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={
                                                edu.endDate
                                                    ? new Date(edu.endDate)
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "endDate",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="End Date"
                                            disabled={edu.current}
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={edu.current}
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "current",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            Currently studying here
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveEducation(index)
                                            }
                                        >
                                            Remove Education
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddEducation}
                                    className="add-btn"
                                >
                                    + Add Education
                                </button>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit">Save Changes</button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {!isEditing && activeTab === "about" && (
                    <div className="tab-content">
                        <div className="profile-details">
                            {profile.profileType === "company" ? (
                                <>
                                    <div className="profile-section">
                                        <h3>Company Information</h3>
                                        {profile.email && (
                                            <p>
                                                <strong>Email:</strong>{" "}
                                                {profile.email}
                                            </p>
                                        )}
                                        {profile.phoneNumber && (
                                            <p>
                                                <strong>Phone:</strong>{" "}
                                                {profile.phoneNumber}
                                            </p>
                                        )}
                                        {profile.location && (
                                            <p>
                                                <strong>Location:</strong>{" "}
                                                {profile.location}
                                            </p>
                                        )}
                                        {profile.website && (
                                            <p>
                                                <strong>Website:</strong>{" "}
                                                <a
                                                    href={profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {profile.website}
                                                </a>
                                            </p>
                                        )}

                                        {profile.videoCv && (
                                            <div style={{ marginTop: 12 }}>
                                                <h4>Company Video</h4>
                                                <video
                                                    src={profile.videoCv}
                                                    controls
                                                    width={420}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {profile.companyDescription && (
                                        <div className="profile-section">
                                            <h3>About Company</h3>
                                            <p>{profile.companyDescription}</p>
                                        </div>
                                    )}

                                    {profile.foundedDate && (
                                        <div className="profile-section">
                                            <h3>Founded</h3>
                                            <p>
                                                {new Date(
                                                    profile.foundedDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}

                                    {profile.founderName && (
                                        <div className="profile-section">
                                            <h3>Founder</h3>
                                            <p>{profile.founderName}</p>
                                        </div>
                                    )}

                                    {profile.industry && (
                                        <div className="profile-section">
                                            <h3>Industry</h3>
                                            <p>{profile.industry}</p>
                                        </div>
                                    )}

                                    {profile.companySize && (
                                        <div className="profile-section">
                                            <h3>Company Size</h3>
                                            <p>
                                                {profile.companySize} employees
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="profile-section">
                                        <h3>Contact Information</h3>
                                        {profile.email && (
                                            <p>
                                                <strong>Email:</strong>{" "}
                                                {profile.email}
                                            </p>
                                        )}
                                        {profile.phoneNumber && (
                                            <p>
                                                <strong>Phone:</strong>{" "}
                                                {profile.phoneNumber}
                                            </p>
                                        )}
                                        {profile.location && (
                                            <p>
                                                <strong>Location:</strong>{" "}
                                                {profile.location}
                                            </p>
                                        )}
                                        {profile.birthday && (
                                            <p>
                                                <strong>Birthday:</strong>{" "}
                                                {new Date(
                                                    profile.birthday
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                        {profile.gender && (
                                            <p>
                                                <strong>Gender:</strong>{" "}
                                                {profile.gender
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    profile.gender.slice(1)}
                                            </p>
                                        )}

                                        {profile.videoCv && (
                                            <div style={{ marginTop: 12 }}>
                                                <h4>Video CV</h4>
                                                <video
                                                    src={profile.videoCv}
                                                    controls
                                                    width={420}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {profile.displayName && (
                                        <div className="profile-section">
                                            <h3>Display Name</h3>
                                            <p>{profile.displayName}</p>
                                        </div>
                                    )}

                                    {profile.description && (
                                        <div className="profile-section">
                                            <h3>Description</h3>
                                            <p>{profile.description}</p>
                                        </div>
                                    )}

                                    {profile.skills &&
                                        profile.skills.length > 0 && (
                                            <div className="profile-section">
                                                <h3>Skills</h3>
                                                <div className="skills-list">
                                                    {profile.skills.map(
                                                        (skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="skill-tag"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {profile.pastJobs &&
                                        profile.pastJobs.length > 0 && (
                                            <div className="profile-section">
                                                <h3>Work Experience</h3>
                                                {profile.pastJobs.map(
                                                    (job, index) => (
                                                        <div
                                                            key={index}
                                                            className="experience-item"
                                                        >
                                                            <h4>
                                                                {job.title} at{" "}
                                                                {job.company}
                                                            </h4>
                                                            <p className="date-range">
                                                                {job.startDate &&
                                                                    new Date(
                                                                        job.startDate
                                                                    ).toLocaleDateString()}{" "}
                                                                -{" "}
                                                                {job.current
                                                                    ? "Present"
                                                                    : job.endDate &&
                                                                      new Date(
                                                                          job.endDate
                                                                      ).toLocaleDateString()}
                                                            </p>
                                                            {job.description && (
                                                                <p>
                                                                    {
                                                                        job.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {profile.education &&
                                        profile.education.length > 0 && (
                                            <div className="profile-section">
                                                <h3>Education</h3>
                                                {profile.education.map(
                                                    (edu, index) => (
                                                        <div
                                                            key={index}
                                                            className="experience-item"
                                                        >
                                                            <h4>
                                                                {edu.degree}{" "}
                                                                {edu.field &&
                                                                    `in ${edu.field}`}
                                                            </h4>
                                                            <p className="institution">
                                                                {
                                                                    edu.institution
                                                                }
                                                            </p>
                                                            <p className="date-range">
                                                                {edu.startDate &&
                                                                    new Date(
                                                                        edu.startDate
                                                                    ).toLocaleDateString()}{" "}
                                                                -{" "}
                                                                {edu.current
                                                                    ? "Present"
                                                                    : edu.endDate &&
                                                                      new Date(
                                                                          edu.endDate
                                                                      ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {!isEditing && activeTab === "posts" && (
                    <div className="tab-content">
                        <div className="profile-section posts-section">
                            <h3>Posts</h3>
                            {posts.length > 0 ? (
                                <Posts posts={posts} setPosts={setPosts} />
                            ) : (
                                <p>No posts yet</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
