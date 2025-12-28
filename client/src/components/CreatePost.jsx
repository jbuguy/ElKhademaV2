import { useState } from "react";
import { uploadMedia } from "../utils/uploadMedia";

export default function CreatePost({ addPost }) {
  const [content, setContent] = useState("");
  const [postMedia, setPostMedia] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    addPost({ content, media: postMedia });
    setContent("");
    setPostMedia([]);
  };
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => handlePostMedia(file));
  }
  const handlePostMedia = async (file) => {
    const data = await uploadMedia(file, "post");
    setPostMedia(prev => [...prev, { url: data.secure_url, type: data.resource_type }]);
  };
  return <div className="bg-white p-4 m-2 flex gap-4">
    <img src="https://i.pravatar.cc/150?img=1" className="rounded-full h-10" />
    <form onSubmit={handleSubmit} className="flex flex-col justify-end gap-2 w-full">
      <textarea
        rows="2"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder="Start a post"
        value={content}
        onChange={e => setContent(e.target.value)}
      ></textarea>
      {postMedia.length > 0 && (
        <div className="flex gap-2 mt-2">
          {postMedia.map((item, index) => (
            <img key={index} src={item.url} className="h-20 w-20 object-cover rounded" />
          ))}
        </div>
      )}
      <div className="flex justify-around">
        <input type="file" onChange={handleMediaChange} />
        <button type="submit" className="grow-0">post</button>
      </div>
    </form>
  </div>
}
