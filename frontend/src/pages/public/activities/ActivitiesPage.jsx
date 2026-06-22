import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../config";
import { useSettings } from "../../../context/SettingsContext";

const ActivitiesPage = () => {
  const { settings } = useSettings();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/activities`);
      const data = await response.json();
      setActivities(data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Defensive URL Normalizer
   * Prevents broken image links by automatically stripping out double slashes (//)
   * and handling absolute vs relative paths seamlessly.
   */
  const resolveAssetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  // Filter and Sort Logic
  const filteredAndSortedActivities = activities
    .filter((activity) => {
      const query = searchTerm.toLowerCase();
      return (
        activity.title?.toLowerCase().includes(query) ||
        activity.description?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.activity_date || 0);
      const dateB = new Date(b.activity_date || 0);
      if (sortBy === "newest") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;
      if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });

  // Balanced skeleton loaders aligned with the structural layout
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-[#E7ECE6] overflow-hidden animate-pulse">
      <div className="bg-[#F7F5F0] h-60 w-full" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-[#F7F5F0] rounded w-1/4" />
        <div className="h-6 bg-[#F7F5F0] rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-[#F7F5F0] rounded w-full" />
          <div className="h-4 bg-[#F7F5F0] rounded w-5/6" />
        </div>
        <div className="h-10 bg-[#F7F5F0] rounded-xl w-1/3 pt-2" />
      </div>
    </div>
  );

  return (
    <div className="w-full font-body text-[#1C231F] bg-[#F7F5F0] selection:bg-[#D98E32] selection:text-[#122B22] min-h-screen pb-24">
      {/* Typography Font Injections */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* HERO SECTION - Minimal Header */}
      <section className="relative w-full bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-[#F7F5F0] border-b border-[#1F4D3D] py-7 sm:py-8">
        <div className="relative w-full max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3 justify-center">
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
            <p className="text-xs uppercase tracking-[0.25em] font-medium text-[#D98E32]">
              Impact & Initiatives
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Our Activities
          </h1>
        </div>
      </section>

      {/* CONTROLS & FILTER TOOLBAR */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E7ECE6] shadow-sm">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#5B6660]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search activities by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F7F5F0] border border-[#E7ECE6] rounded-xl text-[#1C231F] placeholder-[#5B6660]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition-all text-sm"
            />
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-3 min-w-[240px]">
            <label className="text-sm font-medium text-[#5B6660] whitespace-nowrap">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#F7F5F0] border border-[#E7ECE6] rounded-xl px-3 py-3 text-[#1C231F] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ACTIVITIES DISPLAY GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredAndSortedActivities.length === 0 ? (
          /* EMPTY STATE DIAGNOSTIC CARD */
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E7ECE6] max-w-md mx-auto mt-6 shadow-sm">
            <svg className="w-14 h-14 text-[#5B6660]/40 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-display text-lg font-semibold text-[#1C231F]">No activities found</h3>
            <p className="text-[#5B6660] text-sm mt-1 px-6 font-light">
              We couldn't find any operational tracks matching your criteria. Try updating parameters or reset filters.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSortBy("newest"); }}
              className="mt-5 text-xs bg-[#F7F5F0] hover:bg-[#E7ECE6] text-[#1C231F] font-semibold px-5 py-2.5 rounded-xl border border-[#E7ECE6] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredAndSortedActivities.map((activity) => {
              const isUpcoming = new Date(activity.activity_date) > new Date();
              
              return (
                <div
                  key={activity.id}
                  className="group bg-white rounded-2xl border border-[#E7ECE6] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Dynamic Shield Badges */}
                    <div className="relative overflow-hidden h-60 w-full bg-[#F7F5F0] border-b border-[#E7ECE6]">
                      {activity.cover_image ? (
                        <img
                          src={resolveAssetUrl(activity.cover_image)}
                          alt={activity.title}
                          className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#122B22] to-[#16362B] flex items-center justify-center font-display text-2xl font-bold text-[#F7F5F0]/20">
                          {settings?.ngo_name?.substring(0, 4).toUpperCase() || "ORG"} LOG
                        </div>
                      )}
                      
                      {/* Timeline Dynamic Status Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        {isUpcoming ? (
                          <span className="bg-[#1F4D3D] text-[#CFE0D6] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md border border-[#1F4D3D]/30 shadow-sm">
                            Upcoming
                          </span>
                        ) : (
                          <span className="bg-[#D98E32] text-[#122B22] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md shadow-sm">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Content Details Block */}
                    <div className="p-6">
                      {/* Formatted Date Header */}
                      <div className="flex items-center gap-2 text-xs text-[#D98E32] font-semibold tracking-wider uppercase">
                        <svg className="w-4 h-4 text-[#D98E32]/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {activity.activity_date ? (
                            new Date(activity.activity_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          ) : (
                            "—"
                          )}
                        </span>
                      </div>

                      {/* Header Title */}
                      <h3 className="font-display text-xl font-semibold mt-3 text-[#1C231F] leading-snug group-hover:text-[#1F4D3D] transition-colors tracking-tight">
                        {activity.title}
                      </h3>

                      {/* Description Excerpt */}
                      <p className="mt-3 text-[#5B6660] text-sm leading-relaxed line-clamp-4 font-light">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {/* Operational Action Footer Trigger */}
                  <div className="p-6 pt-0 mt-auto">
                    <Link
                      to={`/activities/${activity.slug}`}
                      className="inline-flex items-center gap-2 bg-[#122B22] hover:bg-[#1F4D3D] text-[#F7F5F0] font-medium text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all shadow-sm group/btn"
                    >
                      <span>Read More</span>
                      <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ActivitiesPage;