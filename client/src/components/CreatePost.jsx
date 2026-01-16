import { useState } from "react";
import { uploadMedia } from "../utils/uploadMedia";
import { CiImageOn } from "react-icons/ci";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import { ImageIcon } from "lucide-react";

export default function CreatePost({ addPost }) {
    const [content, setContent] = useState("");
    const [postMedia, setPostMedia] = useState([]); // { id, url?, type?, uploading }
    const { user } = useAuthContext();
    const [errorMsg, setErrorMsg] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(""); // reset previous error

        const readyMedia = postMedia
            .filter((m) => !m.uploading)
            .map((m) => ({ url: m.url, type: m.type }));

        try {
            await addPost({ content, media: readyMedia });
            setContent("");
            setPostMedia([]);
        } catch (err) {
            setErrorMsg(err.message); // show middleware error
        }
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
        <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200/50 p-6 mb-6">
            <div className="flex gap-4 mb-4">
                <img
                    src={user.profilePic}
                    className="rounded-full h-12 w-12 object-cover flex-shrink-0"
                />
                <textarea
                    rows="2"
                    className="flex-1 bg-slate-50 rounded-t-2xl px-4 py-3 outline-none border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all placeholder-slate-400 resize-none"
                    placeholder="Share what's on your mind..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                    <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                        {errorMsg}
                    </div>
                )}

                {postMedia.length > 0 && (
                    <div className="flex gap-2">
                        {postMedia.map((item) => (
                            <div key={item.id} className="relative h-24 w-24">
                                {item.type === "video" ? (
                                    item.url ? (
                                        <video
                                            src={item.url}
                                            className="h-24 w-24 object-cover rounded-lg"
                                            controls
                                        />
                                    ) : (
                                        <div className="h-24 w-24 bg-slate-100 rounded-lg flex items-center justify-center">
                                            Uploading...
                                        </div>
                                    )
                                ) : item.url ? (
                                    <img
                                        src={item.url}
                                        className="h-24 w-24 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="h-24 w-24 bg-slate-100 rounded-lg flex items-center justify-center">
                                        Uploading...
                                    </div>
                                )}

                                {item.uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                        <div className="animate-spin border-2 border-t-transparent border-white rounded-full w-6 h-6" />
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeMedia(item.id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:shadow-md transition"
                                    title="Remove media"
                                >
                                    <FaTimes className="text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-100">
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
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <ImageIcon size={18} />
                            <span className="text-2md md:text-3md lg:text-4md">Image</span>
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
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <FaRegPlayCircle size={18} />
                            <span className="text-2md md:text-3md lg:text-4md">Video</span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="ml-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-200 transition-all font-medium disabled:opacity-50"
                    >
                        {isUploading ? "Uploading..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
