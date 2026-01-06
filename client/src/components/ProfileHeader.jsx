export default function ProfileHeader({
    user,
    profile,
    isOwner,
    isEditing,
    onEdit,
    onGenerateCV,
}) {
    return (
        <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white p-8 hover:shadow-md transition-all">
            <div className="flex items-center gap-8">
                <img
                    src={user.profilePic || "https://via.placeholder.com/150"}
                    alt={user.username}
                    className="rounded-full h-28 w-28 object-cover border-4 border-emerald-100 shadow-md"
                />

                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-emerald-600 mb-1">
                        {profile.companyName ||
                            `${profile.firstName || ""} ${
                                profile.lastName || ""
                            }`.trim() ||
                            user.username}
                    </h2>
                    <p className="text-slate-500 mb-5">@{user.username}</p>

                    {isOwner && !isEditing && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onEdit}
                                className="btn btn-primary"
                            >
                                Edit Profile
                            </button>
                            {profile.profileType !== "company" && (
                                <button onClick={onGenerateCV} className="btn">
                                    Generate CV
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
