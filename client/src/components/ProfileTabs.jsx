export default function ProfileTabs({ activeTab, setActiveTab, isEditing }) {
    if (isEditing) return null;
    return (
        <div className="profile-tabs">
            <button
                className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => setActiveTab("posts")}
            >
                Posts
            </button>
            <button
                className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
                onClick={() => setActiveTab("about")}
            >
                About Me
            </button>
        </div>
    );
}
