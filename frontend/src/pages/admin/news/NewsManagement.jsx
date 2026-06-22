import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";
import {
  FaNewspaper,
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
  FaFilter,
  FaSortAmountDown,
  FaChartLine,
} from "react-icons/fa";

const initialForm = {
  title: "",
  cover_image: "",
  description: "",
  publish_status: true,
};

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = news;

    // Apply search filter
    if (search) {
      const keyword = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(keyword) ||
          item.slug?.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword)
      );
    }

    // Apply status filter
    if (statusFilter === "published") {
      filtered = filtered.filter((n) => n.publish_status === true);
    } else if (statusFilter === "draft") {
      filtered = filtered.filter((n) => n.publish_status === false);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredNews(filtered);
  }, [search, news, statusFilter, sortBy]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/news");
      setNews(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load news", "error");
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
        await api.put(`/news/${editingId}`, payload);
        showNotification("News updated successfully!");
      } else {
        await api.post("/news", payload);
        showNotification("News created successfully!");
      }

      resetForm();
      fetchNews();
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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      cover_image: item.cover_image || "",
      description: item.description || "",
      publish_status: item.publish_status,
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
    if (!window.confirm("Are you sure you want to delete this news item?"))
      return;

    try {
      await api.delete(`/news/${id}`);
      fetchNews();
      showNotification("News deleted successfully!");
    } catch (error) {
      console.error(error);
      showNotification("Delete failed", "error");
    }
  };

  const publishedCount = news.filter((n) => n.publish_status === true).length;
  const draftCount = news.filter((n) => n.publish_status === false).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaNewspaper className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              News Management
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage and publish news articles for your organization
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total News</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{news.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaNewspaper className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaChartLine className="text-blue-500" />
            <span>All articles</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Published</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{publishedCount}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaEye className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaCheckCircle className="text-green-500" />
            <span>Live articles</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{draftCount}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaEyeSlash className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaFileAlt className="text-amber-500" />
            <span>Unpublished</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setShowForm(!showForm)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Quick Action</p>
              <p className="text-2xl font-bold mt-2">
                {showForm ? "Hide Form" : "Add News"}
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
          <div className="mt-4 text-sm text-blue-100">
            Click to {showForm ? "close" : "create new article"}
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                {editingId ? (
                  <FaEdit className="text-white text-lg" />
                ) : (
                  <FaPlus className="text-white text-lg" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Update News Article" : "Create News Article"}
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
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter article title..."
                required
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
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
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {(imagePreview || form.cover_image) && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={
                      imagePreview ||
                      (form.cover_image?.startsWith("/uploads")
                        ? `${API_BASE}${form.cover_image}`
                        : `${API_BASE}/uploads/${form.cover_image}`)
                    }
                    alt="Preview"
                    className="w-48 h-32 object-cover rounded-xl border-2 border-slate-200 shadow-md"
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
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                rows="6"
                placeholder="Enter article description or content..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              />
            </div>

            {/* Publish Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Publication Status
              </label>
              <select
                value={form.publish_status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    publish_status: e.target.value === "true",
                  })
                }
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                <option value="true">✓ Published (Visible to public)</option>
                <option value="false">✎ Draft (Save for later)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSync className="animate-spin" />
                    Processing...
                  </>
                ) : editingId ? (
                  <>
                    <FaEdit />
                    Update Article
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News List */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaNewspaper className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">News Articles</h2>
              <p className="text-sm text-slate-500">
                {filteredNews.length} of {news.length} articles
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchNews}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* News Grid/Table */}
        {loading && !news.length ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSync className="animate-spin text-5xl text-blue-500 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Loading news articles...</p>
            </div>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {item.cover_image ? (
                    <img
                      src={
                        item.cover_image?.startsWith("/uploads")
                          ? `${API_BASE}${item.cover_image}`
                          : `${API_BASE}/uploads/${item.cover_image}`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-6xl text-slate-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 ${
                        item.publish_status
                          ? "bg-green-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {item.publish_status ? (
                        <>
                          <FaEye />
                          Published
                        </>
                      ) : (
                        <>
                          <FaEyeSlash />
                          Draft
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <FaCalendar />
                    <span>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "No date"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
              <FaNewspaper className="text-5xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Articles Found</h3>
            <p className="text-slate-600 mb-6 text-center max-w-md">
              {search || statusFilter !== "all"
                ? "No articles match your search criteria. Try adjusting your filters."
                : "Get started by creating your first news article."}
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FaPlus />
                Create First Article
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default NewsManagement;