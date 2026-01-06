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
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm text-red-600">{error}</div>}

            <ImageUpload
                label={"Profile Image"}
                buttonLabel={"Choose Picture"}
                onChange={(e) => setProfileImage(e.target.files[0])}
                isLoading={false}
                preview={profileImage}
            />

            {(profileImage || profile?.profilePic) && (
                <div className="mt-3">
                    <img
                        src={
                            profileImage
                                ? URL.createObjectURL(profileImage)
                                : profile.profilePic
                        }
                        alt="Preview"
                        className="w-36 h-36 object-cover rounded-full"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Video CV
                </label>
                <div className="flex items-center gap-3 mt-2">
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
                        className="text-primary-600 hover:text-primary-700 cursor-pointer"
                    >
                        Choose Video CV
                    </label>

                    {(videoCvPreview || profile?.videoCv) && (
                        <div className="flex items-center gap-3">
                            <video
                                src={videoCvPreview || profile.videoCv}
                                width={200}
                                controls
                                className="rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setVideoCvFile(null);
                                    setVideoCvPreview(null);
                                    setRemoveVideo(true);
                                }}
                                className="px-3 py-1 bg-red-50 text-red-600 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    MP4, MOV (max 50MB)
                </p>
            </div>

            {profile?.profileType === "company" ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Company Name
                    </label>
                    <input
                        className="input mt-2"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            className="input mt-2"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            className="input mt-2"
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
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    className="input mt-2 bg-gray-100 cursor-not-allowed"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                    disabled={true}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        className="input mt-2"
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        className="input mt-2"
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
            </div>

            {profile?.profileType !== "company" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            className="input mt-2"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Birthday
                        </label>
                        <input
                            className="input mt-2"
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
                </div>
            )}

            {profile?.profileType === "company" ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Company Description
                        </label>
                        <textarea
                            className="input mt-2"
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Founded Date
                            </label>
                            <input
                                className="input mt-2"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Founder Name
                            </label>
                            <input
                                className="input mt-2"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Industry
                            </label>
                            <input
                                className="input mt-2"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Company Size
                            </label>
                            <input
                                className="input mt-2"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Website
                            </label>
                            <input
                                className="input mt-2"
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
                    </div>
                </>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        className="input mt-2"
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
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">
                        Skills
                    </h3>
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <input
                                className="input flex-1"
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
                                className="px-3 py-1 bg-red-50 text-red-600 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddSkill}
                        className="btn btn-primary"
                    >
                        + Add Skill
                    </button>
                </div>
            )}

            {profile?.profileType !== "company" && (
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">
                        Work Experience
                    </h3>
                    {formData.pastJobs.map((job, index) => (
                        <div key={index} className="card">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    className="input"
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
                                    className="input"
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
                                    className="input"
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
                                    className="input"
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
                            </div>
                            <label className="flex items-center gap-2 mt-3">
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
                                />{" "}
                                Currently working here
                            </label>
                            <textarea
                                className="input mt-3"
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
                            <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveJob(index)}
                                    className="px-3 py-1 bg-red-50 text-red-600 rounded"
                                >
                                    Remove Job
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddJob}
                        className="btn btn-primary"
                    >
                        + Add Work Experience
                    </button>
                </div>
            )}

            {profile?.profileType !== "company" && (
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">
                        Education
                    </h3>
                    {formData.education.map((edu, index) => (
                        <div key={index} className="card">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    className="input"
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
                                    className="input"
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
                                    className="input"
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
                                    className="input"
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
                                    className="input"
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
                            </div>
                            <label className="flex items-center gap-2 mt-3">
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
                                />{" "}
                                Currently studying here
                            </label>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEducation(index)}
                                    className="px-3 py-1 bg-red-50 text-red-600 rounded"
                                >
                                    Remove Education
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddEducation}
                        className="btn btn-primary"
                    >
                        + Add Education
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3">
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
