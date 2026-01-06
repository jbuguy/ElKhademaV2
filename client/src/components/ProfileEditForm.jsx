import { ImageUpload } from "./ImageUpload";

export default function ProfileEditForm({
    error,
    profileImage,
    setProfileImage,
    videoCvFile,
    setVideoCvFile,
    videoCvPreview,
    setVideoCvPreview,
    removeVideo,
    setRemoveVideo,
    profile,
    formData,
    setFormData,
    handleSubmit,
    handleAddSkill,
    handleSkillChange,
    handleRemoveSkill,
    handleAddJob,
    handleJobChange,
    handleRemoveJob,
    handleAddEducation,
    handleEducationChange,
    handleRemoveEducation,
    setIsEditing,
}) {
    return (
        <form onSubmit={handleSubmit} className="edit-form">
            {error && <div className="error">{error}</div>}

            <ImageUpload
                label={"Profile Image"}
                buttonLabel={"Choose Picture"}
                onChange={(e) => setProfileImage(e.target.files[0])}
                isLoading={false}
                preview={profileImage}
            />

            {(profileImage || profile?.profilePic) && (
                <div className="image-preview" style={{ marginTop: 10 }}>
                    <img
                        src={
                            profileImage
                                ? URL.createObjectURL(profileImage)
                                : profile.profilePic
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
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
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
                        setFormData({ ...formData, email: e.target.value })
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
                        setFormData({ ...formData, location: e.target.value })
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
                            setFormData({ ...formData, gender: e.target.value })
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
                                    handleSkillChange(index, e.target.value)
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
                                onClick={() => handleRemoveEducation(index)}
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
                <button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                </button>
            </div>
        </form>
    );
}
