import { Notification } from "../models/notification.model.js";
import { Profile } from "../models/profile.model.js";

// Helper function to get display name
const getDisplayName = (profile) => {
  if (!profile) return "";
  if (profile.profileType === 'company') {
    return profile.companyName || "";
  }
  const firstName = profile.firstName || "";
  const lastName = profile.lastName || "";
  return `${firstName} ${lastName}`.trim() || "";
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username profilePic")
      .populate("post", "content")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Get display names for all senders
    const senderIds = notifications.map(n => n.sender._id);
    const profiles = await Profile.find({ userId: { $in: senderIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = getDisplayName(p);
    });

    // Add display names to notifications
    const notificationsWithNames = notifications.map(notification => ({
      ...notification,
      sender: {
        ...notification.sender,
        displayName: profileMap[notification.sender._id.toString()] || notification.sender.username
      }
    }));

    res.status(200).json(notificationsWithNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Notification.countDocuments({ 
      recipient: userId, 
      read: false 
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (recipientId, senderId, type, postId) => {
  try {
    // Don't create notification if user is interacting with their own post
    if (recipientId.toString() === senderId.toString()) {
      console.log('Skipping notification - user interacting with own post');
      return null;
    }

    console.log('Creating notification:', { recipientId, senderId, type, postId });
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId
    });

    console.log('Notification created successfully:', notification._id);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
