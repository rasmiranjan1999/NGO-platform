import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";
import {
  FaCog,
  FaBuilding,
  FaImage,
  FaUsers,
  FaShareAlt,
  FaInfoCircle,
  FaSave,
  FaSync,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaUserTie,
  FaUpload,
  FaEye,
} from "react-icons/fa";

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Image upload states
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [presidentPhoto, setPresidentPhoto] = useState(null);
  const [secretaryPhoto, setSecretaryPhoto] = useState(null);

  // Image preview states
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [presidentPhotoPreview, setPresidentPhotoPreview] = useState(null);
  const [secretaryPhotoPreview, setSecretaryPhotoPreview] = useState(null);

  const [settings, setSettings] = useState({
    ngo_name: "",
    registration_number: "",
    phone: "",
    email: "",
    address: "",
    map_location: "",
    history: "",
    vision: "",
    mission: "",
    logo: "",
    favicon: "",
    president_photo: "",
    president_message: "",
    secretary_photo: "",
    secretary_message: "",
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    linkedin: "",
  });

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FaBuilding },
    { id: "branding", label: "Branding", icon: FaImage },
    { id: "about", label: "About Us", icon: FaInfoCircle },
    { id: "messages", label: "Messages", icon: FaUserTie },
    { id: "social", label: "Social Media", icon: FaShareAlt },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/settings");
      if (response.data.data) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error(error);
      showNotification("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file, setFile, setPreview) => {
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let payload = { ...settings };

      // Upload Logo
      if (logoFile) {
        const formData = new FormData();
        formData.append("image", logoFile);
        const response = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        payload.logo = response.data.data.url;
      }

      // Upload Favicon
      if (faviconFile) {
        const formData = new FormData();
        formData.append("image", faviconFile);
        const response = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        payload.favicon = response.data.data.url;
      }

      // Upload President Photo
      if (presidentPhoto) {
        const formData = new FormData();
        formData.append("image", presidentPhoto);
        const response = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        payload.president_photo = response.data.data.url;
      }

      // Upload Secretary Photo
      if (secretaryPhoto) {
        const formData = new FormData();
        formData.append("image", secretaryPhoto);
        const response = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        payload.secretary_photo = response.data.data.url;
      }

      await api.put("/settings", payload);
      showNotification("Settings updated successfully!");
      
      // Clear file states
      setLogoFile(null);
      setFaviconFile(null);
      setPresidentPhoto(null);
      setSecretaryPhoto(null);
      setLogoPreview(null);
      setFaviconPreview(null);
      setPresidentPhotoPreview(null);
      setSecretaryPhotoPreview(null);
      
      fetchSettings();
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-8">
      
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
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaCog className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Website Settings
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Configure your organization's website information and preferences
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all flex items-center gap-2 font-medium text-slate-700 shadow-md"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-b-4 border-emerald-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="text-lg" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Basic Information</h2>
                  <p className="text-sm text-slate-500">Organization details and contact information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    NGO Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter organization name..."
                    value={settings.ngo_name || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ngo_name: e.target.value,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter registration number..."
                    value={settings.registration_number || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        registration_number: e.target.value,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter phone number..."
                      value={settings.phone || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          phone: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter email address..."
                      value={settings.email || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-400" />
                  <textarea
                    rows="3"
                    placeholder="Enter full address..."
                    value={settings.address || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        address: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Google Maps Location Link
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="Enter Google Maps share link (e.g., https://maps.app.goo.gl/...)"
                    value={settings.map_location || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        map_location: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  💡 Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Maps</a> → Find your location → Click "Share" → Copy link
                </p>
              </div>
            </div>
          )}
          {/* Branding Tab */}
          {activeTab === "branding" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <FaImage className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Branding Assets</h2>
                  <p className="text-sm text-slate-500">Upload your logo and favicon</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization Logo
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-emerald-500 transition-colors bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(
                          e.target.files[0],
                          setLogoFile,
                          setLogoPreview
                        )
                      }
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FaUpload className="text-4xl text-slate-400 mb-3" />
                      <span className="text-sm text-slate-600 font-medium mb-1">
                        Click to upload logo
                      </span>
                      <span className="text-xs text-slate-400">
                        PNG, JPG (Recommended: 200x200px)
                      </span>
                    </label>
                  </div>

                  {/* Logo Preview */}
                  {(logoPreview || settings.logo) && (
                    <div className="mt-4 p-4 bg-white rounded-xl border-2 border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Current Logo</span>
                        {logoPreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview(null);
                            }}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
                        <img
                          src={logoPreview || `${API_BASE}${settings.logo}`}
                          alt="Logo"
                          className="max-w-full h-32 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Favicon Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Favicon
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-emerald-500 transition-colors bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(
                          e.target.files[0],
                          setFaviconFile,
                          setFaviconPreview
                        )
                      }
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label
                      htmlFor="favicon-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FaUpload className="text-4xl text-slate-400 mb-3" />
                      <span className="text-sm text-slate-600 font-medium mb-1">
                        Click to upload favicon
                      </span>
                      <span className="text-xs text-slate-400">
                        ICO, PNG (Recommended: 32x32px)
                      </span>
                    </label>
                  </div>

                  {/* Favicon Preview */}
                  {(faviconPreview || settings.favicon) && (
                    <div className="mt-4 p-4 bg-white rounded-xl border-2 border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Current Favicon</span>
                        {faviconPreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setFaviconFile(null);
                              setFaviconPreview(null);
                            }}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
                        <img
                          src={faviconPreview || `${API_BASE}${settings.favicon}`}
                          alt="Favicon"
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* About Us Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <FaInfoCircle className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">About Us</h2>
                  <p className="text-sm text-slate-500">Organization mission, vision, and history</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mission Statement
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter your organization's mission..."
                    value={settings.mission || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mission: e.target.value,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vision Statement
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter your organization's vision..."
                    value={settings.vision || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        vision: e.target.value,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization History
                  </label>
                  <textarea
                    rows="6"
                    placeholder="Enter your organization's history and background..."
                    value={settings.history || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        history: e.target.value,
                      })
                    }
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <FaUserTie className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Leadership Messages</h2>
                  <p className="text-sm text-slate-500">Messages from your organization's leaders</p>
                </div>
              </div>

              {/* President Message */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FaUserTie className="text-blue-600" />
                  President's Message
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      President Photo
                    </label>
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 hover:border-blue-500 transition-colors bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e.target.files[0],
                            setPresidentPhoto,
                            setPresidentPhotoPreview
                          )
                        }
                        className="hidden"
                        id="president-photo-upload"
                      />
                      <label
                        htmlFor="president-photo-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FaUpload className="text-3xl text-blue-400 mb-2" />
                        <span className="text-sm text-slate-600">Upload president's photo</span>
                      </label>
                    </div>

                    {(presidentPhotoPreview || settings.president_photo) && (
                      <div className="mt-4 flex justify-center">
                        <div className="relative">
                          <img
                            src={
                              presidentPhotoPreview ||
                              `${API_BASE}${settings.president_photo}`
                            }
                            alt="President"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          {presidentPhotoPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setPresidentPhoto(null);
                                setPresidentPhotoPreview(null);
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      President's Message
                    </label>
                    <textarea
                      rows="6"
                      placeholder="Enter president's message to visitors..."
                      value={settings.president_message || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          president_message: e.target.value,
                        })
                      }
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Secretary Message */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FaUserTie className="text-green-600" />
                  Secretary's Message
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Secretary Photo
                    </label>
                    <div className="border-2 border-dashed border-green-300 rounded-xl p-6 hover:border-green-500 transition-colors bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e.target.files[0],
                            setSecretaryPhoto,
                            setSecretaryPhotoPreview
                          )
                        }
                        className="hidden"
                        id="secretary-photo-upload"
                      />
                      <label
                        htmlFor="secretary-photo-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FaUpload className="text-3xl text-green-400 mb-2" />
                        <span className="text-sm text-slate-600">Upload secretary's photo</span>
                      </label>
                    </div>

                    {(secretaryPhotoPreview || settings.secretary_photo) && (
                      <div className="mt-4 flex justify-center">
                        <div className="relative">
                          <img
                            src={
                              secretaryPhotoPreview ||
                              `${API_BASE}${settings.secretary_photo}`
                            }
                            alt="Secretary"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          {secretaryPhotoPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setSecretaryPhoto(null);
                                setSecretaryPhotoPreview(null);
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Secretary's Message
                    </label>
                    <textarea
                      rows="6"
                      placeholder="Enter secretary's message to visitors..."
                      value={settings.secretary_message || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          secretary_message: e.target.value,
                        })
                      }
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <FaShareAlt className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Social Media Links</h2>
                  <p className="text-sm text-slate-500">Connect your social media profiles</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Facebook
                  </label>
                  <div className="relative">
                    <FaFacebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
                    <input
                      type="url"
                      placeholder="https://facebook.com/your-page"
                      value={settings.facebook || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          facebook: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Instagram
                  </label>
                  <div className="relative">
                    <FaInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600 text-xl" />
                    <input
                      type="url"
                      placeholder="https://instagram.com/your-profile"
                      value={settings.instagram || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          instagram: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    YouTube
                  </label>
                  <div className="relative">
                    <FaYoutube className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 text-xl" />
                    <input
                      type="url"
                      placeholder="https://youtube.com/your-channel"
                      value={settings.youtube || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          youtube: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Twitter
                  </label>
                  <div className="relative">
                    <FaTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 text-xl" />
                    <input
                      type="url"
                      placeholder="https://twitter.com/your-handle"
                      value={settings.twitter || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          twitter: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 text-xl" />
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/your-company"
                      value={settings.linkedin || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          linkedin: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-4 pt-6 border-t border-slate-200 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSync className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;