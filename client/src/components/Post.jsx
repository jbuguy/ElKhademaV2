import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { BiCommentDetail, BiSend } from "react-icons/bi";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import { Link } from "react-router";
import Comments from "./Comments";
import PostMenu from "./PostMenu";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";
import MediaGrid from "./MediaGrid";
import Toast from "./Toast";
import { useNavigate } from "react-router";

const deletePost = async (postId, token) => {
    return api.delete(`/post/${postId}`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
};
export default function Post({ post }) {
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [isLiked, setIsLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.totalLikes);
    const [showToast, setShowToast] = useState(false);
    const [reportMsg, setReportMsg] = useState("");
    const { user } = useAuthContext();
    const [comments, setComments] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const reportPost = async () => {
        if (!user) return alert("Please log in to report");
        const reason = prompt("Reason for reporting this post (required):");
        if (!reason) return;
        try {
            await api.post("/reports", {
                type: "post",
                targetId: post._id,
                reason,
                description: "",
            });
            setReportMsg("Report submitted");
        } catch (err) {
            console.error(err);
            setReportMsg(err.response?.data?.error || err.message);
        }
    };
    useEffect(() => {
        if (!commentsVisible) return;
        api.get(`/post/${post._id}/comments`, {
            headers: { authorization: `Bearer ${user.token}` },
        }).then((res) => setComments(res.data));

        return () => {
            return;
        };
    }, [commentsVisible]);
    const navigate = useNavigate();

    const handleDeletePost = async () => {
        try {
            await deletePost(post._id, user.token);
            setShowDeleteModal(false);
            navigate(0); 
        } catch (err) {
            console.error(err);
            alert("Failed to delete post");
        }
    };

    const toggleLiked = async () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        if (newLikedState) {
            const res = await api.post(
                `/post/${post._id}/like`,
                {},
                {
                    headers: { authorization: `Bearer ${user.token}` },
                }
            );
            setLikes(res.data.totalLikes);
        } else {
            const res = await api.delete(`/post/${post._id}/like`, {
                headers: { authorization: `Bearer ${user.token}` },
            });
            setLikes(res.data.totalLikes);
        }
    };

    const addComment = async (comment) => {
        const res = await api.post(`/post/${post._id}/comments`, comment, {
            headers: {
                authorization: `Bearer ${user.token}`,
            },
        });
        setComments((prev) => [...prev, res.data]);
    };

    const handleShare = async () => {
        try {
            await api.post(
                `/post/${post._id}/share`,
                {},
                {
                    headers: { authorization: `Bearer ${user.token}` },
                }
            );
            setShowToast(true);
        } catch (error) {
            console.error("Error sharing post:", error);
        }
    };
    return (
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden hover:shadow-md transition-all">
            {/* Post Header */}
            <ConfirmDeleteModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeletePost}
            />
            <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <img
                        src={
                            post.sharedFrom
                                ? post.sharedFrom.userId.profilePic
                                : post?.userId?.profilePic
                        }
                        alt="profile"
                        className="rounded-full h-16 w-16 object-cover"
                    />
                    <div>
                        <Link
                            to={`/profile/${
                                post.sharedFrom
                                    ? post.sharedFrom.userId.username
                                    : post.userId.username
                            }`}
                            className="font-semibold text-slate-900 hover:underline text-base"
                        >
                            {post.sharedFrom
                                ? post.sharedFrom.userId.displayName ||
                                  post.sharedFrom.userId.username
                                : post.userId.displayName ||
                                  post.userId.username}
                        </Link>
                        <p className="text-sm text-slate-500">
                            {formatDistanceToNow(
                                new Date(
                                    post.sharedFrom
                                        ? post.sharedFrom.createdAt
                                        : post.createdAt
                                ),
                                { addSuffix: true }
                            )}
                        </p>
                    </div>
                </div>
                <PostMenu
                    isOwner={
                        user &&
                        (user.role === "admin" || user._id === post.userId._id)
                    }
                    onDelete={() => setShowDeleteModal(true)}
                    onReport={reportPost}
                />
            </div>

            {post.sharedFrom && (
                <div className="flex items-center gap-2 px-8 py-3 text-slate-500 text-sm bg-slate-50 border-b border-slate-100">
                    <span>
                        <strong>
                            {post.userId.displayName || post.userId.username}
                        </strong>{" "}
                        shared this
                    </span>
                </div>
            )}

            {/* Post Content */}
            <div className="px-8 py-7">
                <div className="text-slate-800 text-lg mb-5 leading-relaxed">
                    {post.content}
                </div>
                <MediaGrid media={post.media} />
            </div>

            {/* Post Actions */}
            <div className="px-8 py-5 flex items-center justify-between border-t border-slate-100">
                <button
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all group font-medium"
                    onClick={toggleLiked}
                >
                    {isLiked ? (
                        <FaThumbsUp className="text-emerald-600" size={18} />
                    ) : (
                        <FaRegThumbsUp size={18} />
                    )}
                    <span className="text-sm">{likes}</span>
                </button>
                <button
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all font-medium"
                    onClick={() => setCommentsVisible(true)}
                >
                    <BiCommentDetail size={18} />
                    <span className="text-sm">Comment</span>
                </button>
                <button
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all font-medium"
                    onClick={handleShare}
                >
                    <BiSend size={18} />
                    <span className="text-sm">Share</span>
                </button>
                
            </div>

            {commentsVisible && (
                <Comments
                    comments={comments}
                    addComment={addComment}
                    postId={post._id}
                />
            )}
            {showToast && (
                <Toast
                    message="You have shared a post"
                    onClose={() => setShowToast(false)}
                />
            )}
            {reportMsg && (
                <Toast message={reportMsg} onClose={() => setReportMsg("")} />
            )}
        </article>
    );
}
