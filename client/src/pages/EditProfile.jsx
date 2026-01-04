import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";
import { uploadMedia } from "../utils/uploadMedia";
import { ImageUpload } from "../components/ImageUpload";

function EditProfile() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [videoCvFile, setVideoCvFile] = useState(null);
    const [videoCvPreview, setVideoCvPreview] = useState(null);
    const [removeVideo, setRemoveVideo] = useState(false);

    useEffect(() => {
        if (!profileImage) {
            setProfileImagePreview(null);
            // fallthrough
        } else {
            const url =
                typeof profileImage === "string"
                    ? profileImage
                    : URL.createObjectURL(profileImage);
            setProfileImagePreview(url);
            return () => {
                if (typeof profileImage !== "string") URL.revokeObjectURL(url);
            };
        }
    }, [profileImage]);

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
        if (profile?.profilePic && !profileImage)
            setProfileImagePreview(profile.profilePic);
    }, [profile, profileImage]);
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
        foundedDate: "",
        founderName: "",
        companyDescription: "",
        industry: "",
        companySize: "",
        website: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const username =
                    currentUser?.username || currentUser?.email?.split("@")[0];
                const profileRes = await api.get(`/user/profile/${username}`);
                setUser(profileRes.data.user);
                setProfile(profileRes.data.profile);

                setFormData({
                    firstName: profileRes.data.profile.firstName || "",
                    lastName: profileRes.data.profile.lastName || "",
                    companyName: profileRes.data.profile.companyName || "",
                    description: profileRes.data.profile.description || "",
                    birthday: profileRes.data.profile.birthday
                        ? new Date(profileRes.data.profile.birthday)
                              .toISOString()
                              .split("T")[0]
                        : "",
                    location: profileRes.data.profile.location || "",
                    phoneNumber: profileRes.data.profile.phoneNumber || "",
                    email: profileRes.data.profile.email || "",
                    gender: profileRes.data.profile.gender || "",
                    skills: profileRes.data.profile.skills || [],
                    pastJobs: profileRes.data.profile.pastJobs || [],
                    education: profileRes.data.profile.education || [],
                    foundedDate: profileRes.data.profile.foundedDate
                        ? new Date(profileRes.data.profile.foundedDate)
                              .toISOString()
                              .split("T")[0]
                        : "",
                    founderName: profileRes.data.profile.founderName || "",
                    companyDescription:
                        profileRes.data.profile.companyDescription || "",
                    industry: profileRes.data.profile.industry || "",
                    companySize: profileRes.data.profile.companySize || "",
                    website: profileRes.data.profile.website || "",
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchProfile();
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            let updatedFormData = { ...formData };

            if (profileImage) {
                const uploadResult = await uploadMedia(profileImage, "image");
                updatedFormData.profilePic = uploadResult.secure_url;
            }

            // Handle video CV
            if (removeVideo) {
                updatedFormData.videoCv = null;
            } else if (videoCvFile) {
                const uploadResult = await uploadMedia(videoCvFile, "post");
                updatedFormData.videoCv = uploadResult.secure_url;
            }

            await api.put("/user/profile", updatedFormData, {
                headers: { authorization: `Bearer ${currentUser.token}` },
            });

            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(
                error.response?.data?.error ||
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile || !user) {
        return <div>Profile not found</div>;
    }

    return (
        <div className="profile">
            <div className="profile-container">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit} className="edit-form">
                    {error && <div className="error">{error}</div>}

                    <div className="form-group">
                        <ImageUpload
                            label="Profile Image"
                            buttonLabel="Choose Picture"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            isLoading={false}
                            preview={profileImagePreview || user.profilePic}
                        />
                    </div>

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
                                id="video-cv-input"
                            />
                            <label
                                htmlFor="video-cv-input"
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
                                        src={videoCvPreview || profile.videoCv}
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
                                required
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
                                    required
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
                                    required
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
                            required
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
                            required
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
                            required
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
                                            companyDescription: e.target.value,
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
                                        onClick={() => handleRemoveSkill(index)}
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
                                        onClick={() => handleRemoveJob(index)}
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
                            onClick={() => navigate("/profile")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
