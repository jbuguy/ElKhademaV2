import { useNavigate } from "react-router";
import useProfileForm from "../hooks/useProfileForm";
import ProfileEditForm from "../components/ProfileEditForm";

function EditProfile() {
    const navigate = useNavigate();

    const {
        profile,
        user,
        profileImage,
        setProfileImage,
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
        <div className="min-h-screen bg-slate-50">
            <div className="page-container py-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-emerald-600 mb-8">
                        Edit Profile
                    </h2>
                    <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white p-8 hover:shadow-md transition-all">
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
            </div>
        </div>
    );
}

export default EditProfile;
