import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'

const Todo = ({ id, title, description, mongoId, complete, fetchTodos, view }) => {

    const deleteTaskHandler = async (mongoId) => {
        try {
            const response = await axios.delete("/api", { data: { id: mongoId } });
            toast.success(response.data.msg)
            fetchTodos();
        } catch (error) {
            toast.error("Error deleting task")
        }
    }

    const completeTaskHandler = async (mongoId) => {
        try {
            const response = await axios.patch("/api", { id: mongoId }); 
            toast.success(response.data.msg);
            fetchTodos();
        } catch (error) {
            toast.error("Error completing task");
        }
    };

    // Desktop Table Row
    if(view === "desktop") {
        return (
            <tr className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                        {id + 1}
                    </span>
                </td>
                <td className={`px-6 py-4 font-semibold ${complete ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {title}
                </td>
                <td className={`px-6 py-4 ${complete ? "line-through text-gray-400" : "text-gray-600"}`}>
                    {description}
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
                    <div className="flex gap-2">
                        <button 
                            onClick={() => deleteTaskHandler(mongoId)} 
                            className='px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-md hover:scale-105 transition-all duration-200 text-sm flex items-center gap-1.5'
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                        {!complete && (
                            <button 
                                onClick={() => completeTaskHandler(mongoId)} 
                                className='px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-md hover:scale-105 transition-all duration-200 text-sm flex items-center gap-1.5'
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Done
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        )
    }

    // Mobile Card
    return (
        <div className={`rounded-xl p-5 shadow-md border-2 transition-all duration-200 ${
            complete 
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
            
            <h3 className={`text-lg font-bold mb-2 ${complete ? "line-through text-gray-500" : "text-gray-800"}`}>
                {title}
            </h3>
            <p className={`text-sm mb-4 ${complete ? "line-through text-gray-400" : "text-gray-600"}`}>
                {description}
            </p>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => deleteTaskHandler(mongoId)} 
                    className='flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-sm flex items-center justify-center gap-1.5'
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </button>
                {!complete && (
                    <button 
                        onClick={() => completeTaskHandler(mongoId)} 
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
    )
}

export default Todo;