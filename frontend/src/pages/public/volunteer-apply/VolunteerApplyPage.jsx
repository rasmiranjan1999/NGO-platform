import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config";
import { useSettings } from "../../../context/SettingsContext";

const VolunteerApplyPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    education: "",
    occupation: "",
    blood_group: "",
    reason: "",
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch(`${API_BASE}/api/volunteers/apply`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Redirect to thank you page
        navigate("/thank-you", { state: { source: "volunteer" } });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-body text-[#2D2A26] bg-gradient-to-b from-[#FFFDF9] via-white to-[#F7F5F0] selection:bg-[#FF6B4A] selection:text-white min-h-screen">
      <style>{`
        .font-body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        .font-display { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        
        @media (prefers-reduced-motion: no-preference) {
          .blob { animation: drift 20s ease-in-out infinite; }
          .blob-slow { animation: drift 30s ease-in-out infinite reverse; }
          .tilt-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
          .tilt-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-30px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.95); }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FF6B4A 0%, #D98E32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* HERO SECTION - Minimal Header */}
      <section className="relative w-full bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-[#F7F5F0] border-b border-[#1F4D3D] py-7 sm:py-8">
        <div className="relative w-full max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3 justify-center">
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
            <p className="text-xs uppercase tracking-[0.25em] font-medium text-[#D98E32]">
              Join Our Community
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Become a Volunteer
          </h1>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="relative py-20 -mt-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="tilt-card bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-[#122B22] mb-2">Make an Impact</h3>
              <p className="text-gray-600 text-sm">Create meaningful change in your community</p>
            </div>

            <div className="tilt-card bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-[#122B22] mb-2">Build Network</h3>
              <p className="text-gray-600 text-sm">Connect with like-minded individuals</p>
            </div>

            <div className="tilt-card bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D98E32] to-[#C77A2E] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-[#122B22] mb-2">Gain Skills</h3>
              <p className="text-gray-600 text-sm">Develop new abilities and experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="py-20">
        <div className="w-full max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#122B22] mb-3">
              Registration <span className="gradient-text">Form</span>
            </h2>
            <p className="text-gray-600 mb-8">Fill in your details to join our volunteer community</p>

            {success && (
              <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <h4 className="font-bold mb-1">Application Submitted Successfully!</h4>
                    <p className="text-sm">Thank you for your interest. We'll review your application and get back to you soon.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                  <input
                    type="text"
                    placeholder="B.Tech, MBA, etc."
                    value={form.education}
                    onChange={(e) => setForm({ ...form, education: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                  <input
                    type="text"
                    placeholder="Student, Professional, etc."
                    value={form.occupation}
                    onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                  <select
                    value={form.blood_group}
                    onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors"
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Photo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FF6B4A] transition-colors">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        {photo ? photo.name : "Click to upload photo"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-xl border-4 border-white shadow-lg"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Your full address..."
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Why do you want to join {settings?.ngo_name || "our organization"}? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="5"
                  placeholder="Share your motivation and what drives you to volunteer..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting Application..." : "Submit Application →"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VolunteerApplyPage;
