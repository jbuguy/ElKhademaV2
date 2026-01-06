export default function ProfileTabs({ activeTab, setActiveTab, isEditing }) {
    if (isEditing) return null;
    return (
        <div className="flex gap-4 border-b pb-2">
            <button
                className={`px-4 py-2 -mb-1 ${
                    activeTab === "posts"
                        ? "border-b-2 border-primary-600 text-primary-600 font-semibold"
                        : "text-gray-600"
                }`}
                onClick={() => setActiveTab("posts")}
            >
                Posts
            </button>

            <button
                className={`px-4 py-2 -mb-1 ${
                    activeTab === "about"
                        ? "border-b-2 border-primary-600 text-primary-600 font-semibold"
                        : "text-gray-600"
                }`}
                onClick={() => setActiveTab("about")}
            >
                About Me
            </button>
        </div>
    );
}
