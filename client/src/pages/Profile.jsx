import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";
import Posts from "../components/Posts";
import { uploadMedia } from "../utils/uploadMedia";

function Profile() {
  const { username: paramUsername } = useParams();
  const { user: currentUser } = useAuthContext();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    displayName: "",
    description: "",
    birthday: "",
    location: "",
    phoneNumber: "",
    skills: [],
    pastJobs: [],
    education: [],
  });

  const username = paramUsername || currentUser?.username || currentUser?.email?.split('@')[0];
  const isOwner = currentUser?.username === username || currentUser?.email?.split('@')[0] === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log("Fetching profile for username:", username);
        const profileRes = await api.get(`/user/profile/${username}`);
        console.log("Profile response:", profileRes.data);
        setUser(profileRes.data.user);
        setProfile(profileRes.data.profile);
        
        const postsRes = await api.get(`/user/profile/${username}/posts`);
        console.log("Posts response:", postsRes.data);
        setPosts(postsRes.data);
        
        if (isOwner) {
          setFormData({
            displayName: profileRes.data.profile.displayName || "",
            description: profileRes.data.profile.description || "",
            birthday: profileRes.data.profile.birthday ? new Date(profileRes.data.profile.birthday).toISOString().split('T')[0] : "",
            location: profileRes.data.profile.location || "",
            phoneNumber: profileRes.data.profile.phoneNumber || "",
            skills: profileRes.data.profile.skills || [],
            pastJobs: profileRes.data.profile.pastJobs || [],
            education: profileRes.data.profile.education || [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        console.error("Error details:", error.response?.data);
        setError("Profile not found");
      } finally {
        setLoading(false);
      }
    };

    console.log("Username:", username, "CurrentUser:", currentUser);
    if (username) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("No username provided");
    }
  }, [username, isOwner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let updatedFormData = { ...formData };
      
      // Upload profile image if selected
      if (profileImage) {
        console.log("Uploading profile image...", profileImage);
        const uploadResult = await uploadMedia(profileImage, "image");
        console.log("Upload result:", uploadResult);
        updatedFormData.profilePic = uploadResult.secure_url;
        console.log("Updated formData with profilePic:", updatedFormData.profilePic);
      }
      
      console.log("Sending to backend:", updatedFormData);
      const res = await api.put("/user/profile", updatedFormData, {
        headers: { authorization: `Bearer ${currentUser.token}` }
      });
      console.log("Backend response:", res.data);
      setProfile(res.data);
      
      // Update user profile picture in local state
      if (updatedFormData.profilePic) {
        setUser({ ...user, profilePic: updatedFormData.profilePic });
      }
      
      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.error || "Failed to update profile. Please try again.");
    }
  };

  const handleAddSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const handleRemoveSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleAddJob = () => {
    setFormData({
      ...formData,
      pastJobs: [...formData.pastJobs, { title: "", company: "", startDate: "", endDate: "", current: false, description: "" }]
    });
  };

  const handleJobChange = (index, field, value) => {
    const newJobs = [...formData.pastJobs];
    newJobs[index][field] = value;
    setFormData({ ...formData, pastJobs: newJobs });
  };

  const handleRemoveJob = (index) => {
    const newJobs = formData.pastJobs.filter((_, i) => i !== index);
    setFormData({ ...formData, pastJobs: newJobs });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: "", degree: "", field: "", startDate: "", endDate: "", current: false }]
    });
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData({ ...formData, education: newEducation });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEducation });
  };

  const handleGenerateCV = () => {
    window.print();
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile || !user) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <img 
            src={user.profilePic || "https://via.placeholder.com/150"} 
            alt={user.username}
            className="profile-image"
          />
          <div className="profile-info">
            <h2>{profile.displayName || user.username}</h2>
            <p className="username-tag">@{user.username}</p>
            {isOwner && !isEditing && (
              <div className="profile-actions">
                <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                <button onClick={handleGenerateCV} className="edit-btn">Generate CV</button>
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button 
              className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About Me
            </button>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit} className="edit-form">
            {error && <div className="error">{error}</div>}
            
            <div className="form-group">
              <label>Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              {profileImage && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(profileImage)} alt="Preview" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }} />
                </div>
              )}
              {!profileImage && user.profilePic && (
                <div className="current-image">
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>Current image:</p>
                  <img src={user.profilePic} alt="Current" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '5px' }} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Display Name:</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Your display name"
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-group">
              <label>Birthday:</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+1234567890"
              />
            </div>

            <div className="form-section">
              <h3>Skills</h3>
              {formData.skills.map((skill, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="Enter skill"
                  />
                  <button type="button" onClick={() => handleRemoveSkill(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddSkill} className="add-btn">+ Add Skill</button>
            </div>

            <div className="form-section">
              <h3>Work Experience</h3>
              {formData.pastJobs.map((job, index) => (
                <div key={index} className="array-item-box">
                  <input
                    type="text"
                    value={job.title}
                    onChange={(e) => handleJobChange(index, 'title', e.target.value)}
                    placeholder="Job Title"
                    required
                  />
                  <input
                    type="text"
                    value={job.company}
                    onChange={(e) => handleJobChange(index, 'company', e.target.value)}
                    placeholder="Company"
                    required
                  />
                  <input
                    type="date"
                    value={job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleJobChange(index, 'startDate', e.target.value)}
                    placeholder="Start Date"
                    required
                  />
                  <input
                    type="date"
                    value={job.endDate ? new Date(job.endDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleJobChange(index, 'endDate', e.target.value)}
                    placeholder="End Date"
                    disabled={job.current}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={job.current}
                      onChange={(e) => handleJobChange(index, 'current', e.target.checked)}
                    />
                    Currently working here
                  </label>
                  <textarea
                    value={job.description}
                    onChange={(e) => handleJobChange(index, 'description', e.target.value)}
                    placeholder="Job Description"
                    rows="2"
                  />
                  <button type="button" onClick={() => handleRemoveJob(index)}>Remove Job</button>
                </div>
              ))}
              <button type="button" onClick={handleAddJob} className="add-btn">+ Add Work Experience</button>
            </div>

            <div className="form-section">
              <h3>Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="array-item-box">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    placeholder="Institution"
                    required
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    placeholder="Degree"
                    required
                  />
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                    placeholder="Field of Study"
                    required
                  />
                  <input
                    type="date"
                    value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                    placeholder="Start Date"
                    required
                  />
                  <input
                    type="date"
                    value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                    placeholder="End Date"
                    disabled={edu.current}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                    />
                    Currently studying here
                  </label>
                  <button type="button" onClick={() => handleRemoveEducation(index)}>Remove Education</button>
                </div>
              ))}
              <button type="button" onClick={handleAddEducation} className="add-btn">+ Add Education</button>
            </div>

            <div className="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        )}

        {!isEditing && activeTab === 'about' && (
          <div className="tab-content">
            <div className="profile-details">
              <div className="profile-section">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {user.email}</p>
                {profile.phoneNumber && <p><strong>Phone:</strong> {profile.phoneNumber}</p>}
                {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
                {profile.birthday && <p><strong>Birthday:</strong> {new Date(profile.birthday).toLocaleDateString()}</p>}
              </div>

              {profile.displayName && (
                <div className="profile-section">
                  <h3>Display Name</h3>
                  <p>{profile.displayName}</p>
                </div>
              )}

              {profile.description && (
                <div className="profile-section">
                  <h3>Description</h3>
                  <p>{profile.description}</p>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="profile-section">
                  <h3>Skills</h3>
                  <div className="skills-list">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile.pastJobs && profile.pastJobs.length > 0 && (
                <div className="profile-section">
                  <h3>Work Experience</h3>
                  {profile.pastJobs.map((job, index) => (
                    <div key={index} className="experience-item">
                      <h4>{job.title} at {job.company}</h4>
                      <p className="date-range">
                        {job.startDate && new Date(job.startDate).toLocaleDateString()} - {" "}
                        {job.current ? "Present" : job.endDate && new Date(job.endDate).toLocaleDateString()}
                      </p>
                      {job.description && <p>{job.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {profile.education && profile.education.length > 0 && (
                <div className="profile-section">
                  <h3>Education</h3>
                  {profile.education.map((edu, index) => (
                    <div key={index} className="experience-item">
                      <h4>{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                      <p className="institution">{edu.institution}</p>
                      <p className="date-range">
                        {edu.startDate && new Date(edu.startDate).toLocaleDateString()} - {" "}
                        {edu.current ? "Present" : edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!isEditing && activeTab === 'posts' && (
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
      </div>
    </div>
  );
}

export default Profile;
