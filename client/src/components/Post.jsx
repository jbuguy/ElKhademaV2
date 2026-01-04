import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { BiCommentDetail, BiSend } from "react-icons/bi";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import { Link } from "react-router";
import Comments from "./Comments";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";
import MediaGrid from "./MediaGrid";
import Toast from "./Toast";

export default function Post({ post }) {
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [isLiked, setIsLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.totalLikes);
    const [showToast, setShowToast] = useState(false);
    const [reportMsg, setReportMsg] = useState("");
    const { user } = useAuthContext();
    const [comments, setComments] = useState([]);

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
        <div className="bg-white rounded m-2 p-4  shadow">
            {post.sharedFrom && (
                <div className="flex items-center gap-2 mb-2 text-gray-600 text-sm">
                    <BiSend className="text-blue-500" />
                    <span>
                        <strong>
                            {post.userId.displayName || post.userId.username}
                        </strong>{" "}
                        shared this
                    </span>
                </div>
            )}
            <div className="flex gap-4 items-center">
                <img
                    src={
                        post.sharedFrom
                            ? post.sharedFrom.userId.profilePic
                            : post?.userId?.profilePic
                    }
                    alt="profile"
                    className="rounded-full h-10"
                />
                <Link
                    to={`/profile/${
                        post.sharedFrom
                            ? post.sharedFrom.userId.username
                            : post.userId.username
                    }`}
                    className="font-bold hover:underline"
                >
                    {post.sharedFrom
                        ? post.sharedFrom.userId.displayName ||
                          post.sharedFrom.userId.username
                        : post.userId.displayName || post.userId.username}
                </Link>
                <span className="font-thin text-gray-600 text-sm">
                    {formatDistanceToNow(
                        new Date(
                            post.sharedFrom
                                ? post.sharedFrom.createdAt
                                : post.createdAt
                        ),
                        { addSuffix: true }
                    )}
                </span>
            </div>
            <div className="mt-2">{post.content}</div>
            <MediaGrid media={post.media} />
            <hr className="border-0 h-px bg-gray-300 my-2" />
            <div className="flex justify-around items-center text-gray-600 mt-2">
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={toggleLiked}
                >
                    {isLiked ? (
                        <FaThumbsUp className="text-blue-500" />
                    ) : (
                        <FaRegThumbsUp />
                    )}{" "}
                    {likes} likes
                </button>
                <button
                    className="flex items-center gap-1 cursor-pointer "
                    onClick={() => setCommentsVisible(true)}
                >
                    <BiCommentDetail /> comment
                </button>
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={handleShare}
                >
                    <BiSend /> share
                </button>
                <button
                    className="flex items-center gap-1 cursor-pointer text-red-600"
                    onClick={reportPost}
                >
                    Report
                </button>
            </div>
            {commentsVisible && (
                <Comments comments={comments} addComment={addComment} />
            )}{" "}
            {showToast && (
                <Toast
                    message="You have shared a post"
                    onClose={() => setShowToast(false)}
                />
            )}{" "}
            {reportMsg && (
                <Toast message={reportMsg} onClose={() => setReportMsg("")} />
            )}{" "}
        </div>
    );
}
