import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";
import {
  FaUserFriends,
  FaCheck,
  FaTimes,
  FaTrash,
  FaSync,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFilter,
  FaClock,
} from "react-icons/fa";

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredVolunteers(volunteers);
    } else {
      setFilteredVolunteers(
        volunteers.filter((v) => v.status === statusFilter)
      );
    }
  }, [statusFilter, volunteers]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/volunteers");
      setVolunteers(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Failed to load volunteers",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const approveVolunteer = async (id) => {
    try {
      await api.put(`/volunteers/${id}/approve`);
      fetchVolunteers();
      showNotification("Volunteer approved successfully!");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Approval failed",
        "error"
      );
    }
  };

  const rejectVolunteer = async (id) => {
    try {
      await api.put(`/volunteers/${id}/reject`);
      fetchVolunteers();
      showNotification("Volunteer rejected");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Reject failed",
        "error"
      );
    }
  };

  const deleteVolunteer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this volunteer?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/volunteers/${id}`);
      fetchVolunteers();
      showNotification("Volunteer deleted successfully!");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  const pendingCount = volunteers.filter((v) => v.status === "pending").length;
  const approvedCount = volunteers.filter((v) => v.status === "approved").length;
  const rejectedCount = volunteers.filter((v) => v.status === "rejected").length;

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 animate-slide-down ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3`}
        >
          {notification.type === "success" ? (
            <FaCheckCircle className="w-5 h-5" />
          ) : (
            <FaExclamationTriangle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FaUserFriends className="text-orange-600" />
              Volunteer Management
            </h1>
            <p className="text-gray-600 mt-2">
              Review and manage volunteer applications
            </p>
          </div>
          <button
            onClick={fetchVolunteers}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md"
          >
            <FaSync className="w-4 h-4" />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Volunteers
              </p>
              <h3 className="text-3xl font-bold">{volunteers.length}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaUserFriends className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium mb-1">
                Pending Review
              </p>
              <h3 className="text-3xl font-bold">{pendingCount}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaHourglassHalf className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Approved</p>
              <h3 className="text-3xl font-bold">{approvedCount}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaCheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Rejected</p>
              <h3 className="text-3xl font-bold">{rejectedCount}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaTimesCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="animate-slide-up flex gap-2 bg-white p-2 rounded-xl shadow-md border border-gray-200"
        style={{ animationDelay: "0.2s" }}
      >
        <button
          onClick={() => setStatusFilter("all")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            statusFilter === "all"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaFilter className="w-4 h-4" />
          All ({volunteers.length})
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            statusFilter === "pending"
              ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaClock className="w-4 h-4" />
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            statusFilter === "approved"
              ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaCheck className="w-4 h-4" />
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setStatusFilter("rejected")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            statusFilter === "rejected"
              ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaTimes className="w-4 h-4" />
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Volunteer List */}
      <div
        className="animate-slide-up bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserFriends className="text-orange-600" />
            Volunteers ({filteredVolunteers.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading volunteers...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Volunteer Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredVolunteers.length > 0 ? (
                  filteredVolunteers.map((volunteer) => (
                    <tr
                      key={volunteer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {volunteer.photo ? (
                          <img
                            src={`${API_BASE}${volunteer.photo}`}
                            alt={volunteer.name}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                            {volunteer.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {volunteer.name}
                          </p>
                          {volunteer.volunteer_id && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <FaIdCard className="w-3 h-3" />
                              {volunteer.volunteer_id}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaPhone className="w-3 h-3 text-gray-400" />
                            {volunteer.mobile}
                          </p>
                          {volunteer.email && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <FaEnvelope className="w-3 h-3 text-gray-400" />
                              {volunteer.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {volunteer.status === "approved" && (
                          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <FaCheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {volunteer.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-800 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">
                            <FaClock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {volunteer.status === "rejected" && (
                          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-100 to-red-200 text-red-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <FaTimesCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {volunteer.status === "pending" && (
                            <>
                              <button
                                onClick={() => approveVolunteer(volunteer.id)}
                                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-medium transition-all hover:shadow-lg text-sm"
                              >
                                <FaCheck className="w-3 h-3" />
                                Approve
                              </button>
                              <button
                                onClick={() => rejectVolunteer(volunteer.id)}
                                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-medium transition-all hover:shadow-lg text-sm"
                              >
                                <FaTimes className="w-3 h-3" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteVolunteer(volunteer.id)}
                            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-all hover:shadow-lg text-sm"
                          >
                            <FaTrash className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FaUserFriends className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No volunteers found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {statusFilter !== "all"
                            ? `No ${statusFilter} volunteers`
                            : "No volunteer applications yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerManagement;
