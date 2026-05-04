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

  // --- API Actions ---

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/books", {
        headers: { Authorization: `${userRole} ${userToken}` },
      });
      const data = response.data.data || response.data;
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/books", formData, {
        headers: { Authorization: `${userRole} ${userToken}` },
      });
      setShowCreateModal(false);
      resetForm();
      fetchBooks();
      toast.success(`Book "${formData.title}" created successfully!`);
    } catch (err) {
      toast.error("Failed to create book.");
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/books/${editingBook._id}`, formData, {
        headers: { Authorization: `${userRole} ${userToken}` },
      });
      setShowEditModal(false);
      setEditingBook(null);
      resetForm();
      fetchBooks();
      toast.success("Updated successfully!");
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/books/${bookToDelete}`, {
        headers: { Authorization: `${userRole} ${userToken}` },
      });
      setShowDeleteAlert(false);
      fetchBooks();
      toast.success("Deleted successfully!");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const toggleBookStatus = async (bookId, currentAdminStatus) => {
    try {
      const endpoint = currentAdminStatus
        ? `/api/books/ban-book/${bookId}`
        : `/api/books/unban-book/${bookId}`;

      await axios.put(
        endpoint,
        {},
        {
          headers: { Authorization: `${userRole} ${userToken}` },
        },
      );
      fetchBooks();
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Status update failed.");
    }
  };

  // --- Helpers ---

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

  const toggleDropdown = (id) => {
    const el = document.getElementById(`dropdown-${id}`);
    if (el) el.classList.toggle("hidden");
  };

  useEffect(() => {
    initFlowbite();
    fetchBooks();
  }, []);

  // Search/Filter logic
  useEffect(() => {
    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const StarRating = ({ rating, onChange }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={`text-xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Books Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Add New Book
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 dark:text-white text-xl">
          Loading books...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 flex flex-col"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl"></div>
              <div className="p-5 flex flex-col items-center flex-grow">
                <img
                  className="h-40 w-28 object-cover rounded shadow-md mb-4"
                  src={book.urlImage || "https://via.placeholder.com/150"}
                  alt={book.title}
                />
                <h3 className="font-bold text-center dark:text-white line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{book.author}</p>

                <div className="w-full space-y-2 text-sm dark:text-gray-300 mb-4">
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span>{book.publishedYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Copies:</span>
                    <span>{book.availableCopies}</span>
                  </div>
                  <div className="flex justify-center pt-2">
                    <StarRating rating={book.rating} />
                  </div>
                </div>

                <div className="mt-auto w-full">
                  <div className="flex justify-center mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${book.isActiveAdmin ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {book.isActiveAdmin ? "Active" : "Banned"}
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(book._id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Actions
                    </button>

                    <div
                      id={`dropdown-${book._id}`}
                      className="hidden absolute bottom-full mb-2 left-0 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-2xl z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          handleEditBook(book);
                          toggleDropdown(book._id);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => {
                          toggleBookStatus(book._id, book.isActiveAdmin);
                          toggleDropdown(book._id);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-600 border-t dark:border-gray-600"
                      >
                        {book.isActiveAdmin ? "Ban Book" : "Unban Book"}
                      </button>
                      <button
                        onClick={() => {
                          setBookToDelete(book._id);
                          setShowDeleteAlert(true);
                          toggleDropdown(book._id);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 border-t dark:border-gray-600"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Modals --- */}

      {/* Delete Alert */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {showCreateModal ? "Add New Book" : "Edit Book"}
            </h2>
            <form
              onSubmit={showCreateModal ? createBook : updateBook}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  Author
                </label>
                <input
                  required
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                    Copies
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.availableCopies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableCopies: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                    Year
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.publishedYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publishedYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.urlImage}
                  onChange={(e) =>
                    setFormData({ ...formData, urlImage: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                  Rating
                </label>
                <StarRating
                  rating={formData.rating}
                  onChange={(val) => setFormData({ ...formData, rating: val })}
                />
              </div>
              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-2 border rounded-lg dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {showCreateModal ? "Add Book" : "Update Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
