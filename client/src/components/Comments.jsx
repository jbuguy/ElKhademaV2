import { useState, useEffect } from "react";
import Comment from "../components/Comment.jsx";
import CreateComment from "../components/CreateComment.jsx";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Comments({ comments, addComment, postId }) {
    const [commentsList, setCommentsList] = useState(comments || []);

    useEffect(() => {
        console.log("Comments prop changed:", comments);
        setCommentsList(comments || []);
    }, [comments]);
    const { user } = useAuthContext();

    const handleReply = async (commentId, replyContent) => {
        if (!user) return alert("Please log in to reply");
        try {
            const res = await api.post(
                `/post/${postId}/comments/${commentId}/reply`,
                { content: replyContent },
                { headers: { authorization: `Bearer ${user.token}` } }
            );
            setCommentsList((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? {
                              ...comment,
                              replies: [...(comment.replies || []), res.data],
                          }
                        : comment
                )
            );
        } catch (err) {
            console.error("Error replying to comment:", err);
            throw err;
        }
    };

    return (
        <div className="space-y-4">
            <CreateComment addComment={addComment} />
            <div className="space-y-3">
                <p className="text-sm text-slate-500">
                    {commentsList.length} comment(s)
                </p>
                {commentsList.length === 0 && (
                    <p className="text-slate-400 text-center py-4">
                        No comments yet. Be the first to comment!
                    </p>
                )}
                {commentsList.map((comment) => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        replies={comment.replies || []}
                        onReply={handleReply}
                    />
                ))}
            </div>
        </div>
    );
}
