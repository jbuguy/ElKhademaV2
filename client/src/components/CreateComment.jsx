import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { CiImageOn } from "react-icons/ci";
import { uploadMedia } from "../utils/uploadMedia";
import { Send } from "lucide-react";

export default function CreateComment({ addComment }) {
    const [content, setContent] = useState("");
    const [postMedia, setPostMedia] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        addComment({ content, media: postMedia });
        setContent("");
        setPostMedia([]);
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => handlePostMedia(file));
    };

    const handlePostMedia = async (file) => {
        setIsUploading(true);
        try {
            const data = await uploadMedia(file, "post");
            setPostMedia((prev) => [
                ...prev,
                { url: data.secure_url, type: data.resource_type },
            ]);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload media");
        } finally {
            setIsUploading(false);
        }
    };

    const removeMedia = (index) => {
        setPostMedia((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="rounded-xl bg-slate-50 border border-slate-200/50 p-4">
            <div className="flex gap-3">
                <img
                    src={user?.profilePic}
                    alt={`${user?.username} profile`}
                    className="h-10 w-10 rounded-full object-cover border border-emerald-200 flex-shrink-0"
                />

                <form onSubmit={handleSubmit} className="flex-1 space-y-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full resize-none bg-white rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                        rows={2}
                    />

                    {postMedia.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {postMedia.map((item, index) =>
                                item.type === "video" ? (
                                    <div
                                        key={index}
                                        className="relative h-20 w-20"
                                    >
                                        <video
                                            src={item.url}
                                            className="h-20 w-20 rounded-lg object-cover"
                                            controls
                                        />
                                        <button
                                            onClick={() => removeMedia(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        key={index}
                                        className="relative h-20 w-20"
                                    >
                                        <img
                                            src={item.url}
                                            className="h-20 w-20 rounded-lg object-cover"
                                            alt=""
                                        />
                                        <button
                                            onClick={() => removeMedia(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="relative">
                            <input
                                type="file"
                                id="image-upload"
                                className="absolute inset-0 cursor-pointer opacity-0"
                                onChange={handleMediaChange}
                                accept="image/*,video/*"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`cursor-pointer text-lg transition-colors ${
                                    isUploading
                                        ? "text-slate-300"
                                        : "text-slate-600 hover:text-emerald-600"
                                }`}
                            >
                                <CiImageOn />
                            </label>
                        </div>

                        {content.trim().length > 0 && (
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all disabled:opacity-50"
                            >
                                <Send size={14} />
                                Comment
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
