import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";
import {
  FaTasks,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaCalendar,
  FaImage,
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaMapMarkerAlt,
} from "react-icons/fa";

const initialForm = {
  title: "",
  cover_image: "",
  description: "",
  location: "",
  activity_date: "",
  publish_status: true,
};

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    let filtered = activities;

    // Apply search filter
    if (search) {
      const keyword = search.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title?.toLowerCase().includes(keyword) ||
          activity.slug?.toLowerCase().includes(keyword) ||
          activity.location?.toLowerCase().includes(keyword)
      );
    }

    // Apply status filter
    if (statusFilter === "published") {
      filtered = filtered.filter((a) => a.publish_status === true);
    } else if (statusFilter === "draft") {
      filtered = filtered.filter((a) => a.publish_status === false);
    }

    setFilteredActivities(filtered);
  }, [search, activities, statusFilter]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get("/activities");
      setActivities(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load activities", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setImage(null);
    setImagePreview(null);
    setForm(initialForm);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let coverImage = form.cover_image;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        coverImage = uploadResponse.data.data.url;
      }

      const payload = {
        ...form,
        cover_image: coverImage,
      };

      if (editingId) {
        await api.put(`/activities/${editingId}`, payload);
        showNotification("Activity updated successfully!");
      } else {
        await api.post("/activities", payload);
        showNotification("Activity created successfully!");
      }

      resetForm();
      fetchActivities();
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Operation failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setForm({
      title: activity.title || "",
      cover_image: activity.cover_image || "",
      description: activity.description || "",
      location: activity.location || "",
      activity_date: activity.activity_date?.split("T")[0] || "",
      publish_status: activity.publish_status,
    });
    setImage(null);
    setImagePreview(null);
    setShowForm(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return;

    try {
      await api.delete(`/activities/${id}`);
      fetchActivities();
      showNotification("Activity deleted successfully!");
    } catch (error) {
      console.error(error);
      showNotification("Delete failed", "error");
    }
  };

  const publishedCount = activities.filter((a) => a.publish_status === true).length;
  const draftCount = activities.filter((a) => a.publish_status === false).length;

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
              <FaTasks className="text-indigo-600" />
              Activity Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage NGO activities and events
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchActivities}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md"
            >
              <FaSync className="w-4 h-4" />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden md:inline">New Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Activities
              </p>
              <h3 className="text-3xl font-bold text-white">{activities.length}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaTasks className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-50 text-sm font-medium mb-1">Published</p>
              <h3 className="text-3xl font-bold text-white">{publishedCount}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaEye className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-50 text-sm font-medium mb-1">Draft</p>
              <h3 className="text-3xl font-bold text-white">{draftCount}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaEyeSlash className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-50 text-sm font-medium mb-1">
                Search Results
              </p>
              <h3 className="text-3xl font-bold text-white">{filteredActivities.length}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaSearch className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div
          className="animate-slide-up bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingId ? <FaEdit /> : <FaPlus />}
              {editingId ? "Update Activity" : "Create New Activity"}
            </h2>
            <button
              onClick={resetForm}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Title *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaFileAlt className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter activity title"
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Activity Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Date
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaCalendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={form.activity_date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        activity_date: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaMapMarkerAlt className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Publish Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={form.publish_status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      publish_status: e.target.value === "true",
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value={true}>Published</option>
                  <option value={false}>Draft</option>
                </select>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all">
                    <FaImage className="text-gray-400" />
                    <span className="text-gray-600 text-sm">
                      {image ? image.name : "Choose image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {(imagePreview || form.cover_image) && (
                    <img
                      src={
                        imagePreview ||
                        (form.cover_image?.startsWith("/uploads")
                          ? `${API_BASE}${form.cover_image}`
                          : `${API_BASE}/uploads/${form.cover_image}`)
                      }
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="5"
                  placeholder="Enter activity description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{editingId ? "Updating..." : "Creating..."}</span>
                  </div>
                ) : (
                  <span>{editingId ? "Update Activity" : "Create Activity"}</span>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div
        className="animate-slide-up flex gap-2 bg-white p-2 rounded-xl shadow-md border border-gray-200"
        style={{ animationDelay: "0.3s" }}
      >
        <button
          onClick={() => setStatusFilter("all")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            statusFilter === "all"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaTasks className="w-4 h-4" />
          All ({activities.length})
        </button>
        <button
          onClick={() => setStatusFilter("published")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            statusFilter === "published"
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaEye className="w-4 h-4" />
          Published ({publishedCount})
        </button>
        <button
          onClick={() => setStatusFilter("draft")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            statusFilter === "draft"
              ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaEyeSlash className="w-4 h-4" />
          Draft ({draftCount})
        </button>
      </div>

      {/* Activities List */}
      <div
        className="animate-slide-up bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaTasks className="text-indigo-600" />
            All Activities ({filteredActivities.length})
          </h2>

          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activity Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Location
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
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {activity.cover_image ? (
                        <img
                          src={
                            activity.cover_image?.startsWith("/uploads")
                              ? `${API_BASE}${activity.cover_image}`
                              : `${API_BASE}/uploads/${activity.cover_image}`
                          }
                          alt={activity.title}
                          className="w-24 h-16 rounded-xl object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <FaImage className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {activity.activity_date && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaCalendar className="w-3 h-3 text-gray-400" />
                            {new Date(activity.activity_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        )}
                        {activity.location && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                            {activity.location}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {activity.publish_status ? (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                          <FaEye className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                          <FaEyeSlash className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg font-medium transition-all hover:shadow-lg text-sm"
                        >
                          <FaEdit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(activity.id)}
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
                        <FaTasks className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No activities found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {search
                          ? "Try adjusting your search"
                          : statusFilter !== "all"
                          ? `No ${statusFilter} activities`
                          : "Create your first activity to get started"}
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

export default ActivityManagement;
