import Post from "../components/Post.jsx";

export default function Posts({ posts }) {
    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
}
