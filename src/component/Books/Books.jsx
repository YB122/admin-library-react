import React, { useEffect, useState, useContext } from "react";
import { initFlowbite } from "flowbite";
import axios from "axios";
import { User } from "../../contexts/UserContext";
import toast from "react-hot-toast";

export default function Books() {
  const { userRole, userToken } = useContext(User);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    availableCopies: 1,
    rating: 4,
    publishedYear: new Date().getFullYear(),
    urlImage: "",
  });

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/books", {
        headers: {
          Authorization: `${userRole} ${userToken}`,
        },
      });
      setBooks(response.data.data || response.data);
      setFilteredBooks(response.data.data || response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create book
  const createBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/books", formData, {
        headers: {
          Authorization: `${userRole} ${userToken}`,
        },
      });
      setShowCreateModal(false);
      resetForm();
      fetchBooks();
      toast.success(`Book "${formData.title}" created successfully!`);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to create book. Please try again.");
    }
  };

  // Update book
  const updateBook = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating book with data:", formData);
      const response = await axios.put(
        `http://localhost:3000/api/books/${editingBook._id}`,
        formData,
        {
          headers: {
            Authorization: `${userRole} ${userToken}`,
          },
        },
      );
      console.log("Update response:", response);
      setShowEditModal(false);
      setEditingBook(null);
      resetForm();
      fetchBooks();
      toast.success(`Book "${formData.title}" updated successfully!`);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      toast.error(
        "Failed to update book. Please check your input and try again.",
      );
    }
  };

  // Delete book
  const deleteBook = async (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteAlert(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const bookToDeleteData = books.find((book) => book._id === bookToDelete);
      await axios.delete(`http://localhost:3000/api/books/${bookToDelete}`, {
        headers: {
          Authorization: `${userRole} ${userToken}`,
        },
      });
      setShowDeleteAlert(false);
      setBookToDelete(null);
      fetchBooks();
      toast.success(
        `Book "${bookToDeleteData?.title || "Unknown"}" deleted successfully!`,
      );
    } catch (err) {
      setError(err.message);
      setShowDeleteAlert(false);
      setBookToDelete(null);
      toast.error("Failed to delete book. Please try again.");
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setBookToDelete(null);
  };

  // Ban/Unban book
  const toggleBookStatus = async (bookId, isBanned) => {
    try {
      const bookData = books.find((book) => book._id === bookId);
      const endpoint = isBanned
        ? `http://localhost:3000/api/books/unban-book/${bookId}`
        : `http://localhost:3000/api/books/ban-book/${bookId}`;

      await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `${userRole} ${userToken}`,
          },
        },
      );
      fetchBooks();

      if (isBanned) {
        toast.success(
          `Book "${bookData?.title || "Unknown"}" unbanned successfully!`,
        );
      } else {
        toast.error(
          `Book "${bookData?.title || "Unknown"}" banned successfully!`,
        );
      }
    } catch (err) {
      setError(err.message);
      toast.error(
        `Failed to ${isBanned ? "unban" : "ban"} book. Please try again.`,
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      availableCopies: 1,
      rating: 4,
      publishedYear: new Date().getFullYear(),
      urlImage: "",
    });
  };

  // Edit book handler
  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      availableCopies: book.availableCopies,
      rating: book.rating,
      publishedYear: book.publishedYear,
      urlImage: book.urlImage,
    });
    setShowEditModal(true);
  };

  // Sort books
  const sortBooks = (booksToSort, field, order) => {
    const sorted = [...booksToSort].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle different data types
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    return sorted;
  };

  // Search and filter books
  useEffect(() => {
    let filtered = books;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply sorting
    filtered = sortBooks(filtered, sortBy, sortOrder);

    setFilteredBooks(filtered);
  }, [searchTerm, books, sortBy, sortOrder]);

  useEffect(() => {
    initFlowbite();
    fetchBooks();
  }, []);

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Change field and default to asc
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Star rating component
  const StarRating = ({ rating, onChange }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Books Management
        </h1>
      </div>

      {/* Search and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="space-y-4">
          {/* Search by title/author - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search by Title/Author
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books by title or author..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Add Book Button */}
          <div className="flex items-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add New Book
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
        </div>
      )}

      {/* Books Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Book Info</span>
                      {sortBy === "title" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("author")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Author</span>
                      {sortBy === "author" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("publishedYear")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Year</span>
                      {sortBy === "publishedYear" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("availableCopies")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Copies</span>
                      {sortBy === "availableCopies" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("rating")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Rating</span>
                      {sortBy === "rating" && (
                        <span className="text-blue-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            book.urlImage || "https://via.placeholder.com/40"
                          }
                          alt={book.title}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {book.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {book._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {book.publishedYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {book.availableCopies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={book.rating} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.isActiveAvailableCopies && book.isActiveAdmin
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {book.isActiveAvailableCopies && book.isActiveAdmin
                          ? "Available"
                          : "Not Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBook(book)}
                          className="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Edit Book"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span className="ml-1">Edit</span>
                        </button>
                        <button
                          onClick={() => deleteBook(book._id)}
                          className="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-900 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete Book"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span className="ml-1">Delete</span>
                        </button>
                        <button
                          onClick={() =>
                            toggleBookStatus(
                              book._id,
                              !(
                                book.isActiveAvailableCopies &&
                                book.isActiveAdmin
                              ),
                            )
                          }
                          className={`inline-flex items-center px-2 py-1 rounded transition-colors ${
                            book.isActiveAvailableCopies && book.isActiveAdmin
                              ? "text-orange-600 hover:text-orange-900 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              : "text-green-600 hover:text-green-900 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                          title={
                            book.isActiveAvailableCopies && book.isActiveAdmin
                              ? "Ban Book"
                              : "Unban Book"
                          }
                        >
                          {book.isActiveAdmin ? (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              </svg>
                              <span className="ml-1">Ban</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
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
                              <span className="ml-1">Unban</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Book Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Add New Book
            </h3>
            <form onSubmit={createBook}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Author
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Available Copies
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.availableCopies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availableCopies: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Published Year
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.publishedYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedYear: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rating
                    </label>
                    <StarRating
                      rating={formData.rating}
                      onChange={(rating) =>
                        setFormData({ ...formData, rating })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.urlImage}
                      onChange={(e) =>
                        setFormData({ ...formData, urlImage: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Edit Book
            </h3>
            <form onSubmit={updateBook}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Author
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Available Copies
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.availableCopies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availableCopies: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Published Year
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.publishedYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedYear: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rating
                    </label>
                    <StarRating
                      rating={formData.rating}
                      onChange={(rating) =>
                        setFormData({ ...formData, rating })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.urlImage}
                      onChange={(e) =>
                        setFormData({ ...formData, urlImage: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBook(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Alert */}
      {showDeleteAlert && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Delete Book
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
