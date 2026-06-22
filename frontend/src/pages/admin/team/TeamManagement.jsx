import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";
import {
  FaUsers,
  FaUserTie,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaImage,
  FaUserCircle,
  FaBriefcase,
  FaChartLine,
  FaStar,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    photo: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const designations = [
    "President",
    "Vice President",
    "Secretary",
    "Joint Secretary",
    "Treasurer",
    "Member",
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    let filtered = members;

    // Apply search filter
    if (searchTerm) {
      const keyword = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(keyword) ||
          member.designation?.toLowerCase().includes(keyword) ||
          member.description?.toLowerCase().includes(keyword)
      );
    }

    // Apply designation filter
    if (designationFilter !== "all") {
      filtered = filtered.filter(
        (member) => member.designation === designationFilter
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "designation":
          return designations.indexOf(a.designation) - designations.indexOf(b.designation);
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
  }, [searchTerm, members, designationFilter, sortBy]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/team");
      setMembers(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
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
        await api.put(`/team/${editingId}`, payload);
        showNotification("Team member updated successfully!");
      } else {
        await api.post("/team", payload);
        showNotification("Team member created successfully!");
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
      designation: member.designation || "",
      photo: member.photo || "",
      description: member.description || "",
    });
    setImage(null);
    setImagePreview(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?"))
      return;

    try {
      await api.delete(`/team/${id}`);
      fetchMembers();
      showNotification("Team member deleted successfully!");
    } catch (error) {
      console.error(error);
      showNotification("Delete failed", "error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setImage(null);
    setImagePreview(null);
    setForm({
      name: "",
      designation: "",
      photo: "",
      description: "",
    });
    setShowForm(false);
  };

  const getDesignationColor = (designation) => {
    const colors = {
      President: "from-purple-500 to-indigo-600",
      "Vice President": "from-blue-500 to-cyan-600",
      Secretary: "from-green-500 to-emerald-600",
      "Joint Secretary": "from-teal-500 to-green-600",
      Treasurer: "from-amber-500 to-orange-600",
      Member: "from-slate-500 to-gray-600",
    };
    return colors[designation] || "from-slate-500 to-gray-600";
  };

  const getDesignationIcon = (designation) => {
    if (designation.includes("President")) return FaStar;
    if (designation.includes("Secretary")) return FaBriefcase;
    if (designation.includes("Treasurer")) return FaChartLine;
    return FaUserTie;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-8">
      
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
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Team Management
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage your organization's leadership and team members
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Members</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{members.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaChartLine className="text-indigo-500" />
            <span>All team members</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Leadership</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {members.filter(m => 
                  m.designation.includes("President") || 
                  m.designation.includes("Secretary") || 
                  m.designation.includes("Treasurer")
                ).length}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaStar className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaUserTie className="text-purple-500" />
            <span>Core team</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Designations</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {new Set(members.map(m => m.designation)).size}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBriefcase className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaUserTie className="text-blue-500" />
            <span>Unique roles</span>
          </div>
        </div>

        <div
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setShowForm(!showForm)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Quick Action</p>
              <p className="text-2xl font-bold mt-2">
                {showForm ? "Hide Form" : "Add Member"}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {showForm ? (
                <FaTimes className="text-white text-2xl" />
              ) : (
                <FaPlus className="text-white text-2xl" />
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-indigo-100">
            Click to {showForm ? "close" : "add new member"}
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                {editingId ? (
                  <FaEdit className="text-white text-lg" />
                ) : (
                  <FaPlus className="text-white text-lg" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Update Team Member" : "Add Team Member"}
              </h2>
            </div>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <FaTimes />
              {editingId ? "Cancel Edit" : "Close"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter member's full name..."
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              {/* Designation Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.designation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        designation: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map((designation) => (
                      <option key={designation} value={designation}>
                        {designation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profile Photo
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <FaImage className="text-4xl text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {(imagePreview || form.photo) && (
                <div className="mt-4 flex justify-center">
                  <div className="relative inline-block">
                    <img
                      src={
                        imagePreview ||
                        (form.photo?.startsWith("/uploads")
                          ? `${API_BASE}${form.photo}`
                          : `${API_BASE}/uploads/${form.photo}`)
                      }
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 border-slate-200 shadow-md"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description / Bio
              </label>
              <textarea
                rows="5"
                placeholder="Enter member's description or bio..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSync className="animate-spin" />
                    Processing...
                  </>
                ) : editingId ? (
                  <>
                    <FaEdit />
                    Update Member
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add Member
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaUsers className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
              <p className="text-sm text-slate-500">
                {filteredMembers.length} of {members.length} members
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            {/* Designation Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <select
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Roles</option>
                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="name">By Name</option>
                <option value="designation">By Designation</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchMembers}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Team Members Grid */}
        {loading && !members.length ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSync className="animate-spin text-5xl text-indigo-500 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Loading team members...</p>
            </div>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => {
              const DesignationIcon = getDesignationIcon(member.designation);
              return (
                <div
                  key={member.id}
                  className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
                >
                  {/* Profile Section */}
                  <div className="relative p-6 pb-0">
                    {/* Background Gradient */}
                    <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-r ${getDesignationColor(member.designation)} opacity-10`} />
                    
                    {/* Photo */}
                    <div className="relative flex justify-center mb-4">
                      {member.photo ? (
                        <img
                          src={
                            member.photo?.startsWith("/uploads")
                              ? `${API_BASE}${member.photo}`
                              : `${API_BASE}/uploads/${member.photo}`
                          }
                          alt={member.name}
                          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <FaUserCircle className="text-6xl text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-6 pt-2 text-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {member.name}
                    </h3>
                    
                    {/* Designation Badge */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className={`px-3 py-1.5 bg-gradient-to-r ${getDesignationColor(member.designation)} text-white rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5`}>
                        <DesignationIcon />
                        {member.designation}
                      </span>
                    </div>

                    {/* Description */}
                    {member.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                        {member.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
              <FaUsers className="text-5xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Team Members Found</h3>
            <p className="text-slate-600 mb-6 text-center max-w-md">
              {searchTerm || designationFilter !== "all"
                ? "No members match your search criteria. Try adjusting your filters."
                : "Get started by adding your first team member."}
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FaPlus />
                Add First Member
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default TeamManagement;