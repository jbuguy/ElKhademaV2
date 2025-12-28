
import Comment from "../components/Comment.jsx"

export default function Comments({ comments }) {

  return <>
    {comments.map((comment) => <Comment key={comment._id} comment={comment} />)}
  </>
}
