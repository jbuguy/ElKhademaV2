import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { useState } from "react";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";
import Toast from "./Toast";
import { MessageCircle, Flag } from "lucide-react";

export default function Comment({ comment, onReply, replies = [] }) {
    const { user } = useAuthContext();
    const [msg, setMsg] = useState("");
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const reportComment = async () => {
        if (!user) return alert("Please log in to report");
        const reason = prompt("Reason for reporting this comment (required):");
        if (!reason) return;
        try {
            await api.post("/reports", {
                type: "comment",
                targetId: comment._id,
                reason,
                description: "",
            });
            setMsg("Report submitted");
        } catch (err) {
            console.error(err);
            setMsg(err.response?.data?.error || err.message);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        if (!user) return alert("Please log in to reply");

        setIsSubmittingReply(true);
        try {
            await onReply(comment._id, replyContent);
            setReplyContent("");
            setShowReplyForm(false);
            setShowReplies(true);
        } catch (err) {
            console.error("Error replying to comment:", err);
            alert("Failed to reply. Please try again.");
        } finally {
            setIsSubmittingReply(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200/50 p-4 hover:bg-slate-100 transition-all">
                <div className="flex gap-3">
                    <Link
                        to={`/profile/${comment.userId.username}`}
                        className="flex-shrink-0"
                    >
                        <img
                            src={comment.userId.profilePic}
                            alt={`${comment.username} profile`}
                            className="rounded-full h-9 w-9 object-cover border border-emerald-200"
                        />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Link
                                to={`/profile/${comment.userId.username}`}
                                className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                            >
                                {comment.userId.displayName ||
                                    comment.userId.username}
                            </Link>
                            <span className="text-xs text-slate-500">
                                {formatDistanceToNow(
                                    new Date(comment.createdAt),
                                    {
                                        addSuffix: true,
                                    }
                                )}
                            </span>
                        </div>
                        <div className="mt-2 text-slate-700 text-sm leading-relaxed">
                            {comment.content}
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                            >
                                <MessageCircle size={14} />
                                Reply
                            </button>
                            <button
                                onClick={reportComment}
                                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            >
                                <Flag size={14} />
                                Report
                            </button>
                            {replies && replies.length > 0 && (
                                <button
                                    onClick={() => setShowReplies(!showReplies)}
                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 ml-auto"
                                >
                                    {showReplies ? "Hide" : "Show"}{" "}
                                    {replies.length}{" "}
                                    {replies.length === 1 ? "reply" : "replies"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showReplyForm && (
                <div className="ml-4 border-l-2 border-emerald-200 pl-4">
                    <form onSubmit={handleReplySubmit} className="flex gap-2">
                        <img
                            src={user?.profilePic}
                            alt="Your profile"
                            className="rounded-full h-7 w-7 object-cover"
                        />
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                placeholder="Write a reply..."
                                className="flex-1 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={
                                    !replyContent.trim() || isSubmittingReply
                                }
                                className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmittingReply ? "..." : "Reply"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showReplies && replies && replies.length > 0 && (
                <div className="ml-4 border-l-2 border-slate-200 pl-4 space-y-3">
                    {replies.map((reply) => (
                        <div
                            key={reply._id}
                            className="rounded-xl bg-slate-50 border border-slate-200/50 p-4"
                        >
                            <div className="flex gap-3">
                                <Link
                                    to={`/profile/${reply.userId.username}`}
                                    className="flex-shrink-0"
                                >
                                    <img
                                        src={reply.userId.profilePic}
                                        alt={`${reply.userId.username} profile`}
                                        className="rounded-full h-8 w-8 object-cover border border-emerald-200"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Link
                                            to={`/profile/${reply.userId.username}`}
                                            className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors text-sm"
                                        >
                                            {reply.userId.displayName ||
                                                reply.userId.username}
                                        </Link>
                                        <span className="text-xs text-slate-500">
                                            {formatDistanceToNow(
                                                new Date(reply.createdAt),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-slate-700 text-sm leading-relaxed">
                                        {reply.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {msg && <Toast message={msg} onClose={() => setMsg("")} />}
        </div>
    );
}
