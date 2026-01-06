import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../utils/api";
import Post from "../components/Post";

const PostView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/post/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Post not found");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-xl font-bold text-primary-600">
                    Loading post...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="text-xl font-bold text-red-500 mb-4">
                    {error}
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-primary-600 hover:underline"
            >
                ← Back
            </button>
            {post && <Post post={post} />}
        </div>
    );
};

export default PostView;
