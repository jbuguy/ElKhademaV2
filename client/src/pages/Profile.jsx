import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";
import Posts from "../components/Posts";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";
import ProfileEditForm from "../components/ProfileEditForm";
import ProfileAbout from "../components/ProfileAbout";
import useProfileForm from "../hooks/useProfileForm";

function Profile() {
    const { username: paramUsername } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();

    const username =
        paramUsername ??
        currentUser?.username ??
        currentUser?.email?.split("@")[0];
    const isOwner = Boolean(
        currentUser &&
            (currentUser.username === username ||
                currentUser.email?.split("@")[0] === username)
    );

    // use shared profile form hook
    const {
        profile,
        user,
        formData,
        setFormData,
        profileImage,
        setProfileImage,
        videoCvFile,
        setVideoCvFile,
        videoCvPreview,
        setVideoCvPreview,
        removeVideo,
        setRemoveVideo,
        loading: formLoading,
        error: formError,
        handleSubmit: hookHandleSubmit,
        handleAddSkill,
        handleSkillChange,
        handleRemoveSkill,
        handleAddJob,
        handleJobChange,
        handleRemoveJob,
        handleAddEducation,
        handleEducationChange,
        handleRemoveEducation,
        setUser: setHookUser,
        setProfile: setHookProfile,
    } = useProfileForm({ username });

    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState(null);
    const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoadingPosts(true);
                const postsRes = await api.get(
                    `/user/profile/${username}/posts`
                );
                setPosts(postsRes.data);
            } catch (err) {
                console.error(
                    "Error fetching posts:",
                    err?.response?.data || err
                );
            } finally {
                setLoadingPosts(false);
            }
        };

        if (username) fetchPosts();
    }, [username]);

    useEffect(() => {
        // if owner and openEdit, open editor and set profile completion flag
        if (isOwner && profile) {
            if (location.state?.openEdit) {
                setIsEditing(true);
                setActiveTab("about");
                if (!profile.isProfileComplete) setNeedsProfileCompletion(true);
            }
        }
    }, [isOwner, profile, location.state?.openEdit]);

    const handleSubmit = async (e) => {
        try {
            await hookHandleSubmit(e, {
                onSuccess: (resData) => {
                    // resData is the updated profile (per server)
                    setHookProfile(resData);

                    if (formData.profilePic) {
                        setHookUser((u) => ({
                            ...u,
                            profilePic: formData.profilePic,
                        }));
                    }

                    setNeedsProfileCompletion(false);
                    setIsEditing(false);
                    setProfileImage(null);

                    if (location.state?.openEdit)
                        navigate("/", { replace: true });
                },
            });
        } catch (err) {
            setError(
                err.response?.data?.error ||
                    "Failed to update profile. Please try again."
            );
        }
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

    if (formLoading || loadingPosts) {
        return <div>Loading profile...</div>;
    }

    if (!profile || !user) {
        return <div>Profile not found</div>;
    }

    return (
        <div className="profile">
            <div className="profile-container">
                <ProfileHeader
                    user={user}
                    profile={profile}
                    isOwner={isOwner}
                    isEditing={isEditing}
                    onEdit={() => navigate("/profile/editprofile")}
                    onGenerateCV={handleGenerateCV}
                />
                {!isEditing && (
                    <ProfileTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        isEditing={isEditing}
                    />
                )}

                {isEditing && (
                    <ProfileEditForm
                        error={formError || error}
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
                        handleSubmit={handleSubmit}
                        handleAddSkill={handleAddSkill}
                        handleSkillChange={handleSkillChange}
                        handleRemoveSkill={handleRemoveSkill}
                        handleAddJob={handleAddJob}
                        handleJobChange={handleJobChange}
                        handleRemoveJob={handleRemoveJob}
                        handleAddEducation={handleAddEducation}
                        handleEducationChange={handleEducationChange}
                        handleRemoveEducation={handleRemoveEducation}
                        setIsEditing={setIsEditing}
                    />
                )}

                {!isEditing && activeTab === "about" && (
                    <ProfileAbout profile={profile} />
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
