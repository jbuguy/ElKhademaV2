import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { Post } from "../models/post.model.js";
import { generateToken } from "../utils/jwt.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "invalid email" });
    const token = generateToken(user);
    console.log(user);
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(404).json({ error: "invalid credentials" });
    res.status(200).json({ token, email: user.email, username: user.username, profilePic: user.profilePic, _id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist)
      return res.status(404).json({ error: "email must be unique" });
    const profilePic = "https://i.pravatar.cc/150?img=1";
    const user = await User.create({ email, password, username: email, profilePic });
    const token = generateToken(user);
    res.status(200).json({ token, email: user.email, username: user.username, profilePic: user.profilePic, _id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = await Profile.create({ userId: user._id });
    }

    res.status(200).json({ user, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfilePosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = req.user?.id;
    const posts = await Post.find({ userId: user._id })
      .populate("userId", "username profilePic")
      .populate({
        path: "sharedFrom",
        populate: { path: "userId", select: "username profilePic" }
      })
      .sort({ createdAt: -1 })
      .lean();

    // Get all profiles for display names
    const userIds = [user._id];
    const sharedUserIds = posts
      .filter(p => p.sharedFrom && p.sharedFrom.userId)
      .map(p => p.sharedFrom.userId._id);
    const allUserIds = [...new Set([...userIds, ...sharedUserIds])];

    const profiles = await Profile.find({ userId: { $in: allUserIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = p.displayName || "";
    });

    const postsWithLikes = posts.map(post => {
      const postData = {
        ...post,
        userId: {
          ...post.userId,
          displayName: profileMap[post.userId._id.toString()] || ""
        },
        liked: userId ? post.likes?.some(id => id.toString() === userId.toString()) || false : false,
        totalLikes: post.likes?.length || 0,
      };

      // Add display name to sharedFrom user if exists
      if (post.sharedFrom && post.sharedFrom.userId) {
        postData.sharedFrom = {
          ...post.sharedFrom,
          userId: {
            ...post.sharedFrom.userId,
            displayName: profileMap[post.sharedFrom.userId._id.toString()] || ""
          }
        };
      }

      return postData;
    });

    res.status(200).json(postsWithLikes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { displayName, description, pastJobs, education, skills, location, phoneNumber, birthday, profilePic } = req.body;

    console.log("Received profilePic:", profilePic);

    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (description !== undefined) updateData.description = description;
    if (pastJobs !== undefined) updateData.pastJobs = pastJobs;
    if (education !== undefined) updateData.education = education;
    if (skills !== undefined) updateData.skills = skills;
    if (location !== undefined) updateData.location = location;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (birthday !== undefined) updateData.birthday = birthday;
    if (profilePic !== undefined) updateData.profilePic = profilePic;

    console.log("UpdateData:", updateData);

    // Update profile picture in User model if provided
    if (profilePic !== undefined) {
      console.log("Updating User profilePic for userId:", userId);
      const userUpdate = await User.findByIdAndUpdate(userId, { profilePic }, { new: true });
      console.log("User updated:", userUpdate);
    }

    console.log("Updating Profile for userId:", userId);
    let profile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );
    console.log("Profile updated:", profile);

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
