import { useState } from "react";
import { uploadMedia } from "../utils/uploadMedia";
import { CiImageOn } from "react-icons/ci";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

export default function CreatePost({ addPost }) {
    const [content, setContent] = useState("");
    const [postMedia, setPostMedia] = useState([]); // { id, url?, type?, uploading }
    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        // filter out uploading items
        const readyMedia = postMedia
            .filter((m) => !m.uploading)
            .map((m) => ({ url: m.url, type: m.type }));
        addPost({ content, media: readyMedia });
        setContent("");
        setPostMedia([]);
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => handlePostMedia(file));
        e.target.value = null;
    };

    const handlePostMedia = async (file) => {
        const id =
            Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        const initialType = file.type.startsWith("video") ? "video" : "image";
        // add placeholder
        setPostMedia((prev) => [
            ...prev,
            { id, uploading: true, type: initialType },
        ]);

        try {
            const data = await uploadMedia(file, "post");
            // only update if still exists (user might have removed it)
            setPostMedia((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              url: data.secure_url,
                              type: data.resource_type,
                              uploading: false,
                          }
                        : item
                )
            );
        } catch (err) {
            console.error("Upload failed:", err);
            // remove failed upload placeholder and optionally show error
            setPostMedia((prev) => prev.filter((item) => item.id !== id));
            alert("Failed to upload media. Please try again.");
        }
    };

    const removeMedia = (id) => {
        setPostMedia((prev) => prev.filter((m) => m.id !== id));
    };

    const isUploading = postMedia.some((m) => m.uploading);

    return (
        <div className="bg-white p-4 m-2 flex gap-4">
            <img src={user.profilePic} className="rounded-full h-10" />
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-end gap-2 w-full"
            >
                <textarea
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Start a post"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {postMedia.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {postMedia.map((item) => (
                            <div key={item.id} className="relative h-20 w-20">
                                {item.type === "video" ? (
                                    item.url ? (
                                        <video
                                            src={item.url}
                                            className="h-20 w-20 object-cover rounded"
                                            controls
                                        />
                                    ) : (
                                        <div className="h-20 w-20 bg-gray-100 rounded flex items-center justify-center">
                                            Uploading...
                                        </div>
                                    )
                                ) : item.url ? (
                                    <img
                                        src={item.url}
                                        className="h-20 w-20 object-cover rounded"
                                    />
                                ) : (
                                    <div className="h-20 w-20 bg-gray-100 rounded flex items-center justify-center">
                                        Uploading...
                                    </div>
                                )}

                                {/* spinner */}
                                {item.uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                                        <div className="animate-spin border-2 border-t-transparent border-white rounded-full w-6 h-6" />
                                    </div>
                                )}

                                {/* remove button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeMedia(item.id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                                    title="Remove media"
                                >
                                    <FaTimes className="text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-around items-center">
                    <div className="relative inline-block">
                        <input
                            type="file"
                            id="image-upload"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleMediaChange}
                            accept="image/*"
                        />
                        <label
                            htmlFor="image-upload"
                            className="text-green-500 hover:text-green-700 cursor-pointer"
                        >
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
                        <label
                            htmlFor="video-upload"
                            className="text-green-500 hover:text-green-700 cursor-pointer"
                        >
                            <FaRegPlayCircle size={20} /> Video
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="grow-0 px-4 py-2 bg-[#1aac83] text-white rounded"
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
