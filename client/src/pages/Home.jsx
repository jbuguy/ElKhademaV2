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
        if (!user) return; // Prevent API calls if user isn't loaded

        api.get("/post", {
            headers: { authorization: `Bearer ${user.token}` },
        }).then((res) => setPosts(res.data));

        api.get("/conversation", {
            headers: { authorization: `Bearer ${user.token}` },
        }).then((res) => setConversations(res.data));
    }, [user]);

    const addPost = async (post) => {
        const res = await api.post(
            "/post",
            { content: post.content, media: post.media },
            { headers: { authorization: `Bearer ${user.token}` } }
        );
        setPosts((prev) => [res.data, ...prev]);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* 3-Column Grid Layout */}
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
                {/* 1. Left Sidebar - User Profile (Visible on md+) */}
                <aside className="hidden md:block md:col-span-1 lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden sticky top-8">
                        {/* Profile Header/Cover */}
                        <div className="h-20 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>

                        <div className="px-5 pb-6">
                            {/* Avatar */}
                            <div className="relative -mt-10 mb-3">
                                <img
                                    src={
                                        user?.profilePic ||
                                        "https://via.placeholder.com/150"
                                    }
                                    alt="Profile"
                                    className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-sm"
                                />
                            </div>

                            {/* User Info */}
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                    {user?.username || "User Name"}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between text-center">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {posts?.length || 0}
                                    </p>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                                        Posts
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        0
                                    </p>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                                        Followers
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        0
                                    </p>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                                        Following
                                    </p>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200">
                                My Profile
                            </button>
                        </div>
                    </div>
                </aside>

                {/* 2. Center Column - Main Feed */}
                <main className="col-span-1 md:col-span-3 lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Home Feed
                        </h2>
                        <p className="text-sm text-slate-500">
                            See what's happening today
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

                {/* 3. Right Sidebar - Contacts (Visible on lg+) */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 sticky top-8">
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
