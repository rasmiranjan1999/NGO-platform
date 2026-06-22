import { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  FaUserShield,
  FaPlus,
  FaTrash,
  FaSync,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCrown,
  FaShieldAlt,
  FaCalendar,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAdmins = async () => {
    try {
      const response = await api.get("/admins");
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Failed to fetch admins",
        "error"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/admins", form);

      setForm({
        name: "",
        email: "",
        password: "",
      });

      fetchAdmins();
      setShowForm(false);
      showNotification("Admin created successfully!", "success");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Failed to create admin",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, role) => {
    if (role === "super_admin") {
      showNotification("Super Admin cannot be deleted", "error");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/admins/${id}`);
      fetchAdmins();
      showNotification("Admin deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Failed to delete admin",
        "error"
      );
    }
  };

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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        <div className={`fixed top-4 right-4 z-50 animate-slide-down ${
          notification.type === "success" 
            ? "bg-green-500" 
            : "bg-red-500"
        } text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3`}>
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
              <FaUserShield className="text-purple-600" />
              Admin Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage platform administrators
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAdmins}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md"
            >
              <FaSync className="w-4 h-4" />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden md:inline">New Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total Admins</p>
              <h3 className="text-3xl font-bold">{admins.length}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaUserShield className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Super Admins</p>
              <h3 className="text-3xl font-bold">
                {admins.filter((a) => a.role === "super_admin").length}
              </h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaCrown className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Regular Admins</p>
              <h3 className="text-3xl font-bold">
                {admins.filter((a) => a.role === "admin").length}
              </h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaShieldAlt className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Admin Form */}
      {showForm && (
        <div className="animate-slide-up bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ animationDelay: "0.2s" }}>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaPlus />
              Create New Admin
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@bkss.org"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Admin"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ name: "", email: "", password: "" });
                }}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin List */}
      <div className="animate-slide-up bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ animationDelay: "0.3s" }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserShield className="text-purple-600" />
            All Administrators ({admins.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Admin Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        #{admin.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          admin.role === "super_admin"
                            ? "bg-gradient-to-br from-purple-500 to-purple-700"
                            : "bg-gradient-to-br from-blue-500 to-blue-700"
                        } text-white font-bold`}>
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {admin.name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FaEnvelope className="w-3 h-3" />
                            {admin.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {admin.role === "super_admin" ? (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                          <FaCrown className="w-3 h-3" />
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                          <FaShieldAlt className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendar className="w-3 h-3 text-gray-400" />
                        {admin.created_at
                          ? new Date(admin.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {admin.role === "super_admin" ? (
                        <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                          <FaShieldAlt className="w-4 h-4" />
                          Protected
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleDelete(admin.id, admin.role)
                          }
                          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                        >
                          <FaTrash className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaUserShield className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No admins found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Create your first admin to get started
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;