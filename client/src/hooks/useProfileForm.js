import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import api from "../utils/api";
import { uploadMedia } from "../utils/uploadMedia";

export function useProfileForm({ username: initialUsername } = {}) {
    const { user: currentUser } = useAuthContext();
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [videoCvFile, setVideoCvFile] = useState(null);
    const [videoCvPreview, setVideoCvPreview] = useState(null);
    const [removeVideo, setRemoveVideo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        initialUsername ??
        currentUser?.username ??
        currentUser?.email?.split("@")[0];

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const profileRes = await api.get(`/user/profile/${username}`);
                const p = profileRes.data.profile || {};
                setUser(profileRes.data.user);
                setProfile(p);

                setFormData((fd) => ({
                    ...fd,
                    firstName: p.firstName || "",
                    lastName: p.lastName || "",
                    companyName: p.companyName || "",
                    description: p.description || "",
                    birthday: p.birthday
                        ? new Date(p.birthday).toISOString().split("T")[0]
                        : "",
                    location: p.location || "",
                    phoneNumber: p.phoneNumber || "",
                    email: p.email || "",
                    gender: p.gender || "",
                    skills: p.skills || [],
                    pastJobs: p.pastJobs || [],
                    education: p.education || [],
                    foundedDate: p.foundedDate
                        ? new Date(p.foundedDate).toISOString().split("T")[0]
                        : "",
                    founderName: p.founderName || "",
                    companyDescription: p.companyDescription || "",
                    industry: p.industry || "",
                    companySize: p.companySize || "",
                    website: p.website || "",
                }));

                // preload previews
                if (p?.videoCv) setVideoCvPreview(p.videoCv);
                if (p?.profilePic && !profileImage)
                    setProfileImagePreview(p.profilePic);
            } catch (err) {
                console.error(
                    "Error fetching profile:",
                    err?.response?.data || err
                );
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, profileImage]);

    useEffect(() => {
        if (!profileImage) {
            setProfileImagePreview(null);
            return;
        }
        const url =
            typeof profileImage === "string"
                ? profileImage
                : URL.createObjectURL(profileImage);
        setProfileImagePreview(url);
        return () => {
            if (typeof profileImage !== "string") URL.revokeObjectURL(url);
        };
    }, [profileImage]);

    useEffect(() => {
        if (!videoCvFile) return;
        const url =
            typeof videoCvFile === "string"
                ? videoCvFile
                : URL.createObjectURL(videoCvFile);
        setVideoCvPreview(url);
        return () => {
            if (typeof videoCvFile !== "string") URL.revokeObjectURL(url);
        };
    }, [videoCvFile]);

    const handleSubmit = async (e, { onSuccess } = {}) => {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        setError(null);
        try {
            let updatedFormData = { ...formData };

            if (profileImage) {
                const uploadResult = await uploadMedia(profileImage, "image");
                updatedFormData.profilePic = uploadResult?.secure_url;
            }

            if (removeVideo) {
                updatedFormData.videoCv = null;
            } else if (videoCvFile) {
                const uploadResult = await uploadMedia(videoCvFile, "post");
                updatedFormData.videoCv = uploadResult?.secure_url;
            }

            const res = await api.put("/user/profile", updatedFormData, {
                headers: { authorization: `Bearer ${currentUser.token}` },
            });

            // allow caller to act on the result
            if (typeof onSuccess === "function") onSuccess(res.data);

            return res.data;
        } catch (err) {
            console.error(
                "Error updating profile:",
                err?.response?.data || err
            );
            setError(
                err.response?.data?.error ||
                    "Failed to update profile. Please try again."
            );
            throw err;
        }
    };

    const handleAddSkill = () =>
        setFormData({ ...formData, skills: [...formData.skills, ""] });
    const handleSkillChange = (index, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData({ ...formData, skills: newSkills });
    };
    const handleRemoveSkill = (index) =>
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, i) => i !== index),
        });

    const handleAddJob = () =>
        setFormData({
            ...formData,
            pastJobs: [
                ...formData.pastJobs,
                {
                    title: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                },
            ],
        });

    const handleJobChange = (index, field, value) => {
        const newJobs = [...formData.pastJobs];
        newJobs[index][field] = value;
        setFormData({ ...formData, pastJobs: newJobs });
    };

    const handleRemoveJob = (index) =>
        setFormData({
            ...formData,
            pastJobs: formData.pastJobs.filter((_, i) => i !== index),
        });

    const handleAddEducation = () =>
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                {
                    institution: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                },
            ],
        });

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...formData.education];
        newEducation[index][field] = value;
        setFormData({ ...formData, education: newEducation });
    };

    const handleRemoveEducation = (index) =>
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index),
        });

    return {
        profile,
        user,
        formData,
        setFormData,
        profileImage,
        setProfileImage,
        profileImagePreview,
        videoCvFile,
        setVideoCvFile,
        videoCvPreview,
        removeVideo,
        setRemoveVideo,
        loading,
        error,
        handleSubmit,
        handleAddSkill,
        handleSkillChange,
        handleRemoveSkill,
        handleAddJob,
        handleJobChange,
        handleRemoveJob,
        handleAddEducation,
        handleEducationChange,
        handleRemoveEducation,
        setProfile,
        setUser,
    };
}

export default useProfileForm;
