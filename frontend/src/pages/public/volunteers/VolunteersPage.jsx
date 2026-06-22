import { useEffect, useState } from "react";
import { API_BASE } from "../../../config";
import { useSettings } from "../../../context/SettingsContext";

const VolunteersPage = () => {
  const { settings } = useSettings();
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/volunteers`);
      const data = await response.json();
      setVolunteers(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter((volunteer) =>
    volunteer.name?.toLowerCase().includes(search.toLowerCase())
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 animate-pulse">
      <div className="w-28 h-28 rounded-full bg-gray-200 mx-auto mb-4" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  );

  return (
    <div className="w-full font-body text-[#2D2A26] bg-gradient-to-b from-[#FFFDF9] via-white to-[#F7F5F0] selection:bg-[#FF6B4A] selection:text-white min-h-screen">
      <style>{`
        .font-body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        .font-display { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        
        @media (prefers-reduced-motion: no-preference) {
          .blob { animation: drift 20s ease-in-out infinite; }
          .blob-slow { animation: drift 30s ease-in-out infinite reverse; }
          .tilt-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
          .tilt-card:hover { transform: translateY(-12px) scale(1.02); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
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
        
        .shimmer { 
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* HERO SECTION - Minimal Header */}
      <section className="relative w-full bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-[#F7F5F0] border-b border-[#1F4D3D] py-7 sm:py-8">
        <div className="relative w-full max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3 justify-center">
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
            <p className="text-xs uppercase tracking-[0.25em] font-medium text-[#D98E32]">
              Heartbeat of Our Work
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Our Volunteers
          </h1>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative py-20 -mt-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] shadow-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <div className="font-display font-bold text-5xl lg:text-6xl gradient-text mb-2">
                {volunteers.length}+
              </div>
              <div className="text-gray-600 font-medium text-lg">Active Volunteers</div>
              <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                Dedicated individuals committed to creating positive change in our community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="py-12">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative max-w-2xl mx-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search volunteers by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border-2 border-gray-200 rounded-full text-[#122B22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all text-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* VOLUNTEERS GRID */}
      <section className="py-12 pb-24">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="font-display text-2xl font-bold text-gray-400 mb-2">
                {search ? "No Volunteers Found" : "No Volunteers Yet"}
              </h3>
              <p className="text-gray-500">
                {search ? `No volunteers match "${search}"` : "Volunteer information will be added soon"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-[#FF6B4A] font-semibold hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredVolunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="tilt-card bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative inline-block mb-4">
                    {volunteer.photo ? (
                      <img
                        src={`${API_BASE}${volunteer.photo}`}
                        alt={volunteer.name}
                        className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-xl group-hover:ring-[#4ABFA8] transition-all"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] ring-4 ring-white shadow-xl flex items-center justify-center text-white text-2xl font-bold">
                        {volunteer.name?.charAt(0) || "V"}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#122B22] mb-1 line-clamp-1">
                    {volunteer.name}
                  </h3>
                  {volunteer.occupation && (
                    <p className="text-[#4ABFA8] font-semibold text-sm mb-2">{volunteer.occupation}</p>
                  )}
                  {volunteer.address && (
                    <p className="text-gray-500 text-sm line-clamp-2">{volunteer.address}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VolunteersPage;
