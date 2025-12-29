import { useState } from "react";
import { uploadMedia } from "../utils/uploadMedia";
import { CiImageOn } from "react-icons/ci";
import { FaRegPlayCircle } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

export default function CreatePost({ addPost }) {
  const [content, setContent] = useState("");
  const [postMedia, setPostMedia] = useState([]);
  const { user } = useAuthContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    addPost({ content, media: postMedia });
    setContent("");
    setPostMedia([]);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => handlePostMedia(file));
  };

  const handlePostMedia = async (file) => {
    const data = await uploadMedia(file, "post");
    setPostMedia(prev => [...prev, { url: data.secure_url, type: data.resource_type }]);
  };

  return (
    <div className="bg-white p-4 m-2 flex gap-4">
      <img src={user.profilePic} className="rounded-full h-10" />
      <form onSubmit={handleSubmit} className="flex flex-col justify-end gap-2 w-full">
        <textarea
          rows="2"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Start a post"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        {postMedia.length > 0 && (
          <div className="flex gap-2 mt-2">
            {postMedia.map((item, index) => (
              item.type === "video" ? (
                <video key={index} src={item.url} className="h-20 w-20 object-cover rounded" controls />
              ) : (
                <img key={index} src={item.url} className="h-20 w-20 object-cover rounded" />
              )
            ))}
          </div>
        )}
        <div className="flex justify-around">
          <div className="relative inline-block">
            <input
              type="file"
              id="image-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleMediaChange}
              accept="image/*"
            />
            <label htmlFor="image-upload" className="text-green-500 hover:text-green-700 cursor-pointer">
              <CiImageOn /> Image
            </label>
          </div>
          <div className="relative inline-block">
            <input
              type="file"
              id="video-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleMediaChange}
              accept="video/*"
            />
            <label htmlFor="video-upload" className="text-green-500 hover:text-green-700 cursor-pointer">
              <FaRegPlayCircle size={20} /> Video
            </label>
          </div>
          <button type="submit" className="grow-0">Post</button>
        </div>
      </form>
    </div>
  );
}
