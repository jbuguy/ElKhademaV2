import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router";
import { IoMdSend, IoMdSearch } from "react-icons/io";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";

export default function MessagesPage() {
    const { user } = useAuthContext();
    const { conversationId } = useParams();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Handle starting a new chat from state
    useEffect(() => {
        if (!user || !location.state?.startChatWith) return;

        const startNewChat = async () => {
            try {
                const targetUser = location.state.startChatWith;
                
                // Create or get existing conversation
                const response = await api.post("/conversation", {
                    members: [targetUser._id]
                }, {
                    headers: {
                        authorization: `Bearer ${user.token}`,
                    },
                });

                // Refresh conversations and set active chat
                const convsResponse = await api.get("/conversation", {
                    headers: {
                        authorization: `Bearer ${user.token}`,
                    },
                });
                
                setConversations(convsResponse.data);
                const newConv = convsResponse.data.find(c => c._id === response.data._id);
                if (newConv) {
                    setActiveChat(newConv);
                }
                setLoading(false);
                
                // Clear the state
                window.history.replaceState({}, document.title);
            } catch (error) {
                console.error("Error starting new chat:", error);
                setLoading(false);
            }
        };

        startNewChat();
    }, [user, location.state]);

    useEffect(() => {
        if (!user || location.state?.startChatWith) return; // Skip if handling startChatWith
        
        api.get("/conversation", {
            headers: {
                authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => {
                setConversations(res.data);
                if (conversationId) {
                    const foundConv = res.data.find(
                        (conv) => conv._id === conversationId
                    );
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
    }, [user, conversationId, location.state]);

    useEffect(() => {
        if (!activeChat?._id || !user) return;
        api.get(`conversation/${activeChat._id}`, {
            headers: { authorization: `Bearer ${user.token}` },
        })
            .then((res) => {
                setMessages(res.data.messages);
            })
            .catch((err) => console.error(err));
    }, [activeChat, user]);

    // keep a ref to messages for the poll loop
    const messagesRef = useRef(messages);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Long-polling: ask server for new messages after the last one we have.
    useEffect(() => {
        if (!activeChat?._id || !user) return;
        let cancelled = false;

        const pollOnce = async () => {
            if (cancelled) return;
            try {
                const lastMessageId =
                    messagesRef.current && messagesRef.current.length > 0
                        ? messagesRef.current[messagesRef.current.length - 1]
                              ._id
                        : undefined;
                const res = await api.get(
                    `conversation/${activeChat._id}/messages/poll`,
                    {
                        params: { lastMessageId },
                        headers: { authorization: `Bearer ${user.token}` },
                        timeout: 35000, // ensure client waits a bit longer than server timeout
                    }
                );

                const newMsgs = res.data || [];
                if (newMsgs.length > 0) {
                    setMessages((prev) => {
                        const ids = new Set(prev.map((m) => m._id));
                        const filtered = newMsgs.filter((m) => !ids.has(m._id));
                        return filtered.length ? [...prev, ...filtered] : prev;
                    });
                }
            } catch (err) {
                console.error("Polling error:", err.message || err);
                // short backoff on error
                await new Promise((r) => setTimeout(r, 2000));
            } finally {
                // loop again unless cancelled
                if (!cancelled) setTimeout(pollOnce, 50); // slight delay to avoid tight loop
            }
        };

        pollOnce();

        return () => {
            cancelled = true;
        };
    }, [activeChat?._id, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        // Prevent duplicate sends while a request is in-flight
        if (isSending) return;
        if (!user || !message.trim() || !activeChat) return;

        const content = message.trim();
        setIsSending(true);

        try {
            const res = await api.post(
                `conversation/${activeChat._id}/messages`,
                { content },
                {
                    headers: {
                        authorization: `Bearer ${user.token}`,
                    },
                }
            );

            setMessages((prev) => [
                ...prev,
                { ...res.data, userId: { _id: user._id } },
            ]);

            // Only clear input if the message hasn't changed while sending
            setMessage((prev) => (prev.trim() === content ? "" : prev));
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
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
        <div className="h-screen flex bg-slate-50">
            {/* Sidebar - Conversations List */}
            <div className="w-96 border-r border-slate-200 flex flex-col bg-white shadow-sm">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                    <h1 className="text-3xl font-bold mb-4 text-slate-900">
                        Messages
                    </h1>
                    <div className="relative">
                        <IoMdSearch className="absolute left-4 top-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                    </div>
                </div>

                <div className="grow overflow-y-auto space-y-1 p-3">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            <p className="text-sm">Loading conversations...</p>
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <p className="text-sm">
                                {conversations.length === 0
                                    ? "No conversations yet"
                                    : "No results found"}
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const { displayName, displayPic } =
                                getContactInfo(conv);
                            const lastMessage =
                                conv.messages && conv.messages.length > 0
                                    ? conv.messages[conv.messages.length - 1]
                                    : null;
                            const isActive = activeChat?._id === conv._id;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => setActiveChat(conv)}
                                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                                        isActive
                                            ? "bg-emerald-50 border border-emerald-200 shadow-sm"
                                            : "hover:bg-slate-50 border border-transparent"
                                    }`}
                                >
                                    <div className="flex gap-3 items-start">
                                        <img
                                            src={displayPic}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-slate-200"
                                        />
                                        <div className="grow min-w-0">
                                            <p className="font-semibold text-slate-900 truncate">
                                                {displayName}
                                            </p>
                                            {lastMessage && (
                                                <p className="text-sm text-slate-500 truncate">
                                                    {lastMessage.userId._id ===
                                                    user._id
                                                        ? "You: "
                                                        : ""}
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

            <div className="grow flex flex-col bg-slate-50">
                {activeChat ? (
                    <>
                        <div className="border-b border-slate-200 p-6 bg-white flex items-center gap-4 shadow-sm">
                            <img
                                src={getContactInfo(activeChat).displayPic}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200"
                            />
                            <h2 className="text-xl font-bold text-slate-900">
                                {getContactInfo(activeChat).displayName}
                            </h2>
                        </div>

                        <div className="grow overflow-y-auto p-6 flex flex-col gap-4">
                            {messages.map((m, index) => {
                                const isMine = m.userId._id === user._id;
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-end gap-2 ${
                                            isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        {!isMine && (
                                            <img
                                                src={m.userId.profilePic}
                                                alt=""
                                                className="w-6 h-6 rounded-full object-cover shrink-0"
                                            />
                                        )}
                                        <div
                                            className={`max-w-xs px-4 py-2.5 rounded-2xl ${
                                                isMine
                                                    ? "bg-emerald-600 text-white rounded-br-md shadow-md"
                                                    : "bg-white text-slate-900 rounded-bl-md border border-slate-200 shadow-sm"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <p className="wrap-break-word text-sm">
                                                    {m.content}
                                                </p>
                                                <button
                                                    className="text-xs text-red-500 hover:text-red-700 opacity-0 hover:opacity-100 transition-opacity"
                                                    onClick={async () => {
                                                        if (!user)
                                                            return alert(
                                                                "Please login to report"
                                                            );
                                                        const reason = prompt(
                                                            "Reason for reporting this message (required):"
                                                        );
                                                        if (!reason) return;
                                                        try {
                                                            await api.post(
                                                                "/reports",
                                                                {
                                                                    type: "message",
                                                                    targetId:
                                                                        m._id,
                                                                    reason,
                                                                    description:
                                                                        "",
                                                                }
                                                            );
                                                            alert(
                                                                "Report submitted"
                                                            );
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert(
                                                                err.response
                                                                    ?.data
                                                                    ?.error ||
                                                                    err.message
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Report
                                                </button>
                                            </div>
                                            <span
                                                className={`text-xs mt-1.5 block ${
                                                    isMine
                                                        ? "text-emerald-100"
                                                        : "text-slate-500"
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

                        <div className="border-t border-slate-200 p-6 bg-white shadow-lg">
                            <div className="flex gap-3">
                                <textarea
                                    className="grow resize-none max-h-24 rounded-2xl px-5 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (isSending) return;
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    rows="1"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!message.trim() || isSending}
                                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md"
                                >
                                    <IoMdSend size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="grow flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IoMdSearch
                                    size={40}
                                    className="text-slate-400"
                                />
                            </div>
                            <p className="text-lg font-semibold text-slate-900 mb-2">
                                Select a conversation
                            </p>
                            <p className="text-sm text-slate-500">
                                Choose a conversation from the list to start
                                messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
