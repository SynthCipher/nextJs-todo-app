import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'


const Todo = ({ id, title, description, mongoId, complete, fetchTodos, view, createdAt, updatedAt }) => {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDoneConfirm, setShowDoneConfirm] = useState(false);

    const deleteTaskHandler = async (mongoId) => {
        try {
            const response = await axios.delete("/api", { data: { id: mongoId } });
            toast.success(response.data.msg)
            fetchTodos();
            setShowDeleteConfirm(false);
        } catch (error) {
            toast.error("Error deleting task")
        }
    }


    const completeTaskHandler = async (mongoId) => {
        try {
            const response = await axios.patch("/api", { id: mongoId });
            toast.success(response.data.msg);
            fetchTodos();
            setShowDoneConfirm(false);
        } catch (error) {
            toast.error("Error completing task");
        }
    };


    // Format timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';


        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);


        // If less than 1 minute
        if (diffMins < 1) return 'Just now';
        // If less than 1 hour
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        // If less than 24 hours
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        // If less than 7 days
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;


        // Otherwise show full date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };


    // Get full date and time for tooltip
    const getFullDateTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };


    // Function to convert URLs in text to clickable links
    const linkifyText = (text) => {
        if (!text) return null;


        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[^\s]+)/g;


        const parts = text.split(urlRegex).filter(Boolean);


        return parts.map((part, index) => {
            // Check if the part is a URL
            if (part && (part.match(/^https?:\/\//) || part.match(/^www\./) || part.match(/\.[a-z]{2,}/i))) {
                // Add https:// if not present
                const href = part.startsWith('http') ? part : `https://${part}`;
                return (
                    <a
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-medium hover:no-underline transition-colors break-all inline-block"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    // Confirmation Modal Component
    const ConfirmModal = ({ show, onClose, onConfirm, title, message, type }) => {
        if (!show) return null;

        return (
            // <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center z-50 p-4">

            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        {type === 'delete' ? (
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition-all hover:shadow-md ${type === 'delete'
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                }`}
                        >
                            {type === 'delete' ? 'Delete' : 'Mark as Done'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    // Desktop Table Row
    if (view === "desktop") {
        return (
            <>
                <tr className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                            {id + 1}
                        </span>
                    </td>
                    <td className={`px-6 py-4 font-semibold ${complete ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {title}
                    </td>
                    <td className={`px-6 py-4 ${complete ? "line-through text-gray-400" : "text-gray-600"} break-words max-w-md`}>
                        <div className="whitespace-pre-wrap break-words">
                            {linkifyText(description)}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            {/* <span className="text-xs text-gray-500 font-medium mb-1">Created:</span> */}
                            <span className="text-sm font-medium text-gray-700" title={getFullDateTime(createdAt)}>
                                {formatDate(createdAt)}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(createdAt).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        {complete ? (
                            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-sm'>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Completed
                            </span>
                        ) : (
                            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-sm'>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pending
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                            {/* Show completion date if task is complete */}
                            {complete && updatedAt && (
                                <div className="flex flex-col mb-2 p-2 bg-green-50 rounded-md border border-green-200">
                                    <span className="text-xs text-green-600 font-semibold mb-1">Completed:</span>
                                    <span className="text-sm font-medium text-gray-700" title={getFullDateTime(updatedAt)}>
                                        {formatDate(updatedAt)},&nbsp;
                                        <span className="text-xs text-gray-500">
                                            {new Date(updatedAt).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </span>
                                    </span>


                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-md hover:scale-105 transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>

                                {!complete && (
                                    <button
                                        onClick={() => setShowDoneConfirm(true)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-md hover:scale-105 transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Done
                                    </button>
                                )}
                            </div>
                        </div>
                    </td>

                </tr>

                <ConfirmModal
                    show={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={() => deleteTaskHandler(mongoId)}
                    title="Delete Task?"
                    message="Are you sure you want to delete this task? This action cannot be undone."
                    type="delete"
                />

                <ConfirmModal
                    show={showDoneConfirm}
                    onClose={() => setShowDoneConfirm(false)}
                    onConfirm={() => completeTaskHandler(mongoId)}
                    title="Complete Task?"
                    message="Are you sure you want to mark this task as complete?"
                    type="done"
                />
            </>
        )
    }


    // Mobile Card
    return (
        <>
            <div className={`rounded-xl p-5 shadow-md border-2 transition-all duration-200 ${complete
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                : 'bg-white border-purple-200 hover:shadow-lg'
                }`}>
                <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                        {id + 1}
                    </span>
                    {complete ? (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold'>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                        </span>
                    ) : (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold'>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                        </span>
                    )}
                </div>


                <h3 className={`text-lg font-bold mb-2 break-words ${complete ? "line-through text-gray-500" : "text-gray-800"}`}>
                    {title}
                </h3>
                <div className={`text-sm mb-3 break-words whitespace-pre-wrap ${complete ? "line-through text-gray-400" : "text-gray-600"}`}>
                    {linkifyText(description)}
                </div>


                {/* Timestamp for mobile */}
                <div className="flex flex-col ">
                    <div className="flex flex-col mb-2 p-2  rounded-md border border-gray-200">

                        <div className="flex items-center gap-1.5 text-xs text-gray-500" title={getFullDateTime(createdAt)}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                Created {formatDate(createdAt)} at {new Date(createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </span>
                        </div>
                    </div>
                    {complete && updatedAt && (


                        <div className="flex flex-col mb-2 p-2 bg-green-50 rounded-md border border-green-200">
                            <div className="flex items-center gap-1.5 text-xs text-green-600" title={getFullDateTime(updatedAt)}>

                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                    Completed {formatDate(updatedAt)} at {new Date(updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>


                <div className="flex gap-2">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className='flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-sm flex items-center justify-center gap-1.5'
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                    {!complete && (
                        <button
                            onClick={() => setShowDoneConfirm(true)}
                            className='flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-sm flex items-center justify-center gap-1.5'
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Done
                        </button>
                    )}
                </div>
            </div>

            <ConfirmModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => deleteTaskHandler(mongoId)}
                title="Delete Task?"
                message="Are you sure you want to delete this task? This action cannot be undone."
                type="delete"
            />

            <ConfirmModal
                show={showDoneConfirm}
                onClose={() => setShowDoneConfirm(false)}
                onConfirm={() => completeTaskHandler(mongoId)}
                title="Complete Task?"
                message="Are you sure you want to mark this task as complete?"
                type="done"
            />
        </>
    )
}


export default Todo;