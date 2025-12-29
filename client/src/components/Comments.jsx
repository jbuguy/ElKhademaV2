
import Comment from "../components/Comment.jsx"
import CreateComment from "../components/CreateComment.jsx"
export default function Comments({ comments, addComment }) {

  return <>
    <CreateComment addComment={addComment} />
    {comments.map((comment) => <Comment key={comment._id} comment={comment} />)}
  </>
}
