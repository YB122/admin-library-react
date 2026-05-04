import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { User } from "../../contexts/UserContext";
import { initFlowbite } from "flowbite";

export default function Users() {
  const { userToken, userRole } = useContext(User);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    initFlowbite();

    const style = document.createElement("style");
    style.textContent = `
      .dark-modal { background: #1f2937 !important; border: 1px solid #374151 !important; }
      .dark-title { color: #ffffff !important; }
      .dark-content { color: #d1d5db !important; }
      .dark-actions { background: #111827 !important; border-top: 1px solid #374151 !important; }
      .dark-confirm-button { background: #dc2626 !important; color: #ffffff !important; border: none !important; }
      .dark-confirm-button:hover { background: #b91c1c !important; }
      .dark-cancel-button { background: #6b7280 !important; color: #ffffff !important; border: none !important; }
      .dark-cancel-button:hover { background: #4b5563 !important; }
    `;
    document.head.appendChild(style);

    fetchUsers();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll('[id^="dropdown-"]');
      dropdowns.forEach((dropdown) => {
        if (!dropdown.parentElement.contains(event.target)) {
          dropdown.classList.add("hidden");
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/users", {
        headers: {
          Authorization: `${userRole} ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      const usersData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId) => {
    try {
      const result = await showSwal({
        title: "Are you sure?",
        text: "Do you want to ban this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, ban user!",
      });

      if (result.isConfirmed) {
        await axios.put(
          `/api/users/ban-user/${userId}`,
          {},
          {
            headers: {
              Authorization: `${userRole} ${userToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        await showSwal({
          title: "Banned!",
          text: "User has been banned.",
          icon: "success",
        });
        fetchUsers();
      }
    } catch (err) {
      await showSwal({
        title: "Error!",
        text: "Failed to ban user.",
        icon: "error",
      });
    }
  };

  const unbanUser = async (userId) => {
    try {
      const result = await showSwal({
        title: "Are you sure?",
        text: "Do you want to unban this user?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, unban user!",
      });

      if (result.isConfirmed) {
        await axios.put(
          `/api/users/unban-user/${userId}`,
          {},
          {
            headers: {
              Authorization: `${userRole} ${userToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        await showSwal({
          title: "Unbanned!",
          text: "User has been unbanned.",
          icon: "success",
        });
        fetchUsers();
      }
    } catch (err) {
      await showSwal({
        title: "Error!",
        text: "Failed to unban user.",
        icon: "error",
      });
    }
  };

  const showSwal = async (options) => {
    const isDark = document.documentElement.classList.contains("dark");
    const defaultConfig = {
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#111827",
      customClass: {
        popup: isDark ? "dark-modal" : "",
        title: isDark ? "dark-title" : "",
        content: isDark ? "dark-content" : "",
        actions: isDark ? "dark-actions" : "",
        ...(options.showCancelButton && {
          confirmButton: isDark ? "dark-confirm-button" : "",
          cancelButton: isDark ? "dark-cancel-button" : "",
        }),
      },
    };
    return await Swal.fire({ ...defaultConfig, ...options });
  };

  const toggleDropdown = (id) => {
    const el = document.getElementById(`dropdown-${id}`);
    if (el) el.classList.toggle("hidden");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage users, view their books and transactions
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users
              .filter((u) => u.role !== "admin")
              .map((user) => (
                <div
                  key={user._id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                >
                  <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-2 rounded-t-2xl"></div>

                  <div className="p-6">
                    {/* User Section */}
                    <div className="flex items-center mb-6">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800">
                        <span className="text-white font-bold text-xl">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {user.name || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1.5 text-xs font-bold rounded-full text-white ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {user.isActive ? "Active" : "Banned"}
                        </span>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(user._id)}
                          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg shadow hover:shadow-lg transition-all"
                        >
                          Actions
                        </button>

                        <div
                          id={`dropdown-${user._id}`}
                          className="hidden absolute bottom-full mb-2 left-0 w-full bg-white dark:bg-gray-700 rounded-xl shadow-2xl border dark:border-gray-600 z-[60] overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setExpandedUser(
                                expandedUser === user._id ? null : user._id,
                              );
                              toggleDropdown(user._id);
                            }}
                            className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition"
                          >
                            {expandedUser === user._id
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                          <button
                            onClick={() => {
                              user.isActive
                                ? banUser(user._id)
                                : unbanUser(user._id);
                              toggleDropdown(user._id);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition ${user.isActive ? "text-red-500" : "text-green-500"} hover:bg-gray-100 dark:hover:bg-gray-600 border-t dark:border-gray-600`}
                          >
                            {user.isActive ? "Ban User" : "Unban User"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded User Details */}
                    {expandedUser === user._id && (
                      <div className="mt-4 pt-4 border-t dark:border-gray-700 text-sm dark:text-gray-300">
                        <p>
                          <strong>Member Since:</strong>{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Total Books:</strong>{" "}
                          {user.books?.length || 0}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
