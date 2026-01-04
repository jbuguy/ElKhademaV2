import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { IoMdSend, IoMdSearch } from "react-icons/io";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";

export default function MessagesPage() {
  const { user } = useAuthContext();
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    api
      .get("/conversation", {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setConversations(res.data);
        // If conversationId from URL exists, find and set it as active
        if (conversationId) {
          const foundConv = res.data.find((conv) => conv._id === conversationId);
          if (foundConv) {
            setActiveChat(foundConv);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user, conversationId]);

  useEffect(() => {
    if (!activeChat?._id || !user) return;
    api
      .get(`conversation/${activeChat._id}`, {
        headers: { authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setMessages(res.data.messages);
      })
      .catch((err) => console.error(err));
  }, [activeChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !message.trim() || !activeChat) return;
    try {
      const res = await api.post(
        `conversation/${activeChat._id}/messages`,
        { content: message },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages((prev) => [...prev, { ...res.data, userId: { _id: user._id } }]);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getContactInfo = (conversation) => {
    const otherMembers = conversation.members.filter(
      (member) => member._id !== user._id
    );
    return {
      displayName: otherMembers.map((m) => m.username).join(", "),
      displayPic:
        otherMembers.length === 1 ? otherMembers[0].profilePic : "",
    };
  };

  const filteredConversations = conversations.filter((conv) => {
    const { displayName } = getContactInfo(conv);
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-300 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <IoMdSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {conversations.length === 0
                ? "No conversations yet"
                : "No results found"}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const { displayName, displayPic } = getContactInfo(conv);
              const lastMessage =
                conv.messages && conv.messages.length > 0
                  ? conv.messages[conv.messages.length - 1]
                  : null;
              const isActive = activeChat?._id === conv._id;

              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveChat(conv)}
                  className={`p-3 border-b border-gray-100 cursor-pointer transition ${isActive
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex gap-3 items-start">
                    <img
                      src={displayPic}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-500 text-gray-900 truncate">
                        {displayName}
                      </p>
                      {lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.userId._id === user._id ? "You: " : ""}
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white">
        {activeChat ? (
          <>
            <div className="border-b border-gray-300 p-4 bg-white flex items-center gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={getContactInfo(activeChat).displayPic}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h2 className="text-xl font-semibold">
                  {getContactInfo(activeChat).displayName}
                </h2>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 bg-white flex flex-col gap-3">
              {messages.map((m, index) => {
                const isMine = m.userId._id === user._id;
                return (
                  <div
                    key={index}
                    className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"
                      }`}
                  >
                    {!isMine && (
                      <img
                        src={m.userId.profilePic}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${isMine
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                    >
                      <p className="break-words">{m.content}</p>
                      <span
                        className={`text-xs mt-1 block ${isMine ? "text-blue-100" : "text-gray-600"
                          }`}
                      >
                        {formatTime(m.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-300 p-4 bg-white">
              <div className="flex gap-2">
                <textarea
                  className="flex-grow border border-gray-300 rounded-full px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-24"
                  placeholder="Aa"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows="1"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-2 flex-shrink-0 transition"
                >
                  <IoMdSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
