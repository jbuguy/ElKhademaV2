import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";

export const getConversation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const conversation = await Conversation.findById(id).populate("members", "username profilePic").populate("lastMessage", "userId content media");
  if (!conversation)
    return res.status(404).json({ error: "conversation not found" });
  const isMember = conversation.members.some(
    member => member._id.toString() === userId
  );
  if (!isMember)
    return res.status(404).json({ error: "conversation not found" });
  const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
  res.status(200).json({ conversation, messages });
}
export const getAllConversations = async (req, res) => {
  const userId = req.user.id;
  const conversations = await Conversation.find({ members: { $in: [userId] } })
    .populate("members", "username profilePic")
    .populate("lastMessage", "userId content media")
    .sort({ updatedAt: -1 })
    .lean();
  res.status(200).json(conversations);
}
export const sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { content, media } = req.body;
  const conversation = await Conversation.findById(id);
  const isMember = conversation.members.some(
    member => member.toString() === userId
  );
  if (!isMember) {
    return res.status(403).json({ error: "Access denied" });
  }
  const message = await Message.create({ userId, content, media, conversationId: id }).lean();
  conversation.lastMessage = message._id;
  await conversation.save();
  res.status(201).json(message);
}
export const editMessage = async (req, res) => {
  const userId = req.user.id;
  const { id, slug } = req.params;
  const { content, media } = req.body;

  const message = await Message.findOneAndUpdate({ _id: slug, conversationId: id, userId }, { content, media }, { new: true }).lean();
  res.status(200).json(message);
}
export const createConversation = async (req, res) => {
  const userId = req.user.id;
  const { members } = req.body;
  const uniqueMembers = [...new Set([...members, userId])];
  const conversation = await Conversation.create({ members: uniqueMembers }).populate("members", "username profilePic");
  res.status(201).json(conversation);
}
