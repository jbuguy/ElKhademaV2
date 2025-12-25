import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { BiCommentDetail, BiSend } from "react-icons/bi";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";

export default function Post({ post }) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
  const [likes, setLikes] = useState(post.likesCount);
  const toggleLiked = () => {
    setIsLiked(prev => !prev);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  }
  return (
    <div className="bg-white rounded m-2 p-4  shadow">
      <div className="flex gap-4 items-center">
        <img src={post.userProfilePicture} alt={`${post.username} profile`} className="rounded-full h-10" />
        <span className="font-bold">{post.username}</span>
        <span className="font-thin text-gray-600 text-sm">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="mt-2">{post.content}</div>

      <hr className="border-0 h-px bg-gray-300 my-2" />

      <div className="flex justify-between items-center text-gray-600 mt-2">
        <button className="flex items-center gap-1" onClick={toggleLiked}>
          {isLiked ? <FaThumbsUp className="text-blue-500" /> : <FaRegThumbsUp />} {likes}
        </button>
        <button onClick={() => setCommentsVisible(prev => !prev)}>
          <BiCommentDetail />
        </button>
        <button>
          <BiSend />
        </button>
      </div>

      {commentsVisible && <Comments comments={post.comments} />}
    </div>
  )
}
