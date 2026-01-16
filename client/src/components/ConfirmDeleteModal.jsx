
export default function ConfirmDeleteModal({ open, onClose, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Delete post
                </h3>
                <p className="text-slate-600 mb-6">
                    Are you sure you want to delete this post? This action
                    cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
