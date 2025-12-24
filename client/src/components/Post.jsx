import { format } from "date-fns";
import { useState } from "react";
import { BiCommentDetail, BiSend } from "react-icons/bi";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";

export default function Post({ post }) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const toggleLiked = () => {
    setIsLiked(prev => !prev);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  }
  return (<div>
    <div>
      <img width={25} />
      <div>
        <span>{post.user.username}</span>
        <span>{format(new Date(post.createdAt))}</span>
      </div>
      <div>{post.content}</div>
      <div>
        <button onClick={toggleLiked}>
          {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          {likes}
        </button>
        <BiCommentDetail onClick={() => { setCommentsVisible(prev => !prev) }} />
        <BiSend />
      </div>
    </div>
    {commentsVisible && <div>
      test
    </div>}
  </div>)
}
