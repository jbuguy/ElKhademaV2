import { useEffect, useState } from "react";
import { Contacts } from "../components/Contacts";
import { getMockPosts } from "../services/postService";
import Posts from "../components/Posts.jsx"
import CreatePost from "../components/CreatePost.jsx";

export default function Home() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    getMockPosts().then(d => setPosts(d));
  }, []);
  return (
    <div className="home">
      <div className="max-w-xl min-w-xl mx-auto">
        <CreatePost />
        {posts && <Posts posts={posts} />}
      </div>
      <Contacts />
    </div>
  )
}
