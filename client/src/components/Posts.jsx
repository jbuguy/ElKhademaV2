import Post from "../components/Post.jsx"

export default function Posts({ posts }) {

  return <>
    {posts.map((post) => <Post key={post._id} post={post} />)}
  </>
}
