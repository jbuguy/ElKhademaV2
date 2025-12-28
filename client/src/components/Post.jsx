import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { BiCommentDetail, BiSend } from "react-icons/bi";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import Comments from "./Comments";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Post({ post }) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
  const [likes, setLikes] = useState(post.likesCount);
  const { user } = useAuthContext();
  const toggleLiked = async () => {
    setIsLiked(prev => !prev);
    if (isLiked) {
      const res = await api.post(`/post/${post._id}/like`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
      setLikes(res.data.totalLikes);
      setIsLiked(res.data.liked);
    } else {
      const res = await api.delete(`/post/${post._id}/like`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
      setLikes(res.data.totalLikes);
      setIsLiked(res.data.liked);
    }

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

      <div className="flex justify-around items-center text-gray-600 mt-2">
        <button className="flex items-center gap-1 cursor-pointer" onClick={toggleLiked}>
          {isLiked ? <FaThumbsUp className="text-blue-500" /> : <FaRegThumbsUp />} {likes} likes
        </button>
        <button className="flex items-center gap-1 cursor-pointer " onClick={() => setCommentsVisible(prev => !prev)}>
          <BiCommentDetail /> comment
        </button>
        <button className="flex items-center gap-1 cursor-pointer ">
          <BiSend /> share
        </button>
      </div>

      {commentsVisible && <Comments comments={post.comments} />}
    </div>
  )
}
