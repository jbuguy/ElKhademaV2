import { formatDistanceToNow } from "date-fns";

export default function Comment({ comment }) {
  return (<div>
    <div className="flex gap-4 mt-2">
      <img src={"https://i.pravatar.cc/150?img=1"} alt={`${comment.username} profile`} className="rounded-full h-8" />
      <div className="flex flex-col gap-1">
        <div>
          <span className="font-bold">{comment.username}</span>{" "}
          <span className="text-gray-700">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  </div>)
}
