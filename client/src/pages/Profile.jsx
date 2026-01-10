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
import { UserPlus, UserCheck, X, MessageCircle, Heart } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useGenerateCV } from "../hooks/useGenerateCV";

function Profile() {
    const { username: paramUsername } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();

    const username =
        paramUsername ??
        currentUser?.username ??
        currentUser?.email?.split("@")[0];

    const { openChat } = useChat();

    const handleOpenChat = async () => {
        if (!currentUser || !user?._id) return;
        try {
            const res = await api.post(
                "/conversation",
                { members: [user._id] },
                { headers: { authorization: `Bearer ${currentUser.token}` } }
            );
            const conversation = res.data;
            openChat({
                _id: conversation._id,
                displayName: user.username,
                displayPic: user.profilePic,
            });
        } catch (err) {
            alert("Could not start chat");
            console.error(err);
        }
    };

    const isOwner = Boolean(
        currentUser &&
            (currentUser.username === username ||
                currentUser.email?.split("@")[0] === username)
    );

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

    // Connection states
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [connections, setConnections] = useState([]);
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [loadingConnections, setLoadingConnections] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null); // 'pending', 'connected', null

    // Follow states
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollowStatus, setLoadingFollowStatus] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);

    const { generateCV } = useGenerateCV();

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

    // Fetch connection data and follow status
    useEffect(() => {
        const fetchConnectionData = async () => {
            if (!username) return;
            try {
                setLoadingConnections(true);
                const [
                    followersRes,
                    followingRes,
                    connectionsRes,
                    requestsRes,
                ] = await Promise.all([
                    api
                        .get(`/user/followers/${username}`)
                        .catch(() => ({ data: [] })),
                    api
                        .get(`/user/following/${username}`)
                        .catch(() => ({ data: [] })),
                    api
                        .get(`/user/connections/${username}`)
                        .catch(() => ({ data: [] })),
                    isOwner
                        ? api
                              .get(`/user/connection-requests`)
                              .catch(() => ({ data: [] }))
                        : Promise.resolve({ data: [] }),
                ]);

                setFollowers(followersRes.data || []);
                setFollowing(followingRes.data || []);
                setConnections(connectionsRes.data || []);
                setConnectionRequests(requestsRes.data || []);

                // Check current connection status
                if (!isOwner && currentUser) {
                    const checkRes = await api
                        .get(`/user/connection-status/${username}`, {
                            headers: {
                                authorization: `Bearer ${currentUser.token}`,
                            },
                        })
                        .catch(() => ({ data: {} }));
                    setConnectionStatus(checkRes.data?.status);
                    setIsConnected(checkRes.data?.status === "connected");
                }
            } catch (err) {
                console.error("Error fetching connections:", err);
            } finally {
                setLoadingConnections(false);
            }
        };

        fetchConnectionData();
    }, [username, isOwner, currentUser]);

    // Fetch follow status
    useEffect(() => {
        const fetchFollowStatus = async () => {
            if (!currentUser || isOwner || !user?._id) return;

            try {
                setLoadingFollowStatus(true);
                const res = await api.get(`/user/follow/${user._id}`, {
                    headers: { authorization: `Bearer ${currentUser.token}` },
                });
                setIsFollowing(res.data.isFollowing);
            } catch (err) {
                console.error("Error fetching follow status:", err);
            } finally {
                setLoadingFollowStatus(false);
            }
        };

        fetchFollowStatus();
    }, [user?._id, currentUser, isOwner]);

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

    const handleSendConnection = async () => {
        if (!currentUser)
            return alert("Please log in to send connection request");
        try {
            await api.post(
                `/user/send-connection-request/${username}`,
                {},
                {
                    headers: { authorization: `Bearer ${currentUser.token}` },
                }
            );
            setConnectionStatus("pending");
        } catch (err) {
            alert(
                err.response?.data?.error || "Failed to send connection request"
            );
        }
    };

    const handleAcceptConnection = async (requestId) => {
        try {
            await api.post(
                `/user/accept-connection/${requestId}`,
                {},
                {
                    headers: { authorization: `Bearer ${currentUser.token}` },
                }
            );
            setConnectionRequests((prev) =>
                prev.filter((r) => r._id !== requestId)
            );
            setConnections((prev) => [
                ...prev,
                ...connectionRequests.filter((r) => r._id === requestId),
            ]);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to accept connection");
        }
    };

    const handleRejectConnection = async (requestId) => {
        try {
            await api.post(
                `/user/reject-connection/${requestId}`,
                {},
                {
                    headers: { authorization: `Bearer ${currentUser.token}` },
                }
            );
            setConnectionRequests((prev) =>
                prev.filter((r) => r._id !== requestId)
            );
        } catch (err) {
            alert(err.response?.data?.error || "Failed to reject connection");
        }
    };

    const handleRemoveConnection = async (connectedUserId) => {
        try {
            await api.delete(`/user/remove-connection/${connectedUserId}`, {
                headers: { authorization: `Bearer ${currentUser.token}` },
            });
            setConnections((prev) =>
                prev.filter((c) => c._id !== connectedUserId)
            );
            setIsConnected(false);
            setConnectionStatus(null);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to remove connection");
        }
    };

    const handleFollowToggle = async () => {
        if (!currentUser) return alert("Please log in to follow");
        if (!user?._id) return;

        try {
            setFollowingLoading(true);
            if (isFollowing) {
                // Unfollow
                await api.delete(`/user/follow/${user._id}`, {
                    headers: {
                        authorization: `Bearer ${currentUser.token}`,
                    },
                });
                setIsFollowing(false);
                setFollowers((prev) =>
                    prev.filter((f) => f._id !== currentUser._id)
                );
            } else {
                // Follow
                await api.post(
                    `/user/follow/${user._id}`,
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${currentUser.token}`,
                        },
                    }
                );
                setIsFollowing(true);
                setFollowers((prev) => [...prev, currentUser]);
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
            alert(
                err.response?.data?.error || "Failed to update follow status"
            );
        } finally {
            setFollowingLoading(false);
        }
    };

    useEffect(() => {
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

    const handleGenerateCV = async () => {
        try {
            await generateCV(user, profile);
        } catch (err) {
            console.error(err);
            alert("Failed to generate CV. Please try again.");
        }
    };

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

                    {/* Connection & Message & Follow Buttons */}
                    {!isOwner && currentUser && !isEditing && (
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200/50 flex gap-3 flex-wrap">
                            {connectionStatus === "pending" ? (
                                <button
                                    disabled
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium cursor-not-allowed"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    Connection Pending
                                </button>
                            ) : isConnected ? (
                                <button
                                    onClick={() =>
                                        handleRemoveConnection(user._id)
                                    }
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                                >
                                    <X className="w-4 h-4" />
                                    Remove Connection
                                </button>
                            ) : (
                                <button
                                    onClick={handleSendConnection}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Send Connection Request
                                </button>
                            )}

                            {/* Follow/Unfollow Button */}
                            <button
                                onClick={handleFollowToggle}
                                disabled={
                                    followingLoading || loadingFollowStatus
                                }
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                                    isFollowing
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-pink-600 hover:bg-pink-700 text-white"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <Heart
                                    className={`w-4 h-4 ${
                                        isFollowing ? "fill-current" : ""
                                    }`}
                                />
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>

                            {/* Message Button */}
                            <button
                                onClick={handleOpenChat}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Message
                            </button>
                        </div>
                    )}

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

                    {/* Followers Tab */}
                    {!isEditing && activeTab === "followers" && (
                        <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                Followers ({followers.length})
                            </h3>
                            {loadingConnections ? (
                                <div className="text-center text-gray-600">
                                    Loading...
                                </div>
                            ) : followers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {followers.map((follower) => (
                                        <div
                                            key={follower._id}
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={follower.profilePic}
                                                    alt={follower.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {follower.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {follower.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/profile/${follower.username}`
                                                    )
                                                }
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    No followers yet
                                </p>
                            )}
                        </div>
                    )}

                    {/* Following Tab */}
                    {!isEditing && activeTab === "following" && (
                        <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                Following ({following.length})
                            </h3>
                            {loadingConnections ? (
                                <div className="text-center text-gray-600">
                                    Loading...
                                </div>
                            ) : following.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {following.map((followee) => (
                                        <div
                                            key={followee._id}
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={followee.profilePic}
                                                    alt={followee.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {followee.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {followee.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/profile/${followee.username}`
                                                    )
                                                }
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    Not following anyone yet
                                </p>
                            )}
                        </div>
                    )}

                    {/* Connections Tab */}
                    {!isEditing && activeTab === "connections" && (
                        <div className="space-y-6">
                            {/* Connection Requests */}
                            {isOwner && connectionRequests.length > 0 && (
                                <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white p-6">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                        Pending Connection Requests (
                                        {connectionRequests.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {connectionRequests.map((request) => (
                                            <div
                                                key={request._id}
                                                className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            request.requester
                                                                ?.profilePic
                                                        }
                                                        alt={
                                                            request.requester
                                                                ?.username
                                                        }
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                request
                                                                    .requester
                                                                    ?.username
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                request
                                                                    .requester
                                                                    ?.email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleAcceptConnection(
                                                                request._id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRejectConnection(
                                                                request._id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Connections List */}
                            <div className="rounded-2xl shadow-sm border border-slate-200/50 bg-white p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                    Connections ({connections.length})
                                </h3>
                                {loadingConnections ? (
                                    <div className="text-center text-gray-600">
                                        Loading...
                                    </div>
                                ) : connections.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {connections.map((connection) => (
                                            <div
                                                key={connection._id}
                                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            connection.profilePic
                                                        }
                                                        alt={
                                                            connection.username
                                                        }
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                connection.username
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {connection.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/profile/${connection.username}`
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                                                    >
                                                        View
                                                    </button>
                                                    {isOwner && (
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveConnection(
                                                                    connection._id
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-600">
                                        No connections yet
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
