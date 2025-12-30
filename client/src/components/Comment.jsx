import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";

export default function Comment({ comment }) {
  return (<div>
    <div className="flex gap-4 mt-2">
      <img src={comment.userId.profilePic} alt={`${comment.username} profile`} className="rounded-full h-8" />
      <div className="flex flex-col gap-1">
        <div>
          <Link to={`/profile/${comment.userId.username}`} className="font-bold hover:underline">
            {comment.userId.displayName || comment.userId.username}
          </Link>{" "}
          <span className="text-gray-700">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  </div>)
}
