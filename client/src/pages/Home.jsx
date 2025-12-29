import { useEffect, useState } from "react";
import { Contacts } from "../components/Contacts";
import Posts from "../components/Posts.jsx"
import CreatePost from "../components/CreatePost.jsx";
import { useAuthContext } from "../hooks/useAuthContext.js";
import api from "../utils/api.js";

export default function Home() {
  const [posts, setPosts] = useState(null);
  const { user } = useAuthContext();
  useEffect(() => {
    api.get("/post", {
      headers: {
        authorization: `Bearer ${user.token}`
      }
    }).then(res => setPosts(res.data));
  }, []);
  const addPost = async (post) => {
    const res = await api.post('/post', { content: post.content, media: post.media }, {
      headers: {
        authorization: `Bearer ${user.token}`
      }
    });
    setPosts(prev => [res.data, ...prev]);
  }
  return (
    <div className="home">
      <div className="max-w-xl min-w-xl mx-auto">
        <CreatePost addPost={addPost} />
        {posts && <Posts posts={posts} />}
      </div>
      <Contacts />
    </div>
  )
} 
