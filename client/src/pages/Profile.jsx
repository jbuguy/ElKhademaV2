import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";
import Posts from "../components/Posts";
import CreatePost from "../components/CreatePost";
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

    const addPost = async (post) => {
        if (!currentUser) return alert("Please log in to post");
        try {
            const res = await api.post(
                "/post",
                { content: post.content, media: post.media },
                {
                    headers: { authorization: `Bearer ${currentUser.token}` },
                }
            );
            setPosts((prev) => [res.data, ...(prev || [])]);
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Failed to create post. Please try again.");
        }
    };

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
        <div className="min-h-screen bg-slate-50">
            <div className="page-container py-8">
                <div className="max-w-4xl mx-auto space-y-6">
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
                        <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white p-8">
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
                        </div>
                    )}

                    {!isEditing && activeTab === "about" && (
                        <div className="space-y-4">
                            <ProfileAbout profile={profile} />
                        </div>
                    )}

                    {!isEditing && activeTab === "posts" && (
                        <div className="space-y-4">
                            {isOwner && <CreatePost addPost={addPost} />}
                            {posts && posts.length > 0 ? (
                                <Posts posts={posts} />
                            ) : (
                                <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white px-8 py-12 text-center">
                                    <p className="text-slate-600 text-lg">
                                        No posts yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
