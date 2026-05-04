import { useEffect, useState, useContext } from "react";
import { User } from "../../contexts/UserContext";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { userToken, userRole } = useContext(User);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/transactions/admin`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${userRole} ${userToken}`,
            },
          },
        );
        setTransactions(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userToken && userRole) {
      fetchTransactions();
    }
  }, [userToken, userRole]);

  // Return book transaction
  const returnBook = async (transactionId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/transactions/return/${transactionId}`,
        {},
        {
          headers: {
            Authorization: `${userRole} ${userToken}`,
          },
        },
      );

      // Refetch all transactions to get updated data from server
      fetchTransactions();
    } catch (err) {
      setError(err.message || "Failed to return book");
      console.error("Error returning book:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all library transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-300"
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
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Transactions
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {transactions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-300"
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
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Borrowed Books
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {transactions.filter((t) => t.status === "borrowed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-300"
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
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Returned Books
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {transactions.filter((t) => t.status === "returned").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Transactions
            </h2>
          </div>

          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Loading transactions...
              </p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="text-red-600 dark:text-red-400 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
          )}

          {!loading && !error && transactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* Card Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2"></div>

                  <div className="p-6">
                    {/* User Section */}
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800">
                          <span className="text-white font-bold text-lg">
                            {transaction.userId?.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {transaction.userId?.name || "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {transaction.userId?.email || "No email"}
                        </p>
                      </div>
                    </div>

                    {/* Book Section */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                      <div className="flex items-start">
                        <div className="relative">
                          <img
                            className="h-20 w-16 rounded-lg object-cover shadow-md"
                            src={
                              transaction.bookId?.urlImage ||
                              "/placeholder-book.png"
                            }
                            alt={transaction.bookId?.title || "Book cover"}
                          />
                          <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {transaction.bookId?.title || "Unknown Book"}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {transaction.bookId?.author || "Unknown Author"}
                          </p>
                          {transaction.bookId?.publishedYear && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Published: {transaction.bookId.publishedYear}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <svg
                            className="w-4 h-4 text-blue-500 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            Borrow Date
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {transaction.borrowDate
                            ? new Date(
                                transaction.borrowDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <svg
                            className="w-4 h-4 text-green-500 mr-1"
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
                          <p className="text-xs font-medium text-green-600 dark:text-green-400">
                            Return Date
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {transaction.returnDate
                            ? new Date(
                                transaction.returnDate,
                              ).toLocaleDateString()
                            : "Not returned"}
                        </p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                            transaction.status === "borrowed"
                              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                              : transaction.status === "returned"
                                ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                          }`}
                        >
                          {transaction.status === "borrowed" && (
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {transaction.status === "returned" && (
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {transaction.status?.charAt(0)?.toUpperCase() +
                            transaction.status?.slice(1) || "Unknown"}
                        </span>
                        {transaction.status === "borrowed" && (
                          <div className="relative">
                            <button
                              onClick={() => {
                                const dropdown = document.getElementById(
                                  `return-dropdown-${transaction._id}`,
                                );
                                dropdown.classList.toggle("hidden");
                              }}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                              disabled={transaction.isReturning}
                            >
                              {transaction.isReturning ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-3 h-3 mr-1"
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
                                  Return
                                </>
                              )}
                            </button>
                            <div
                              id={`return-dropdown-${transaction._id}`}
                              className="hidden absolute right-0 z-10 mt-2 w-48 bg-white rounded-xl shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                              <div className="py-2">
                                <button
                                  onClick={() => {
                                    setTransactions((prevTransactions) =>
                                      prevTransactions.map((t) =>
                                        t._id === transaction._id
                                          ? { ...t, isReturning: true }
                                          : t,
                                      ),
                                    );

                                    returnBook(transaction._id);
                                    document
                                      .getElementById(
                                        `return-dropdown-${transaction._id}`,
                                      )
                                      .classList.add("hidden");
                                  }}
                                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 transition-colors"
                                  disabled={transaction.isReturning}
                                >
                                  {transaction.isReturning ? (
                                    <>
                                      <svg
                                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-green-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        className="w-4 h-4 mr-3"
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
                                      Confirm Return
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && transactions.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                No transactions found
              </p>
            </div>
          )}
        </div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Transaction Details
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    User Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Name
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction.userId?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction.userId?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Role
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction.userId?.role || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        User ID
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction.userId?._id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Book Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Book Information
                  </h4>
                  <div className="flex items-start space-x-4">
                    <img
                      src={
                        selectedTransaction.bookId?.urlImage ||
                        "/placeholder-book.png"
                      }
                      alt={selectedTransaction.bookId?.title || "Book cover"}
                      className="w-20 h-24 object-cover rounded"
                    />
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Title
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {selectedTransaction.bookId?.title || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Author
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {selectedTransaction.bookId?.author || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Published Year
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {selectedTransaction.bookId?.publishedYear || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Available Copies
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {selectedTransaction.bookId?.availableCopies || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Rating
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {selectedTransaction.bookId?.rating || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Book ID
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {selectedTransaction.bookId?._id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedTransaction.bookId?.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Description
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all">
                        {selectedTransaction.bookId.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Transaction Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Transaction Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Transaction ID
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction._id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedTransaction.status === "borrowed"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : selectedTransaction.status === "returned"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {selectedTransaction.status || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Borrow Date
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction.borrowDate
                          ? new Date(
                              selectedTransaction.borrowDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Return Date
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction.returnDate
                          ? new Date(
                              selectedTransaction.returnDate,
                            ).toLocaleDateString()
                          : "Not returned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created At
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {selectedTransaction.createdAt
                          ? new Date(
                              selectedTransaction.createdAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
