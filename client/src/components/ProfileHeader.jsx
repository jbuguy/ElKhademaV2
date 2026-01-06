export default function ProfileHeader({
    user,
    profile,
    isOwner,
    isEditing,
    onEdit,
    onGenerateCV,
}) {
    return (
        <div className="profile-header">
            <img
                src={user.profilePic || "https://via.placeholder.com/150"}
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
                        <button onClick={onEdit} className="edit-btn">
                            Edit Profile
                        </button>
                        {profile.profileType !== "company" && (
                            <button onClick={onGenerateCV} className="edit-btn">
                                Generate CV
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
