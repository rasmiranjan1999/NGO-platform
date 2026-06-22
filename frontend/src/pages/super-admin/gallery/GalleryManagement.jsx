import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";
import {
  FaImages,
  FaPlus,
  FaFolder,
  FaUpload,
  FaTrash,
  FaEdit,
  FaCalendar,
  FaImage,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
  FaSearch,
  FaEye,
  FaDownload,
  FaChartLine,
  FaFolderOpen,
} from "react-icons/fa";

const GalleryManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumDetails, setAlbumDetails] = useState(null);
  const [albumForm, setAlbumForm] = useState({
    title: "",
    event_date: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [viewMode, setViewMode] = useState("albums"); // 'albums' or 'images'

  useEffect(() => {
    fetchAlbums();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await api.get("/gallery/albums");
      setAlbums(response.data.data || []);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load albums", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbumDetails = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/gallery/albums/${id}`);
      setAlbumDetails(response.data);
      setSelectedAlbum(id);
      setViewMode("images");
    } catch (error) {
      console.error(error);
      showNotification("Failed to load album details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviewImages(previews);
  };

  const removePreviewImage = (index) => {
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setSelectedImages(newSelectedImages);
    setPreviewImages(newPreviews);
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAlbum) {
        await api.put(`/gallery/albums/${editingAlbum}`, albumForm);
        showNotification("Album updated successfully!");
      } else {
        await api.post("/gallery/albums", albumForm);
        showNotification("Album created successfully!");
      }
      setAlbumForm({ title: "", event_date: "" });
      setShowAlbumForm(false);
      setEditingAlbum(null);
      fetchAlbums();
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

  const uploadImages = async (e) => {
    e.preventDefault();

    if (!selectedAlbum || selectedImages.length === 0) {
      showNotification("Please select album and images", "error");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      const uploadResponse = await api.post("/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const uploadedImages = uploadResponse.data.data;

      for (const img of uploadedImages) {
        await api.post("/gallery/images", {
          album_id: selectedAlbum,
          image: img.url,
          title: img.originalname,
        });
      }

      fetchAlbumDetails(selectedAlbum);
      setSelectedImages([]);
      setPreviewImages([]);
      setUploadProgress(0);
      showNotification(`${uploadedImages.length} images uploaded successfully!`);
    } catch (error) {
      console.error(error);
      showNotification("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await api.delete(`/gallery/images/${id}`);
      fetchAlbumDetails(selectedAlbum);
      showNotification("Image deleted successfully!");
    } catch (error) {
      console.error(error);
      showNotification("Delete failed", "error");
    }
  };

  const deleteAlbum = async (id) => {
    if (!window.confirm("Delete Album and all images?")) return;

    try {
      await api.delete(`/gallery/albums/${id}`);
      fetchAlbums();
      if (selectedAlbum === id) {
        setAlbumDetails(null);
        setSelectedAlbum(null);
        setViewMode("albums");
      }
      showNotification("Album deleted successfully!");
    } catch (error) {
      console.error(error);
      showNotification("Delete failed", "error");
    }
  };

  const handleEditAlbum = (album) => {
    setEditingAlbum(album.id);
    setAlbumForm({
      title: album.title,
      event_date: album.event_date,
    });
    setShowAlbumForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAlbumForm = () => {
    setAlbumForm({ title: "", event_date: "" });
    setShowAlbumForm(false);
    setEditingAlbum(null);
  };

  const filteredAlbums = albums.filter((album) =>
    album.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalImages = albums.reduce((sum, album) => sum + (album.total_images || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
      
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaImages className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Gallery Management
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Organize and manage your photo albums and images
              </p>
            </div>
          </div>

          {/* View Toggle */}
          {albumDetails && (
            <button
              onClick={() => {
                setViewMode("albums");
                setAlbumDetails(null);
                setSelectedAlbum(null);
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all flex items-center gap-2 font-medium text-slate-700"
            >
              <FaFolder />
              Back to Albums
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Albums</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{albums.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaFolder className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaChartLine className="text-purple-500" />
            <span>All collections</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Images</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">{totalImages}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaImage className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaImages className="text-pink-500" />
            <span>All photos</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Current Album</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {albumDetails?.images?.length || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaFolderOpen className="text-white text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <FaEye className="text-indigo-500" />
            <span>Images in view</span>
          </div>
        </div>

        <div
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setShowAlbumForm(!showAlbumForm)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Quick Action</p>
              <p className="text-2xl font-bold mt-2">
                {showAlbumForm ? "Hide Form" : "New Album"}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {showAlbumForm ? (
                <FaTimes className="text-white text-2xl" />
              ) : (
                <FaPlus className="text-white text-2xl" />
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-100">
            Click to {showAlbumForm ? "close" : "create album"}
          </div>
        </div>
      </div>

      {/* Album Form */}
      {showAlbumForm && viewMode === "albums" && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                {editingAlbum ? (
                  <FaEdit className="text-white text-lg" />
                ) : (
                  <FaPlus className="text-white text-lg" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {editingAlbum ? "Update Album" : "Create New Album"}
              </h2>
            </div>
            <button
              onClick={resetAlbumForm}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <FaTimes />
              {editingAlbum ? "Cancel Edit" : "Close"}
            </button>
          </div>

          <form onSubmit={createAlbum} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Album Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter album title..."
                  required
                  value={albumForm.title}
                  onChange={(e) =>
                    setAlbumForm({
                      ...albumForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={albumForm.event_date}
                    onChange={(e) =>
                      setAlbumForm({
                        ...albumForm,
                        event_date: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSync className="animate-spin" />
                  Processing...
                </>
              ) : editingAlbum ? (
                <>
                  <FaEdit />
                  Update Album
                </>
              ) : (
                <>
                  <FaPlus />
                  Create Album
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Albums Grid */}
      {viewMode === "albums" && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <FaFolder className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Photo Albums</h2>
                <p className="text-sm text-slate-500">
                  {filteredAlbums.length} of {albums.length} albums
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search albums..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <button
                onClick={fetchAlbums}
                disabled={loading}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {loading && !albums.length ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <FaSync className="animate-spin text-5xl text-purple-500 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Loading albums...</p>
              </div>
            </div>
          ) : filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all duration-300"
                >
                  {/* Album Cover */}
                  <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden cursor-pointer"
                    onClick={() => fetchAlbumDetails(album.id)}
                  >
                    {album.cover_image ? (
                      <img
                        src={`${API_BASE}${album.cover_image}`}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <FaImage className="text-6xl text-slate-300 mb-2" />
                        <span className="text-slate-400 text-sm">No cover image</span>
                      </div>
                    )}
                    
                    {/* Image Count Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1.5 bg-purple-500 text-white rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
                        <FaImages />
                        {album.total_images || 0}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <FaEye />
                        View Album
                      </button>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {album.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <FaCalendar className="text-purple-500" />
                      <span>
                        {new Date(album.event_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAlbum(album)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAlbum(album.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
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
                <FaFolder className="text-5xl text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Albums Found</h3>
              <p className="text-slate-600 mb-6 text-center max-w-md">
                {searchTerm
                  ? "No albums match your search criteria."
                  : "Get started by creating your first photo album."}
              </p>
              {!showAlbumForm && (
                <button
                  onClick={() => setShowAlbumForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <FaPlus />
                  Create First Album
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Album Detail - Image Management */}
      {viewMode === "images" && albumDetails && (
        <div className="space-y-6">
          {/* Album Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaFolderOpen className="text-white text-3xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    {albumDetails.album.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendar className="text-purple-500" />
                      {new Date(albumDetails.album.event_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <FaImages className="text-pink-500" />
                      {albumDetails.images.length} images
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <FaUpload className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Upload Images</h3>
            </div>

            <form onSubmit={uploadImages} className="space-y-6">
              {/* File Input */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-purple-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <FaImage className="text-6xl text-slate-400 mb-4" />
                  <span className="text-lg font-semibold text-slate-700 mb-2">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-sm text-slate-500">
                    PNG, JPG, GIF up to 10MB each (Maximum 20 images)
                  </span>
                </label>
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-700">
                      Selected Images ({previewImages.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImages([]);
                        setPreviewImages([]);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-32 object-cover rounded-xl border-2 border-slate-200 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removePreviewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded truncate">
                          {preview.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="submit"
                disabled={loading || selectedImages.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSync className="animate-spin" />
                    Uploading {selectedImages.length} images...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload {selectedImages.length > 0 ? `${selectedImages.length} ` : ""}Images
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Images Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <FaImages className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Album Images ({albumDetails.images.length})
              </h3>
            </div>

            {albumDetails.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {albumDetails.images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-slate-100">
                      <img
                        src={`${API_BASE}${image.image}`}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white text-sm font-medium mb-3 line-clamp-2">
                        {image.title}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`${API_BASE}${image.image}`, '_blank')}
                          className="flex-1 bg-white/90 hover:bg-white text-purple-600 px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <FaEye />
                          View
                        </button>
                        <button
                          onClick={() => deleteImage(image.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
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
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                  <FaImage className="text-5xl text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Images Yet</h3>
                <p className="text-slate-600 text-center max-w-md">
                  Upload your first images to this album using the form above.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryManagement;