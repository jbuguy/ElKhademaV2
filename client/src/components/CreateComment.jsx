import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { CiImageOn } from "react-icons/ci";
import { uploadMedia } from "../utils/uploadMedia";

export default function Comment({ addComment }) {
  const [content, setContent] = useState("");
  const [postMedia, setPostMedia] = useState([]);
  const { user } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment({ content, media: postMedia });
    setContent("");
    setPostMedia([]);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => handlePostMedia(file));
  };

  const handlePostMedia = async (file) => {
    const data = await uploadMedia(file, "post");
    setPostMedia(prev => [
      ...prev,
      { url: data.secure_url, type: data.resource_type }
    ]);
  };

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        <img
          src={user.profilePic}
          alt={`${user.userid} profile`}
          className="h-8 w-8 rounded-full"
        />

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col rounded-xl border border-2 border-gray-400"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full resize-none bg-transparent p-3 text-sm placeholder-gray-400 focus:outline-none"
            rows={1}
          />

          {postMedia.length > 0 && (
            <div className="flex gap-2 px-3 pb-2">
              {postMedia.map((item, index) =>
                item.type === "video" ? (
                  <video
                    key={index}
                    src={item.url}
                    className="h-20 w-20 rounded-lg object-cover"
                    controls
                  />
                ) : (
                  <img
                    key={index}
                    src={item.url}
                    className="h-20 w-20 rounded-lg object-cover"
                    alt=""
                  />
                )
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-gray-700 px-3 py-2">
            <div className="relative">
              <input
                type="file"
                id="image-upload"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleMediaChange}
                accept="image/*,video/*"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-xl text-green-500 hover:text-green-400"
              >
                <CiImageOn />
              </label>
            </div>

            {content.trim().length > 0 && (
              <button
                type="submit"
                className="rounded-full bg-green-500 px-4 py-1 text-sm font-medium text-black hover:bg-green-400"
              >
                Comment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
