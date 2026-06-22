import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config";

const ContactPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/settings`);
      const data = await response.json();
      setSettings(data.data || {});
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        // Redirect to thank you page
        navigate("/thank-you", { state: { source: "contact" } });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
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
              We're Here to Help
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Get in Touch
          </h1>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="relative py-20 -mt-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {settings.email && (
              <div className="tilt-card bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-xl text-[#122B22] mb-2">Email Us</h3>
                <a href={`mailto:${settings.email}`} className="text-[#FF6B4A] hover:underline break-all">
                  {settings.email}
                </a>
              </div>
            )}

            {settings.phone && (
              <div className="tilt-card bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-xl text-[#122B22] mb-2">Call Us</h3>
                <a href={`tel:${settings.phone}`} className="text-[#4ABFA8] hover:underline">
                  {settings.phone}
                </a>
              </div>
            )}

            {settings.address && (
              <div className="tilt-card bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D98E32] to-[#C77A2E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-xl text-[#122B22] mb-2">Visit Us</h3>
                <p className="text-gray-600">{settings.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GOOGLE MAP SECTION */}
      {settings.map_location && (
        <section className="py-12 bg-gray-50">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl text-[#122B22] mb-3">
                Find Us on <span className="gradient-text">Map</span>
              </h2>
              <p className="text-gray-600">Click the map to open in Google Maps and get directions</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden">
              {/* Clickable Map Preview */}
              <a
                href={settings.map_location}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group cursor-pointer"
              >
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#122B22] to-[#1F4D3D]">
                  {/* Map placeholder with location icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <svg className="w-20 h-20 mb-4 text-[#4ABFA8] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">Our Location</h3>
                    <p className="text-white/80 text-center max-w-md px-4 mb-4">
                      {settings.address || "Click to view our location on Google Maps"}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 group-hover:bg-white/20 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="font-semibold">Click to Open in Google Maps</span>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4ABFA8]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={settings.map_location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4ABFA8] to-[#3A9B88] text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Open in Google Maps
                </a>
                
                <a
                  href={settings.map_location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#122B22] rounded-full font-semibold border-2 border-[#4ABFA8] hover:bg-[#4ABFA8] hover:text-white transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT FORM AND INFO */}
      <section className="py-20">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* LEFT - CONTACT FORM */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#122B22] mb-3">
                Send us a <span className="gradient-text">Message</span>
              </h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you shortly.</p>

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
                  ✓ Message sent successfully! We'll be in touch soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B4A] transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </form>
            </div>

            {/* RIGHT - ADDITIONAL INFO */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#122B22] to-[#1F4D3D] rounded-3xl p-8 lg:p-10 text-white shadow-xl">
                <h3 className="font-display font-bold text-2xl mb-4">Why Contact Us?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#4ABFA8] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-white/90">Learn about volunteer opportunities and how you can help</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#4ABFA8] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-white/90">Get information about our programs and initiatives</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#4ABFA8] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-white/90">Partner with us for community development projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#4ABFA8] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-white/90">Request information about membership and donations</span>
                  </li>
                </ul>
              </div>

              {/* SOCIAL MEDIA LINKS */}
              {(settings.facebook || settings.instagram || settings.youtube || settings.linkedin) && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <h3 className="font-display font-bold text-2xl text-[#122B22] mb-6">Connect With Us</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {settings.facebook && (
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                      >
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="font-semibold text-blue-600 group-hover:text-blue-700">Facebook</span>
                      </a>
                    )}

                    {settings.instagram && (
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors group"
                      >
                        <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="font-semibold text-pink-600 group-hover:text-pink-700">Instagram</span>
                      </a>
                    )}

                    {settings.youtube && (
                      <a
                        href={settings.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group"
                      >
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="font-semibold text-red-600 group-hover:text-red-700">YouTube</span>
                      </a>
                    )}

                    {settings.linkedin && (
                      <a
                        href={settings.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                      >
                        <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span className="font-semibold text-blue-700 group-hover:text-blue-800">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
