import { useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import useProfileForm from "../hooks/useProfileForm";
import ProfileEditForm from "../components/ProfileEditForm";

function EditProfile() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();

    const {
        profile,
        user,
        profileImage,
        setProfileImage,
        profileImagePreview,
        videoCvFile,
        setVideoCvFile,
        videoCvPreview,
        setVideoCvPreview,
        removeVideo,
        setRemoveVideo,
        formData,
        setFormData,
        loading,
        error,
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
    } = useProfileForm();

    if (loading) return <div>Loading...</div>;
    if (!profile || !user) return <div>Profile not found</div>;

    return (
        <div className="profile">
            <div className="profile-container">
                <h2>Edit Profile</h2>
                <ProfileEditForm
                    error={error}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    videoCvFile={videoCvFile}
                    setVideoCvFile={setVideoCvFile}
                    videoCvPreview={videoCvPreview}
                    setVideoCvPreview={setVideoCvPreview}
                    removeVideo={removeVideo}
                    setRemoveVideo={setRemoveVideo}
                    profile={profile}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={(e) =>
                        handleSubmit(e, {
                            onSuccess: () => navigate("/profile"),
                        })
                    }
                    handleAddSkill={handleAddSkill}
                    handleSkillChange={handleSkillChange}
                    handleRemoveSkill={handleRemoveSkill}
                    handleAddJob={handleAddJob}
                    handleJobChange={handleJobChange}
                    handleRemoveJob={handleRemoveJob}
                    handleAddEducation={handleAddEducation}
                    handleEducationChange={handleEducationChange}
                    handleRemoveEducation={handleRemoveEducation}
                    setIsEditing={() => navigate("/profile")}
                />
            </div>
        </div>
    );
}

export default EditProfile;
