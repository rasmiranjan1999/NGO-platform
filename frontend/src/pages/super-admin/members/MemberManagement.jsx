import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaImage,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaIdCard,
} from "react-icons/fa";

const initialForm = {
  name: "",
  photo: "",
  mobile: "",
  email: "",
  address: "",
  occupation: "",
  qualification: "",
};

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    setFilteredMembers(
      members.filter(
        (member) =>
          member.name?.toLowerCase().includes(keyword) ||
          member.member_id?.toLowerCase().includes(keyword) ||
          member.mobile?.toLowerCase().includes(keyword) ||
          member.email?.toLowerCase().includes(keyword)
      )
    );
  }, [search, members]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/members");
      setMembers(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Failed to load members",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setImage(null);
    setImagePreview(null);
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
      let photoUrl = form.photo;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        photoUrl = uploadResponse.data.data.url;
      }

      const payload = {
        ...form,
        photo: photoUrl,
      };

      if (editingId) {
        await api.put(`/members/${editingId}`, payload);
        showNotification("Member updated successfully!");
      } else {
        await api.post("/members", payload);
        showNotification("Member created successfully!");
      }

      resetForm();
      fetchMembers();
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

  const handleEdit = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name || "",
      photo: member.photo || "",
      mobile: member.mobile || "",
      email: member.email || "",
      address: member.address || "",
      occupation: member.occupation || "",
      qualification: member.qualification || "",
    });
    setShowForm(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this member?");
    if (!confirmed) return;

    try {
      await api.delete(`/members/${id}`);
      fetchMembers();
      showNotification("Member deleted successfully!");
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Delete failed",
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
              <FaUsers className="text-blue-600" />
              Member Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create, update and manage organization members
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchMembers}
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
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden md:inline">New Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Members
              </p>
              <h3 className="text-3xl font-bold">{members.length}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaUsers className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Active Members
              </p>
              <h3 className="text-3xl font-bold">
                {members.filter((m) => m.status === "active").length}
              </h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaCheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-2xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">
                Search Results
              </p>
              <h3 className="text-3xl font-bold">{filteredMembers.length}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaSearch className="w-8 h-8" />
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
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingId ? <FaEdit /> : <FaPlus />}
              {editingId ? "Update Member" : "Create New Member"}
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
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaPhone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mobile: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
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
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occupation
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaBriefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter occupation"
                    value={form.occupation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        occupation: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualification
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaGraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter qualification"
                    value={form.qualification}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        qualification: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all">
                    <FaImage className="text-gray-400" />
                    <span className="text-gray-600 text-sm">
                      {image ? image.name : "Choose photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {(imagePreview || form.photo) && (
                    <img
                      src={imagePreview || `${API_BASE}${form.photo}`}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FaMapMarkerAlt className="w-4 h-4" />
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Enter full address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{editingId ? "Updating..." : "Creating..."}</span>
                  </div>
                ) : (
                  <span>{editingId ? "Update Member" : "Create Member"}</span>
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

      {/* Member List */}
      <div
        className="animate-slide-up bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaUsers className="text-blue-600" />
            All Members ({filteredMembers.length})
          </h2>

          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Member Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Occupation
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {member.photo ? (
                        <img
                          src={`${API_BASE}${member.photo}`}
                          alt={member.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FaIdCard className="w-3 h-3" />
                          {member.member_id}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {member.mobile && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaPhone className="w-3 h-3 text-gray-400" />
                            {member.mobile}
                          </p>
                        )}
                        {member.email && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaEnvelope className="w-3 h-3 text-gray-400" />
                            {member.email}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {member.occupation && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaBriefcase className="w-3 h-3 text-gray-400" />
                            {member.occupation}
                          </p>
                        )}
                        {member.qualification && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaGraduationCap className="w-3 h-3 text-gray-400" />
                            {member.qualification}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg font-medium transition-all hover:shadow-lg text-sm"
                        >
                          <FaEdit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
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
                        <FaUsers className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No members found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {search
                          ? "Try adjusting your search"
                          : "Create your first member to get started"}
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

export default MemberManagement;
