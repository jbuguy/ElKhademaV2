import { useEffect, useState, useRef } from "react";
import { Send, Minus, X } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";

export default function ChatWidget() {
    const { isOpen, activeChat, closeChat } = useChat();
    const [minimized, setMinimized] = useState(false);
    const [message, setMessage] = useState("");
    const { user } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!activeChat?._id || !user) return;

        api.get(`conversation/${activeChat._id}`, {
            headers: { authorization: `Bearer ${user.token}` },
        }).then((res) => setMessages(res.data.messages));
    }, [activeChat, user]);

    const sendMessage = async () => {
        if (!message.trim() || isSending || !user) return;

        const content = message.trim();
        setIsSending(true);

        try {
            const res = await api.post(
                `conversation/${activeChat._id}/messages`,
                { content },
                {
                    headers: { authorization: `Bearer ${user.token}` },
                }
            );

            setMessages((prev) => [...prev, res.data]);
            setMessage("");
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[520px] z-50">
            <div className="flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/70">
                    <div className="flex items-center gap-3">
                        <img
                            src={activeChat?.displayPic}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-900 text-sm">
                            {activeChat?.displayName}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setMinimized((p) => !p)}
                            className="p-1.5 rounded-full hover:bg-slate-100"
                        >
                            <Minus size={16} />
                        </button>
                        <button
                            onClick={closeChat}
                            className="p-1.5 rounded-full hover:bg-slate-100"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {!minimized && (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
                            {messages.map((m, index) => {
                                const isMine = m.userId._id === user._id;

                                return (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                                isMine
                                                    ? "bg-emerald-600 text-white rounded-br-md"
                                                    : "bg-white text-slate-900 rounded-bl-md border border-slate-200"
                                            }`}
                                        >
                                            {m.content}
                                            <div className="text-[10px] mt-1 opacity-70 text-right">
                                                {new Date(
                                                    m.createdAt
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-slate-200 bg-white">
                            <div className="flex items-end gap-2">
                                <textarea
                                    rows={1}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message…"
                                    className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />

                                <button
                                    onClick={sendMessage}
                                    disabled={!message.trim() || isSending}
                                    className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 transition"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
