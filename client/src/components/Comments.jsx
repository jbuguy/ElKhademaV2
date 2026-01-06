import { useState } from "react";
import Comment from "../components/Comment.jsx";
import CreateComment from "../components/CreateComment.jsx";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Comments({ comments, addComment, postId }) {
    const [commentsList, setCommentsList] = useState(comments || []);
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
