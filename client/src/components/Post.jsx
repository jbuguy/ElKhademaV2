import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { BiCommentDetail, BiSend } from "react-icons/bi";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import Comments from "./Comments";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";
import MediaGrid from "./MediaGrid";

export default function Post({ post }) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.totalLikes);
  const { user } = useAuthContext();
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (!commentsVisible) return;
    api.get(`/post/${post._id}/comments`, { headers: { authorization: `Bearer ${user.token}` } }).then(res => setComments(res.data));

    return () => {
      return
    }
  }, [commentsVisible])



  const toggleLiked = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    if (newLikedState) {
      const res = await api.post(`/post/${post._id}/like`, {}, {
        headers: { authorization: `Bearer ${user.token}` },
      });
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
        authorization: `Bearer ${user.token}`
      }
    });
    setComments(prev => [...prev, res.data]);
  }

  return (
    <div className="bg-white rounded m-2 p-4  shadow">
      <div className="flex gap-4 items-center">
        <img src={post?.userId?.profilePic} alt={`${post?.userId?.username} profile`} className="rounded-full h-10" />
        <span className="font-bold">{post.userId.username}</span>
        <span className="font-thin text-gray-600 text-sm">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="mt-2">{post.content}</div>
      <MediaGrid media={post.media} />
      <hr className="border-0 h-px bg-gray-300 my-2" />

      <div className="flex justify-around items-center text-gray-600 mt-2">
        <button className="flex items-center gap-1 cursor-pointer" onClick={toggleLiked}>
          {isLiked ? <FaThumbsUp className="text-blue-500" /> : <FaRegThumbsUp />} {likes} likes
        </button>
        <button className="flex items-center gap-1 cursor-pointer " onClick={() => setCommentsVisible(true)}>
          <BiCommentDetail /> comment
        </button>
        <button className="flex items-center gap-1 cursor-pointer ">
          <BiSend /> share
        </button>
      </div>

      {commentsVisible && <Comments comments={comments} addComment={addComment} />}
    </div>
  )
}
