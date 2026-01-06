import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import longPoller from "../utils/longPoller.js";

export const getConversation = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const conversation = await Conversation.findById(id)
        .populate("members", "username profilePic")
        .populate("lastMessage", "userId content media");
    if (!conversation)
        return res.status(404).json({ error: "conversation not found" });
    const isMember = conversation.members.some(
        (member) => member._id.toString() === userId
    );
    if (!isMember)
        return res.status(404).json({ error: "conversation not found" });
    const messages = await Message.find({ conversationId: conversation._id })
        .populate("userId", "profilePic")
        .sort({ createdAt: 1 });
    res.status(200).json({ conversation, messages });
};
export const getAllConversations = async (req, res) => {
    const userId = req.user.id;
    const conversations = await Conversation.find({
        members: { $in: [userId] },
    })
        .populate("members", "username profilePic")
        .populate("lastMessage", "userId content media")
        .sort({ updatedAt: -1 })
        .lean();
    res.status(200).json(conversations);
};
export const sendMessage = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { content, media } = req.body;
    const conversation = await Conversation.findById(id);
    const isMember = conversation.members.some(
        (member) => member.toString() === userId
    );
    if (!isMember) {
        return res.status(403).json({ error: "Access denied" });
    }
    let message = await Message.create({
        userId,
        content,
        media,
        conversationId: id,
    });
    message = await message.populate("userId", "username profilePic");
    conversation.lastMessage = message._id;
    await conversation.save();

    // Notify long-poll waiters for this conversation so they can re-query and get the new messages
    try {
        longPoller.notifyNewMessage(id);
    } catch (err) {
        console.error("Error notifying long-poll waiters:", err);
    }

    res.status(201).json(message);
};
export const editMessage = async (req, res) => {
    const userId = req.user.id;
    const { id, slug } = req.params;
    const { content, media } = req.body;

    const message = await Message.findOneAndUpdate(
        { _id: slug, conversationId: id, userId },
        { content, media },
        { new: true }
    ).lean();
    res.status(200).json(message);
};
export const createConversation = async (req, res) => {
    const userId = req.user.id;
    const { members } = req.body;
    const uniqueMembers = [...new Set([...members, userId])];
    const conversation = await Conversation.create({ members: uniqueMembers });
    res.status(201).json(conversation);
};

// Long-polling endpoint: client supplies ?lastMessageId=<id> (optional). Server waits up to 25s for new messages then returns any new messages.
export const pollMessages = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params; // conversation id
    const { lastMessageId } = req.query;

    const conversation = await Conversation.findById(id).populate(
        "members",
        "_id"
    );
    if (!conversation)
        return res.status(404).json({ error: "conversation not found" });
    const isMember = conversation.members.some(
        (member) => member._id.toString() === userId
    );
    if (!isMember) return res.status(403).json({ error: "access denied" });

    let lastCreatedAt = new Date(0);
    if (lastMessageId) {
        const lastMessage = await Message.findById(lastMessageId).lean();
        if (lastMessage) lastCreatedAt = lastMessage.createdAt || lastCreatedAt;
    }

    // immediate check for new messages
    let messages = await Message.find({
        conversationId: id,
        createdAt: { $gt: lastCreatedAt },
    })
        .populate("userId", "profilePic username")
        .sort({ createdAt: 1 });

    if (messages.length > 0) {
        return res.status(200).json(messages);
    }

    // nothing new yet -> wait up to 25s
    try {
        await longPoller.waitForNewMessages(id, 25000);
    } catch (err) {
        // ignore
    }

    // one final check before returning
    messages = await Message.find({
        conversationId: id,
        createdAt: { $gt: lastCreatedAt },
    })
        .populate("userId", "profilePic username")
        .sort({ createdAt: 1 });

    return res.status(200).json(messages);
};
