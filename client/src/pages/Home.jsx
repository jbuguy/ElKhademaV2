import { useEffect, useState } from "react";
import { Contacts } from "../components/Contacts";
import Posts from "../components/Posts.jsx";
import CreatePost from "../components/CreatePost.jsx";
import { useAuthContext } from "../hooks/useAuthContext.js";
import api from "../utils/api.js";
import {
    Home as HomeIcon,
    Briefcase,
    User,
    Settings,
    Search,
} from "lucide-react";

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

    const navItems = [
        { icon: HomeIcon, label: "Feed", href: "/" },
        { icon: Briefcase, label: "Jobs", href: "/jobs" },
        { icon: User, label: "Profile", href: "/profile" },
        { icon: Settings, label: "Settings", href: "#" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Navigation */}
                <aside className="hidden lg:block">
                    <nav className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 space-y-2 sticky top-24">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                                    item.label === "Feed"
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                        : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Main Feed */}
                <main className="lg:col-span-2 space-y-6">
                    <CreatePost addPost={addPost} />
                    {posts && <Posts posts={posts} />}
                </main>

                {/* Right Sidebar - Contacts */}
                <aside className="hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">
                                Contacts
                            </h2>
                            <a
                                href="#"
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
