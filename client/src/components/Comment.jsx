import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { useState } from "react";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";
import Toast from "./Toast";

export default function Comment({ comment }) {
    const { user } = useAuthContext();
    const [msg, setMsg] = useState("");

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

    return (
        <div>
            <div className="flex gap-4 mt-2">
                <img
                    src={comment.userId.profilePic}
                    alt={`${comment.username} profile`}
                    className="rounded-full h-8"
                />
                <div className="flex flex-col gap-1">
                    <div>
                        <Link
                            to={`/profile/${comment.userId.username}`}
                            className="font-bold hover:underline"
                        >
                            {comment.userId.displayName ||
                                comment.userId.username}
                        </Link>{" "}
                        <span className="text-gray-700">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <div>{comment.content}</div>
                        <button
                            className="text-sm text-red-600"
                            onClick={reportComment}
                        >
                            Report
                        </button>
                    </div>
                </div>
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg("")} />}
        </div>
    );
}
