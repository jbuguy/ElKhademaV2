import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";
import Posts from "../components/Posts";
import { uploadMedia } from "../utils/uploadMedia";
import { ImageUpload } from "../components/ImageUpload";

function Profile() {
  const { username: paramUsername } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Image upload state
  const [profileImage, setProfileImage] = useState(null); // File object
  const [imagePreview, setImagePreview] = useState(null); // For preview URL
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    description: "",
    birthday: "",
    location: "",
    phoneNumber: "",
    email: "",
    gender: "",
    skills: [],
    pastJobs: [],
    education: [],
    foundedDate: "",
    founderName: "",
    companyDescription: "",
    industry: "",
    companySize: "",
    website: "",
  });

  const username =
    paramUsername ||
    currentUser?.username ||
    currentUser?.email?.split("@")[0];

  const isOwner =
    currentUser?.username === username ||
    currentUser?.email?.split("@")[0] === username;

  // Cleanup object URL on unmount or when new image is selected
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get(`/user/profile/${username}`);
        setUser(profileRes.data.user);
        setProfile(profileRes.data.profile);

        const postsRes = await api.get(`/user/profile/${username}/posts`);
        setPosts(postsRes.data);

        if (isOwner) {
          setFormData({
            firstName: profileRes.data.profile.firstName || "",
            lastName: profileRes.data.profile.lastName || "",
            companyName: profileRes.data.profile.companyName || "",
            description: profileRes.data.profile.description || "",
            birthday: profileRes.data.profile.birthday
              ? new Date(profileRes.data.profile.birthday).toISOString().split("T")[0]
              : "",
            location: profileRes.data.profile.location || "",
            phoneNumber: profileRes.data.profile.phoneNumber || "",
            email: profileRes.data.profile.email || "",
            gender: profileRes.data.profile.gender || "",
            skills: profileRes.data.profile.skills || [],
            pastJobs: profileRes.data.profile.pastJobs || [],
            education: profileRes.data.profile.education || [],
            foundedDate: profileRes.data.profile.foundedDate
              ? new Date(profileRes.data.profile.foundedDate).toISOString().split("T")[0]
              : "",
            founderName: profileRes.data.profile.founderName || "",
            companyDescription: profileRes.data.profile.companyDescription || "",
            industry: profileRes.data.profile.industry || "",
            companySize: profileRes.data.profile.companySize || "",
            website: profileRes.data.profile.website || "",
          });

          // Auto-open edit if redirected
          if (location.state?.openEdit) {
            setIsEditing(true);
            setActiveTab("about");
            if (!profileRes.data.profile.isProfileComplete) {
              setNeedsProfileCompletion(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Profile not found");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
    else {
      setLoading(false);
      setError("No username provided");
    }
  }, [username, isOwner, location.state]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview URL
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let updatedFormData = { ...formData };

      // Upload new image if selected
      if (profileImage) {
        setIsUploadingImage(true);
        const uploadResult = await uploadMedia(profileImage, "image");
        updatedFormData.profilePic = uploadResult.secure_url;
      }

      const res = await api.put("/user/profile", updatedFormData, {
        headers: { authorization: `Bearer ${currentUser.token}` },
      });

      setProfile(res.data);
      if (updatedFormData.profilePic) {
        setUser({ ...user, profilePic: updatedFormData.profilePic });
        // Clean up preview after successful upload
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setProfileImage(null);
      }

      setNeedsProfileCompletion(false);
      setIsEditing(false);
      setIsUploadingImage(false);

      if (location.state?.openEdit) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile.");
      setIsUploadingImage(false);
    }
  };

  // Helper functions for skills, jobs, education (keep your existing ones)
  // ... (handleAddSkill, handleSkillChange, etc.)

  const handleGenerateCV = () => window.print();

  // Hide header if profile incomplete
  useEffect(() => {
    if (needsProfileCompletion) {
      document.querySelector("header")?.style.setProperty("display", "none");
    } else {
      document.querySelector("header")?.style.setProperty("display", "");
    }
    return () => {
      document.querySelector("header")?.style.setProperty("display", "");
    };
  }, [needsProfileCompletion]);

  if (loading) return <div>Loading profile...</div>;
  if (error && !profile) return <div>{error}</div>;

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={user?.profilePic || "https://via.placeholder.com/150"}
            alt={user?.username}
            className="profile-image"
          />
          <div className="profile-info">
            <h2>
              {profile?.companyName ||
                `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
                user?.username}
            </h2>
            <p className="username-tag">{user?.username}</p>
            {isOwner && !isEditing && (
              <div className="profile-actions">
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Edit Profile
                </button>
                {profile?.profileType !== "company" && (
                  <button onClick={handleGenerateCV} className="edit-btn">
                    Generate CV
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
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
        )}

        {isEditing && (
          <form onSubmit={handleSubmit} className="edit-form">
            {error && <div className="error">{error}</div>}

            {/* Image Upload with preview and loading state */}
            <ImageUpload
              label="Profile Image"
              preview={imagePreview || user?.profilePic || "https://via.placeholder.com/150"}
              isLoading={isUploadingImage}
              onChange={handleImageChange}
              buttonLabel="Choose New Image"
            />

            {/* Your other form fields go here */}
            {/* Example: */}
            {/* <input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} /> */}
            {/* ... rest of your form fields ... */}

            <div className="form-actions">
              <button type="submit" disabled={isUploadingImage}>
                {isUploadingImage ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setProfileImage(null);
                  if (imagePreview) URL.revokeObjectURL(imagePreview);
                  setImagePreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {!isEditing && activeTab === "posts" && (
          <div className="tab-content">
            <div className="profile-section posts-section">
              <h3>Posts</h3>
              {posts.length > 0 ? (
                <Posts posts={posts} setPosts={setPosts} />
              ) : (
                <p>No posts yet</p>
              )}
            </div>
          </div>
        )}

        {!isEditing && activeTab === "about" && (
          <div className="tab-content">
            {/* Your About section content */}
            <p>{profile?.description || "No description yet."}</p>
            {/* Add more about info here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
