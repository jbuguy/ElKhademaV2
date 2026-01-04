import { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { useChat } from "../hooks/useChat";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";

export default function ChatWidget() {
    const { isOpen, activeChat, closeChat } = useChat();
    const [min, setMinimized] = useState(false);
    const [message, setMessage] = useState("");
    const { user } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (isSending) return;
        if (!user || !message.trim()) return;

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
            setMessage((prev) => (prev.trim() === content ? "" : prev));
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeChat?._id || !user) return;
            try {
                const res = await api.get(`conversation/${activeChat._id}`, {
                    headers: { authorization: `Bearer ${user.token}` },
                });
                setMessages(res.data.messages);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();
    }, [activeChat, user]);

    // Helper to format timestamp
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-0 right-4 w-80 max-h-96 shadow-xl flex flex-col z-50 rounded-t bg-gray-200">
            <div className="flex justify-between bg-green-700 p-2 text-white">
                <div className="flex gap-2 items-center">
                    <img
                        src={activeChat?.displayPic}
                        alt=""
                        className="rounded-full h-8"
                    />
                    <span>{activeChat?.displayName}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setMinimized((prev) => !prev);
                        }}
                    >
                        -
                    </button>
                    <button onClick={() => closeChat()}>x</button>
                </div>
            </div>

            {!min && (
                <>
                    {/* Messages */}
                    <div className="flex-grow h-80 overflow-y-auto p-2 bg-gray-100 flex flex-col gap-2">
                        {messages.map((m, index) => {
                            const isMine = m.userId._id === user._id;
                            console.log(m.userId);
                            return (
                                <div
                                    key={index}
                                    className={`flex items-end ${
                                        isMine ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    {!isMine && (
                                        <img
                                            src={m.userId.profilePic}
                                            alt=""
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                    )}
                                    <div
                                        className={`max-w-[70%] p-2 rounded-lg flex items-end gap-2 ${
                                            isMine
                                                ? "bg-green-200 text-right rounded-br-none"
                                                : "bg-white text-left rounded-bl-none"
                                        }`}
                                    >
                                        <span>{m.content}</span>
                                        <span className="text-xs text-gray-500">
                                            {formatTime(m.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <hr />

                    <div className="border-t border-gray-300 p-4 bg-white">
                        <div className="flex gap-2">
                            <textarea
                                className="flex-grow border border-gray-300 rounded-full px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-24"
                                placeholder="Aa"
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
                                className="bg-green-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-2 flex-shrink-0 transition"
                            >
                                <IoMdSend size={20} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
