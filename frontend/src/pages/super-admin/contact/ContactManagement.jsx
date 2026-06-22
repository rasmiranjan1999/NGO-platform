import { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaSync,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaPhone,
  FaUser,
  FaClock,
  FaFilter,
  FaSortAmountDown,
  FaInbox,
  FaChartLine,
  FaEye,
  FaReply,
} from "react-icons/fa";

const ContactManagement = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let filtered = messages;

    // Apply search filter
    if (searchTerm) {
      const keyword = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.name?.toLowerCase().includes(keyword) ||
          msg.email?.toLowerCase().includes(keyword) ||
          msg.subject?.toLowerCase().includes(keyword) ||
          msg.message?.toLowerCase().includes(keyword) ||
          msg.mobile?.toLowerCase().includes(keyword)
      );
    }

    // Apply status filter
    if (statusFilter === "read") {
      filtered = filtered.filter((msg) => msg.is_read === true);
    } else if (statusFilter === "unread") {
      filtered = filtered.filter((msg) => msg.is_read === false);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredMessages(filtered);
  }, [searchTerm, messages, statusFilter, sortBy]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact");
      setMessages(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Failed to load messages",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      fetchMessages();
      showNotification("Message marked as read");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Failed to update",
        "error"
      );
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await api.delete(`/contact/${id}`);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
      showNotification("Message deleted successfully");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  const handleMessageClick = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await markAsRead(msg.id);
    }
  };

  const unreadCount = messages.filter((msg) => !msg.is_read).length;
  const readCount = messages.filter((msg) => msg.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-8">
      
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-slide-in ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <FaCheckCircle className="text-xl" />
          ) : (
            <FaExclamationTriangle className="text-xl" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 hover:bg-white/20 rounded-full p-1"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaInbox className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Contact Management
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage and respond to contact form submissions
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Messages</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{messages.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaEnvelope className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaChartLine className="text-cyan-500" />
            <span>All submissions</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Unread</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{unreadCount}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaEnvelope className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaClock className="text-amber-500" />
            <span>Needs attention</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Read</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{readCount}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaEnvelopeOpen className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaCheckCircle className="text-green-500" />
            <span>Processed</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Response Rate</p>
              <p className="text-2xl font-bold mt-2">
                {messages.length > 0 ? Math.round((readCount / messages.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FaChartLine className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-sm text-cyan-100">
            Messages reviewed
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FaInbox className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Inbox</h2>
                <p className="text-sm text-slate-500">
                  {filteredMessages.length} of {messages.length} messages
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all appearance-none bg-white cursor-pointer text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>

                <div className="relative flex-1">
                  <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all appearance-none bg-white cursor-pointer text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="name">By Name</option>
                  </select>
                </div>
              </div>

              <button
                onClick={fetchMessages}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 500px)" }}>
            {loading && !messages.length ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <FaSync className="animate-spin text-4xl text-cyan-500 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Loading messages...</p>
                </div>
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleMessageClick(msg)}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedMessage?.id === msg.id ? "bg-cyan-50 border-l-4 border-cyan-500" : ""
                    } ${!msg.is_read ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !msg.is_read 
                          ? "bg-gradient-to-br from-amber-500 to-orange-500" 
                          : "bg-gradient-to-br from-slate-400 to-slate-500"
                      }`}>
                        {!msg.is_read ? (
                          <FaEnvelope className="text-white" />
                        ) : (
                          <FaEnvelopeOpen className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold text-sm truncate ${!msg.is_read ? "text-slate-900" : "text-slate-700"}`}>
                            {msg.name}
                          </h3>
                          {!msg.is_read && (
                            <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 truncate mb-1">{msg.subject}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <FaClock className="text-[10px]" />
                          <span>
                            {msg.created_at
                              ? new Date(msg.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "No date"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                  <FaInbox className="text-4xl text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Messages</h3>
                <p className="text-slate-600 text-sm text-center">
                  {searchTerm || statusFilter !== "all"
                    ? "No messages match your filters."
                    : "No contact messages yet."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Message Header */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-800 mb-1">
                        {selectedMessage.name}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                        >
                          <FaEnvelope />
                          {selectedMessage.email}
                        </a>
                        {selectedMessage.mobile && (
                          <a
                            href={`tel:${selectedMessage.mobile}`}
                            className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                          >
                            <FaPhone />
                            {selectedMessage.mobile}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-slate-600" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      selectedMessage.is_read
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedMessage.is_read ? (
                      <>
                        <FaEnvelopeOpen />
                        Read
                      </>
                    ) : (
                      <>
                        <FaEnvelope />
                        Unread
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaClock />
                    {selectedMessage.created_at
                      ? new Date(selectedMessage.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No date"}
                  </div>
                </div>
              </div>

              {/* Message Subject */}
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <FaEnvelope />
                  <span className="font-medium">Subject</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedMessage.subject}
                </h3>
              </div>

              {/* Message Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaReply />
                    Reply via Email
                  </a>
                  {!selectedMessage.is_read && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                      <FaCheckCircle />
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6">
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                <FaEnvelope className="text-6xl text-cyan-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No Message Selected</h3>
              <p className="text-slate-600 text-center max-w-md mb-6">
                Select a message from the inbox to view its details and respond.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Unread message</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  <span>Read message</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;
