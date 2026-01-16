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
    if (!user) return;

    api.get("/post", {
      headers: { authorization: `Bearer ${user.token}` },
    }).then((res) => setPosts(res.data));

    api.get("/conversation", {
      headers: { authorization: `Bearer ${user.token}` },
    }).then((res) => setConversations(res.data));
  }, [user]);

  const addPost = async (post) => {
      try {
          const res = await api.post(
              "/post",
              { content: post.content, media: post.media },
              { headers: { authorization: `Bearer ${user.token}` } }
          );
          setPosts((prev) => [res.data, ...prev]);
          return res.data;
      } catch (err) {
          // extract error message from middleware
          throw new Error(err.response?.data?.error || "Failed to create post");
      }
  };


  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full max-w-400 mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8">
        
        {/* 1. Left Sidebar - User Profile */}
        <aside className="hidden md:block md:col-span-1 lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200/60 overflow-hidden sticky top-8">
            <div className="h-24 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>

            <div className="px-6 pb-8">
              <div className="relative -mt-12 mb-4">
                <img
                  src={user?.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-24 h-24 rounded-3xl border-[6px] border-white object-cover shadow-md"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {user?.username || "User Name"}
                </h2>
                <p className="text-base text-slate-500">{user?.email}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between text-center">
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {posts?.length || 0}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Posts
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">0</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Followers
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">0</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Following
                  </p>
                </div>
              </div>

              <button className="w-full mt-8 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl transition-all hover:shadow-md border border-slate-200">
                My Profile
              </button>
            </div>
          </div>
        </aside>

        {/* 2. Center Column - Main Feed */}
        <main className="col-span-1 md:col-span-3 lg:col-span-6 ">
          <div className="bg-white rounded-t-3xl border border-slate-200/60 shadow-sm p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Home Feed</h2>
              <p className="text-slate-500">See what's happening today</p>
            </div>
          </div>

          <CreatePost addPost={addPost} />

          {posts && posts.length > 0 ? (
            <Posts posts={posts} />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-10 text-center">
               <p className="text-lg text-slate-500 font-medium">No posts yet</p>
            </div>
          )}
        </main>

        {/* 3. Right Sidebar - Contacts */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Contacts</h2>
              <a
                href="/messages"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-bold"
              >
                See all
              </a>
            </div>

            {conversations && conversations.length > 0 ? (
              <Contacts conversations={conversations} />
            ) : (
              <div className="py-8 text-center text-slate-500">
                No conversations yet
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}