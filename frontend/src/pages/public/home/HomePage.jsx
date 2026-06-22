import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../config";

// Advanced CountUp with smooth animation
const CountUp = ({ value, duration = 2000, prefix = "", suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useRef(false);

  const animateTo = (target) => {
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(target * easeOut));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (inView.current) animateTo(Number(value) || 0);
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView.current) {
          inView.current = true;
          animateTo(Number(value) || 0);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const HomePage = () => {
  const [settings, setSettings] = useState({});
  const [activities, setActivities] = useState([]);
  const [news, setNews] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState({});
  const [team, setTeam] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchHomeData();
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      const [settingsRes, activityRes, newsRes, volunteerRes, statsRes, teamRes, galleryRes] =
        await Promise.all([
          fetch(`${API_BASE}/api/settings`, { cache: 'no-store' }),
          fetch(`${API_BASE}/api/activities`, { cache: 'no-store' }),
          fetch(`${API_BASE}/api/news/latest`, { cache: 'no-store' }),
          fetch(`${API_BASE}/api/volunteers/public`, { cache: 'no-store' }),
          fetch(`${API_BASE}/api/dashboard/public-stats`, { cache: 'no-store' }),
          fetch(`${API_BASE}/api/team`, { cache: 'no-store' }),
          fetch(`${API_BASE}/api/gallery/recent`, { cache: 'no-store' }),
        ]);

      const settingsData = await settingsRes.json();
      const activityData = await activityRes.json();
      const newsData = await newsRes.json();
      const volunteerData = await volunteerRes.json();
      const statsData = await statsRes.json();
      const teamData = await teamRes.json();
      const galleryData = await galleryRes.json();

      setSettings(settingsData.data || {});
      setActivities(activityData.data || []);
      setNews(newsData.data || []);
      setVolunteers(volunteerData.data || []);
      setStats(statsData.data || {});
      setTeam(teamData.data || []);
      setGalleryImages(galleryData.data || []);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (volunteers.length > 0) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % Math.min(volunteers.length, 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [volunteers]);

  // Auto-rotate gallery background images
  useEffect(() => {
    if (galleryImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % Math.min(galleryImages.length, 5));
      }, 4000); // Change image every 4 seconds
      return () => clearInterval(interval);
    }
  }, [galleryImages]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full font-body text-[#2D2A26] bg-gradient-to-b from-[#FFFDF9] via-white to-[#F7F5F0] selection:bg-[#FF6B4A] selection:text-white overflow-x-hidden">
      <style>{`
        .font-body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        .font-display { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }

        @media (prefers-reduced-motion: no-preference) {
          .blob { animation: drift 20s ease-in-out infinite; }
          .blob-slow { animation: drift 30s ease-in-out infinite reverse; }
          .reveal { animation: riseIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
          .fade-in { animation: fadeIn 1s ease-out both; }
          .slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
          .scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
          .wiggle:hover { animation: wiggle 0.5s ease-in-out; }
          .float { animation: float 6s ease-in-out infinite; }
          .pulse-ring { animation: pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite; }
          .marquee-track { animation: marquee 40s linear infinite; }
          .glow { animation: glow 3s ease-in-out infinite alternate; }
          .rotate-slow { animation: rotate 60s linear infinite; }
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0,0) scale(1) rotate(0deg); }
          33% { transform: translate(30px,-30px) scale(1.1) rotate(120deg); }
          66% { transform: translate(-20px,20px) scale(0.95) rotate(240deg); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-3deg) scale(1.05); }
          75% { transform: rotate(3deg) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(255,107,74,0.3), 0 0 40px rgba(255,107,74,0.1); }
          to { box-shadow: 0 0 30px rgba(255,107,74,0.5), 0 0 60px rgba(255,107,74,0.2); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes kenburns {
          0% { transform: scale(1.2) translate(0, 0); }
          100% { transform: scale(1) translate(-5%, -5%); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
        
        .tilt-card { 
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          transform-style: preserve-3d;
        }
        .tilt-card:hover { 
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .shimmer { 
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #FF6B4A 0%, #D98E32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* HERO SECTION WITH GALLERY BACKGROUND - Compact */}
      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Gallery Background Slideshow - Only show if images exist */}
        {galleryImages && galleryImages.length > 0 ? (
          <div className="absolute inset-0">
            {galleryImages.slice(0, 5).map((image, index) => (
              <div
                key={image.id || index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  zIndex: currentImageIndex === index ? 1 : 0,
                }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${API_BASE}${image.image})`,
                    animation: currentImageIndex === index ? 'kenburns 4s ease-out forwards' : 'none',
                  }}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
              </div>
            ))}
            
            {/* Bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent z-[2]" />
          </div>
        ) : (
          /* Loading state or no images message */
          <div className="absolute inset-0 bg-gradient-to-br from-[#122B22] via-[#1F4D3D] to-[#0A1813] flex items-center justify-center">
            <div className="text-center text-white/60">
              <p className="text-lg">Loading gallery images...</p>
            </div>
          </div>
        )}

        {/* Content Overlay - Compact */}
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 z-10">
          {/* Logo - Compact Circular */}
          <div className="flex items-center justify-center mb-3 sm:mb-4 reveal">
            <div className="relative">
              {settings.logo ? (
                <img 
                  src={`${API_BASE}${settings.logo}`} 
                  alt={settings.ngo_name || "Organization Logo"} 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover shadow-2xl ring-2 ring-white/30 backdrop-blur-sm bg-white/10" 
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] shadow-2xl ring-2 ring-white/30 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  {settings.ngo_name?.charAt(0) || "O"}
                </div>
              )}
              <div className="absolute -inset-1 bg-gradient-to-br from-[#FF6B4A]/40 to-[#4ABFA8]/40 rounded-full blur-md opacity-60 pulse-ring" />
            </div>
          </div>

          {/* Organization Name */}
          {settings.ngo_name && (
            <div className="flex justify-center mb-2 sm:mb-3 fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center drop-shadow-lg px-4">
                {settings.ngo_name}
              </h2>
            </div>
          )}

          {/* Registration Number Badge */}
          {settings.registration_number && (
            <div className="flex justify-center mb-4 sm:mb-5 fade-in" style={{animationDelay: '0.3s'}}>
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                <span className="w-1.5 h-1.5 bg-[#4ABFA8] rounded-full animate-pulse" />
                <span className="text-[10px] sm:text-xs font-medium">Reg. No: {settings.registration_number}</span>
              </div>
            </div>
          )}

          {/* Main Heading - Compact */}
          <div className="text-center px-4">
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 sm:mb-4 reveal drop-shadow-2xl" style={{animationDelay: '0.4s'}}>
              Small Acts,
              <br />
              <span className="bg-gradient-to-r from-[#FFE8B5] via-[#FF6B4A] to-[#4ABFA8] bg-clip-text text-transparent drop-shadow-none">
                Big Change
              </span>
              <br />
              Together
            </h1>

            {/* Subtitle - Compact */}
            <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto mb-5 sm:mb-6 leading-relaxed fade-in drop-shadow-lg px-2" style={{animationDelay: '0.6s'}}>
              Empowering communities through compassion, action, and sustainable development. Join us in making a lasting difference.
            </p>

            {/* Call to Action Buttons - Compact */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 slide-up px-4" style={{animationDelay: '0.8s'}}>
              <Link 
                to="/volunteer-apply" 
                className="w-full sm:w-auto group bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-2xl hover:shadow-[#FF6B4A]/50 transition-all duration-300 hover:scale-105 glow text-center"
              >
                Become a Volunteer
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link 
                to="/about" 
                className="w-full sm:w-auto bg-white/15 backdrop-blur-md text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm border-2 border-white/40 hover:bg-white/25 transition-all duration-300 hover:scale-105 shadow-xl text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Gallery Navigation Dots */}
        {galleryImages && galleryImages.length > 0 && (
          <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {galleryImages.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentImageIndex === index 
                    ? 'w-6 bg-white' 
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* STATS SECTION */}
      <section className="relative py-20 -mt-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  label: "Volunteers", 
                  value: stats.volunteers || 0, 
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                    </svg>
                  ),
                  color: "from-[#FF6B4A] to-[#D98E32]" 
                },
                { 
                  label: "Activities", 
                  value: stats.activities || 0, 
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  ),
                  color: "from-[#4ABFA8] to-[#3A9B88]" 
                },
                { 
                  label: "Members", 
                  value: stats.members || 0, 
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  ),
                  color: "from-[#D98E32] to-[#C77A2E]" 
                },
                { 
                  label: "Team Members", 
                  value: stats.team_members || 0, 
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ),
                  color: "from-[#FFE8B5] to-[#D98E32]" 
                },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className={`text-white mb-3 inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className={`font-display font-bold text-4xl lg:text-5xl mb-2 gradient-text bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    <CountUp value={stat.value} suffix="+" />
                  </div>
                  <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F7F5F0]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-6xl text-[#122B22] mb-4">
              Our <span className="gradient-text">Purpose</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Driven by compassion, guided by purpose, united for change
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="tilt-card bg-white rounded-3xl p-10 border border-gray-100 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] rounded-2xl flex items-center justify-center mb-6 float">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-display font-bold text-3xl text-[#122B22] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {settings.mission || "To empower communities through sustainable development, education, and compassionate action, creating lasting positive change for those in need."}
              </p>
            </div>

            <div className="tilt-card bg-white rounded-3xl p-10 border border-gray-100 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] rounded-2xl flex items-center justify-center mb-6 float" style={{animationDelay: '0.5s'}}>
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-display font-bold text-3xl text-[#122B22] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {settings.vision || "A world where every individual has access to opportunities, resources, and support to thrive, building resilient and compassionate communities."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITIES */}
      <section className="py-20">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display font-bold text-4xl lg:text-6xl text-[#122B22] mb-3">
                Recent <span className="gradient-text">Activities</span>
              </h2>
              <p className="text-lg text-gray-600">Making a difference, one step at a time</p>
            </div>
            <Link to="/activities" className="hidden sm:inline-flex items-center gap-2 text-[#FF6B4A] font-semibold hover:gap-4 transition-all">
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="shimmer h-56 w-full" />
                  <div className="p-6">
                    <div className="shimmer h-6 w-3/4 mb-3 rounded" />
                    <div className="shimmer h-4 w-full mb-2 rounded" />
                    <div className="shimmer h-4 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.slice(0, 3).map((activity, index) => (
                <Link
                  key={activity.id}
                  to={`/activities/${activity.slug || activity.id}`}
                  className="tilt-card bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    {activity.cover_image ? (
                      <img 
                        src={`${API_BASE}${activity.cover_image}`} 
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FF6B4A] to-[#D98E32]" />
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#122B22]">
                      {new Date(activity.activity_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-2xl text-[#122B22] mb-3 group-hover:text-[#FF6B4A] transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {activity.description}
                    </p>
                    <div className="flex items-center text-[#FF6B4A] font-semibold group-hover:gap-3 transition-all">
                      Read More <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-6xl mb-4 inline-block">📋</span>
              <p className="text-gray-500 text-lg">No activities yet</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/activities" className="inline-flex items-center gap-2 text-[#FF6B4A] font-semibold hover:gap-4 transition-all">
              View All Activities <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F7F5F0]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-6xl text-[#122B22] mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dedicated leaders working tirelessly to create positive change
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-lg">
                  <div className="shimmer w-32 h-32 rounded-full mx-auto mb-4" />
                  <div className="shimmer h-5 w-3/4 mx-auto mb-2 rounded" />
                  <div className="shimmer h-4 w-1/2 mx-auto rounded" />
                </div>
              ))}
            </div>
          ) : team.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.slice(0, 4).map((member, index) => (
                <div
                  key={member.id}
                  className="tilt-card bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative inline-block mb-4">
                    {member.photo ? (
                      <img
                        src={`${API_BASE}${member.photo}`}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl group-hover:ring-[#FF6B4A] transition-all"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] ring-4 ring-white shadow-xl" />
                    )}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      ✓
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#122B22] mb-1">{member.name}</h3>
                  <p className="text-[#FF6B4A] font-semibold mb-2">{member.position}</p>
                  {member.bio && <p className="text-gray-600 text-sm line-clamp-2">{member.bio}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-6xl mb-4 inline-block">👥</span>
              <p className="text-gray-500 text-lg">No team members yet</p>
            </div>
          )}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-20">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display font-bold text-4xl lg:text-6xl text-[#122B22] mb-3">
                Our <span className="gradient-text">Gallery</span>
              </h2>
              <p className="text-lg text-gray-600">Moments that inspire change</p>
            </div>
            <Link to="/gallery" className="hidden sm:inline-flex items-center gap-2 text-[#FF6B4A] font-semibold hover:gap-4 transition-all">
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="shimmer aspect-square rounded-2xl" />
              ))}
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.slice(0, 8).map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img
                    src={`${API_BASE}${image.image_url}`}
                    alt={image.title || "Gallery"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-semibold text-sm">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-6xl mb-4 inline-block">📸</span>
              <p className="text-gray-500 text-lg">No gallery images yet</p>
            </div>
          )}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F7F5F0]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display font-bold text-4xl lg:text-6xl text-[#122B22] mb-3">
                Latest <span className="gradient-text">News</span>
              </h2>
              <p className="text-lg text-gray-600">Stay updated with our latest announcements</p>
            </div>
            <Link to="/news" className="hidden sm:inline-flex items-center gap-2 text-[#FF6B4A] font-semibold hover:gap-4 transition-all">
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="shimmer h-48 w-full" />
                  <div className="p-6">
                    <div className="shimmer h-6 w-3/4 mb-3 rounded" />
                    <div className="shimmer h-4 w-full mb-2 rounded" />
                    <div className="shimmer h-4 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 3).map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug || item.id}`}
                  className="tilt-card bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.cover_image ? (
                      <img
                        src={`${API_BASE}${item.cover_image}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88]" />
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#122B22]">
                      {new Date(item.publish_date || item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-[#122B22] mb-3 group-hover:text-[#FF6B4A] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center text-[#FF6B4A] font-semibold text-sm group-hover:gap-3 transition-all">
                      Read More <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-6xl mb-4 inline-block">📰</span>
              <p className="text-gray-500 text-lg">No news articles yet</p>
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {volunteers.length > 0 && (
        <section className="py-20 bg-[#122B22] relative overflow-hidden">
          <div className="blob absolute top-0 right-0 w-96 h-96 bg-[#FF6B4A] opacity-10 rounded-full blur-3xl" />
          <div className="blob-slow absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4ABFA8] opacity-10 rounded-full blur-3xl" />
          
          <div className="relative w-full max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl lg:text-6xl text-white mb-4">
                Voices of <span className="gradient-text bg-gradient-to-r from-[#FFE8B5] to-[#FF6B4A] bg-clip-text text-transparent">Change</span>
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Hear from our dedicated volunteers making a difference
              </p>
            </div>

            <div className="relative">
              {volunteers.slice(0, 3).map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className={`transition-all duration-500 ${
                    index === activeTestimonial ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        {volunteer.photo ? (
                          <img
                            src={`${API_BASE}${volunteer.photo}`}
                            alt={volunteer.name}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shadow-xl"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] ring-4 ring-white/30 shadow-xl" />
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-6 italic">
                          "{volunteer.message || volunteer.skills || "Proud to be part of this amazing organization making real change in our community."}"
                        </p>
                        <div>
                          <h4 className="font-display font-bold text-xl text-white mb-1">{volunteer.name}</h4>
                          <p className="text-white/60">Volunteer • {volunteer.volunteer_id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center gap-2 mt-8">
                {volunteers.slice(0, 3).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeTestimonial ? "w-8 bg-[#FF6B4A]" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CALL TO ACTION */}
      <section className="py-20">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] rounded-3xl p-12 lg:p-20 overflow-hidden shadow-2xl">
            <div className="blob absolute -top-20 -right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="blob-slow absolute -bottom-20 -left-20 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl" />
            
            <div className="relative text-center text-white">
              <h2 className="font-display font-bold text-4xl lg:text-6xl mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-10">
                Join our community of passionate volunteers and be part of something bigger. Every action counts.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to="/volunteer-apply" 
                  className="group bg-white text-[#FF6B4A] px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105"
                >
                  Become a Volunteer
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-20 bg-[#F7F5F0]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {settings.email && (
              <div className="tilt-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📧</span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#122B22] mb-2">Email Us</h3>
                <a href={`mailto:${settings.email}`} className="text-[#FF6B4A] hover:underline break-all">
                  {settings.email}
                </a>
              </div>
            )}

            {settings.phone && (
              <div className="tilt-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📞</span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#122B22] mb-2">Call Us</h3>
                <a href={`tel:${settings.phone}`} className="text-[#4ABFA8] hover:underline">
                  {settings.phone}
                </a>
              </div>
            )}

            {settings.address && (
              <div className="tilt-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D98E32] to-[#C77A2E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📍</span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#122B22] mb-2">Visit Us</h3>
                <p className="text-gray-600">{settings.address}</p>
              </div>
            )}
          </div>

          {/* Location Map Card - Same Style */}
          {settings.map_location && (
            <div className="mt-8 flex justify-center">
              <a
                href={settings.map_location}
                target="_blank"
                rel="noopener noreferrer"
                className="tilt-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center cursor-pointer group w-full max-w-md"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🗺️</span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#122B22] mb-2">View on Map</h3>
                <p className="text-[#6366F1] hover:underline font-semibold">
                  Click to open in Google Maps
                </p>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* FLOATING ACTION BUTTON */}
      <Link
        to="/volunteer-apply"
        className="fixed bottom-8 right-8 z-50 group bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-6 py-4 rounded-full font-semibold shadow-2xl hover:shadow-[#FF6B4A]/50 transition-all duration-300 hover:scale-110 glow flex items-center gap-2"
      >
        <span>Join Us</span>
        <span className="text-xl group-hover:rotate-12 transition-transform">🤝</span>
      </Link>

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 bg-white text-[#122B22] p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HomePage;
