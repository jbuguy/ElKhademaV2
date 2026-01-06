import { useAuthContext } from "../hooks/useAuthContext";
import { useChat } from "../hooks/useChat";

export default function Contact({ contact }) {
    const { user } = useAuthContext();
    const { openChat } = useChat();

    const members = contact.members.filter((member) => user._id != member._id);
    const partner = members[0] || { username: "Unknown", profilePic: "" };

    return (
        <div
            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            onClick={() =>
                openChat({
                    _id: contact._id,
                    displayName: partner.username,
                    displayPic: partner.profilePic,
                })
            }
        >
            <img
                src={partner.profilePic}
                alt=""
                className="rounded-full h-10 w-10 object-cover"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {partner.username}
                    </div>
                    <div className="text-xs text-gray-400">
                        {contact.unreadCount ? (
                            <span className="text-xs text-white bg-primary-600 px-2 py-0.5 rounded-full">
                                {contact.unreadCount}
                            </span>
                        ) : null}
                    </div>
                </div>
                {contact.lastMessage && (
                    <div className="text-xs text-gray-500 truncate">
                        {contact.lastMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
