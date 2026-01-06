import React from "react";

export default function ProfileAbout({ profile }) {
    return (
        <div className="tab-content">
            <div className="profile-details">
                {profile.profileType === "company" ? (
                    <>
                        <div className="profile-section">
                            <h3>Company Information</h3>
                            {profile.email && (
                                <p>
                                    <strong>Email:</strong> {profile.email}
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
                                <p>{profile.companySize} employees</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="profile-section">
                            <h3>Contact Information</h3>
                            {profile.email && (
                                <p>
                                    <strong>Email:</strong> {profile.email}
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
                                    {profile.gender.charAt(0).toUpperCase() +
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

                        {profile.skills && profile.skills.length > 0 && (
                            <div className="profile-section">
                                <h3>Skills</h3>
                                <div className="skills-list">
                                    {profile.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {profile.pastJobs && profile.pastJobs.length > 0 && (
                            <div className="profile-section">
                                <h3>Work Experience</h3>
                                {profile.pastJobs.map((job, index) => (
                                    <div
                                        key={index}
                                        className="experience-item"
                                    >
                                        <h4>
                                            {job.title} at {job.company}
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
                                            <p>{job.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {profile.education && profile.education.length > 0 && (
                            <div className="profile-section">
                                <h3>Education</h3>
                                {profile.education.map((edu, index) => (
                                    <div
                                        key={index}
                                        className="experience-item"
                                    >
                                        <h4>
                                            {edu.degree}{" "}
                                            {edu.field && `in ${edu.field}`}
                                        </h4>
                                        <p className="institution">
                                            {edu.institution}
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
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
