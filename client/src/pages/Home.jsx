import { useEffect, useState } from "react";
import { Contacts } from "../components/Contacts";
import Posts from "../components/Posts.jsx";
import CreatePost from "../components/CreatePost.jsx";
import { useAuthContext } from "../hooks/useAuthContext.js";
import api from "../utils/api.js";

export default function Home() {
    const [posts, setPosts] = useState(null);
    const [conversations, setConversations] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        api.get("/post", {
            headers: {
                authorization: `Bearer ${user.token}`,
            },
        }).then((res) => setPosts(res.data));

        api.get("/conversation", {
            headers: {
                authorization: `Bearer ${user.token}`,
            },
        }).then((res) => setConversations(res.data));
    }, [user]);

    const addPost = async (post) => {
        const res = await api.post(
            "/post",
            { content: post.content, media: post.media },
            {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
            }
        );
        setPosts((prev) => [res.data, ...prev]);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <main className="lg:col-span-2 space-y-6">
                    {/* Feed Header (prevents emptiness) */}
                    <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Home Feed
                        </h2>
                        <p className="text-sm text-slate-500">
                            See what’s happening today
                        </p>
                    </div>

                    <CreatePost addPost={addPost} />

                    {posts && posts.length > 0 ? (
                        <Posts posts={posts} />
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200/50 p-6 text-center text-slate-500">
                            No posts yet
                        </div>
                    )}
                </main>

                {/* Right Sidebar - Contacts */}
                <aside className="hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">
                                Contacts
                            </h2>
                            <a
                                href="/messages"
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                See all
                            </a>
                        </div>

                        {conversations && conversations.length > 0 ? (
                            <Contacts conversations={conversations} />
                        ) : (
                            <div className="text-sm text-slate-500">
                                No conversations yet
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
