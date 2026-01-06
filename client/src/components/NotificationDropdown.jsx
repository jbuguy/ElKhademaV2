import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { FaBell, FaHeart, FaComment, FaShare } from "react-icons/fa";
import api from "../utils/api";

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const response = await api.get("/notifications/unread-count");
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    // Mark notification as read and navigate to post
    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read) {
                await api.put(`/notifications/${notification._id}/read`);
                await fetchUnreadCount();
                await fetchNotifications();
            }
            setIsOpen(false);
            const postId = notification.post?._id || notification.post;
            navigate(`/post/${postId}`);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Mark all as read
    const handleMarkAllRead = async () => {
        try {
            await api.put("/notifications/mark-all-read");
            await fetchUnreadCount();
            await fetchNotifications();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    // Toggle dropdown
    const handleToggle = () => {
        setIsOpen(!isOpen);
        setShowAll(false);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    // Get visible notifications (show all unread first, then read notifications after clicking "See More")
    const getVisibleNotifications = () => {
        const unreadNotifications = notifications.filter((n) => !n.read);
        const readNotifications = notifications.filter((n) => n.read);

        if (showAll) {
            // Show all notifications when expanded
            return [...unreadNotifications, ...readNotifications];
        } else {
            // Show all unread notifications initially (no limit on unread)
            return unreadNotifications;
        }
    };

    const visibleNotifications = getVisibleNotifications();
    // Show "See More" button if there are any read notifications and not showing all
    const hasMoreNotifications =
        !showAll && notifications.filter((n) => n.read).length > 0;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch unread count on mount and every 30 seconds
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Get notification message and icon
    const getNotificationContent = (notification) => {
        const senderName = notification.sender?.displayName || "Someone";
        let icon, message, color;

        switch (notification.type) {
            case "like":
                icon = <FaHeart className="text-red-500" />;
                message = `${senderName} liked your post`;
                color = "bg-red-50";
                break;
            case "comment":
                icon = <FaComment className="text-blue-500" />;
                message = `${senderName} commented on your post`;
                color = "bg-blue-50";
                break;
            case "share":
                icon = <FaShare className="text-primary-600" />;
                message = `${senderName} shared your post`;
                color = "bg-primary-50";
                break;
            default:
                icon = <FaBell className="text-gray-500" />;
                message = "New notification";
                color = "bg-gray-50";
        }

        return { icon, message, color };
    };

    // Format time ago
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={handleToggle}
                className="relative border-0 bg-transparent p-0 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-[380px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[70vh] flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-emerald-600 shrink-0">
                        <h3 className="text-xl font-bold text-white">
                            Notifications
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium text-lg">
                                    No notifications yet
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    We'll notify you when something happens
                                </p>
                            </div>
                        ) : (
                            <>
                                {visibleNotifications.map((notification) => {
                                    const { icon, message, color } =
                                        getNotificationContent(notification);
                                    return (
                                        <div
                                            key={notification._id}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 flex items-start ${
                                                !notification.read
                                                    ? "bg-primary-50 border-l-4 border-l-primary-600"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-start gap-3 w-full">
                                                <div
                                                    className={`shrink-0 w-12 h-12 ${color} rounded-full flex items-center justify-center text-lg shadow-sm`}
                                                >
                                                    {icon}
                                                </div>
                                                <div className="w-[280px] flex flex-col gap-1">
                                                    <p
                                                        className={`text-sm break-words ${
                                                            !notification.read
                                                                ? "font-semibold text-gray-900"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {message}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">
                                                            {timeAgo(
                                                                notification.createdAt
                                                            )}
                                                        </span>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-50 shrink-0">
                            {!showAll && hasMoreNotifications && (
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="flex-1 py-2.5 px-4 text-sm font-semibold text-primary-600 hover:bg-white border-2 border-primary-600 rounded-lg transition-all duration-200 whitespace-nowrap"
                                >
                                    See More
                                </button>
                            )}
                            {showAll && (
                                <button
                                    onClick={() => setShowAll(false)}
                                    className="flex-1 py-2.5 px-4 text-sm font-semibold text-primary-600 hover:bg-white border-2 border-primary-600 rounded-lg transition-all duration-200 whitespace-nowrap"
                                >
                                    See Less
                                </button>
                            )}
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200 shadow-sm whitespace-nowrap"
                                >
                                    Mark All Read
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
