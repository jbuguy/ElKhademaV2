export default function Post({ post }) {
  return (<div>
    <div>
      <img width={25} />
      <div>
        <span>{post.user.username}</span>
        <span>{post.createdAt}</span>
      </div>
      <div>{post.content}</div>
    </div>
  </div>)
}
