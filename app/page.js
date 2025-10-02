"use client";
import Todo from "@/Component/Todo";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const tasksRef = React.useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);

  // Fetch Todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api");
      setTodoData(response.data.todos);
    } catch (error) {
      toast.error("Error fetching todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Form input change
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  // Submit new todo
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api", formData);
      toast.success(response.data.msg);
      setFormData({ title: "", description: "" });
      await fetchTodos();

      // Scroll to tasks section
      tasksRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      toast.error("Error adding todo");
    }
  };

  const completedCount = todoData.filter((item) => item.isCompleted).length;
  const pendingCount = todoData.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <ToastContainer autoClose={1500} theme="light" position="top-right" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {todoData.length}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {completedCount}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {pendingCount}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Todo Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-2">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            Add New Task
          </h2>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title
              </label>
              <input
                onChange={onChangeHandler}
                value={formData.title}
                type="text"
                name="title"
                placeholder="Enter your task title"
                className="px-4 py-3 border-2 w-full border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                required
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                onChange={onChangeHandler}
                value={formData.description}
                name="description"
                placeholder="Describe your task in detail"
                className="px-4 py-3 border-2 w-full border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors min-h-[100px] resize-none"
                required
                suppressHydrationWarning
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              suppressHydrationWarning
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Task
            </button>
          </form>
        </div>

        {/* Todos List */}
        <div
          ref={tasksRef}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-2">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </span>
            Your Tasks
          </h2>

          {todoData.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No tasks yet
              </h3>
              <p className="text-gray-400">
                Add your first task to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {todoData
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <Todo
                          key={item._id}
                          fetchTodos={fetchTodos}
                          title={item.title}
                          description={item.description}
                          id={index}
                          complete={item.isCompleted}
                          mongoId={item._id}
                          createdAt={item.createdAt}
                          updatedAt={item.updatedAt}
                          view="desktop"
                        />
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden flex flex-col gap-4">
                {todoData
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <Todo
                      key={item._id}
                      fetchTodos={fetchTodos}
                      title={item.title}
                      description={item.description}
                      id={index}
                      complete={item.isCompleted}
                      mongoId={item._id}
                      createdAt={item.createdAt}
                      updatedAt={item.updatedAt}
                      view="mobile"
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
