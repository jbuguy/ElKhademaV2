import React from "react";

export default function ProfileAbout({ profile }) {
    const cardClass =
        "rounded-2xl shadow-sm border border-slate-200/50 bg-white p-6 hover:shadow-md transition-all";
    const headingClass =
        "text-lg font-semibold text-emerald-600 mb-4";

    return (
        <div className="space-y-6">
            <div className="profile-details">
                {profile.profileType === "company" ? (
                    <>
                        <div className={cardClass}>
                            <h3 className={headingClass}>
                                Company Information
                            </h3>
                            <div className="space-y-3 text-slate-700">
                                {profile.email && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Email:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {profile.email}
                                        </span>
                                    </p>
                                )}
                                {profile.phoneNumber && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Phone:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {profile.phoneNumber}
                                        </span>
                                    </p>
                                )}
                                {profile.location && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Location:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {profile.location}
                                        </span>
                                    </p>
                                )}
                                {profile.website && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Website:
                                        </strong>{" "}
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-600 hover:text-emerald-700 underline"
                                        >
                                            {profile.website}
                                        </a>
                                    </p>
                                )}

                                {profile.videoCv && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-slate-900 mb-3">
                                            Company Video
                                        </h4>
                                        <video
                                            src={profile.videoCv}
                                            controls
                                            className="w-full rounded-lg border border-slate-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {profile.companyDescription && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>About Company</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    {profile.companyDescription}
                                </p>
                            </div>
                        )}

                        {profile.foundedDate && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Founded</h3>
                                <p className="text-slate-700">
                                    {new Date(
                                        profile.foundedDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        )}

                        {profile.founderName && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Founder</h3>
                                <p className="text-slate-700">
                                    {profile.founderName}
                                </p>
                            </div>
                        )}

                        {profile.industry && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Industry</h3>
                                <p className="text-slate-700">
                                    {profile.industry}
                                </p>
                            </div>
                        )}

                        {profile.companySize && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Company Size</h3>
                                <p className="text-slate-700">
                                    {profile.companySize} employees
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className={cardClass}>
                            <h3 className={headingClass}>
                                Contact Information
                            </h3>
                            <div className="space-y-3 text-slate-700">
                                {profile.email && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Email:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {profile.email}
                                        </span>
                                    </p>
                                )}
                                {profile.phoneNumber && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Phone:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {profile.phoneNumber}
                                        </span>
                                    </p>
                                )}
                                {profile.location && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Location:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {profile.location}
                                        </span>
                                    </p>
                                )}
                                {profile.birthday && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Birthday:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {new Date(
                                                profile.birthday
                                            ).toLocaleDateString()}
                                        </span>
                                    </p>
                                )}
                                {profile.gender && (
                                    <p>
                                        <strong className="text-slate-900">
                                            Gender:
                                        </strong>{" "}
                                        <span className="text-slate-600">
                                            {profile.gender
                                                .charAt(0)
                                                .toUpperCase() +
                                                profile.gender.slice(1)}
                                        </span>
                                    </p>
                                )}

                                {profile.videoCv && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-slate-900 mb-3">
                                            Video CV
                                        </h4>
                                        <video
                                            src={profile.videoCv}
                                            controls
                                            className="w-full rounded-lg border border-slate-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {profile.displayName && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Display Name</h3>
                                <p className="text-slate-700">
                                    {profile.displayName}
                                </p>
                            </div>
                        )}

                        {profile.description && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Description</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    {profile.description}
                                </p>
                            </div>
                        )}

                        {profile.skills && profile.skills.length > 0 && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <span key={index} className="tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {profile.pastJobs && profile.pastJobs.length > 0 && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>
                                    Work Experience
                                </h3>
                                <div className="space-y-5">
                                    {profile.pastJobs.map((job, index) => (
                                        <div
                                            key={index}
                                            className="pb-5 border-b border-slate-200 last:border-0 last:pb-0"
                                        >
                                            <h4 className="text-lg font-semibold text-slate-900">
                                                {job.title}{" "}
                                                <span className="text-emerald-600">
                                                    @ {job.company}
                                                </span>
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-1">
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
                                                <p className="text-slate-700 mt-3 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {profile.education && profile.education.length > 0 && (
                            <div className={cardClass}>
                                <h3 className={headingClass}>Education</h3>
                                <div className="space-y-5">
                                    {profile.education.map((edu, index) => (
                                        <div
                                            key={index}
                                            className="pb-5 border-b border-slate-200 last:border-0 last:pb-0"
                                        >
                                            <h4 className="text-lg font-semibold text-slate-900">
                                                {edu.degree}{" "}
                                                {edu.field && (
                                                    <span className="text-emerald-600">
                                                        {edu.field}
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-slate-700 font-medium mt-1">
                                                {edu.institution}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">
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
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
