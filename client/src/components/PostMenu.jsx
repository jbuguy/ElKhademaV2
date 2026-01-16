import { useState, useRef, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";

export default function PostMenu({ isOwner, onDelete, onReport }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="p-2 rounded-full hover:bg-slate-100 transition"
            >
                <BiDotsHorizontalRounded size={22} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                    {isOwner && (
                        <button
                            onClick={() => {
                                setOpen(false);
                                onDelete();
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setOpen(false);
                            onReport();
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                        Report
                    </button>
                </div>
            )}
        </div>
    );
}
