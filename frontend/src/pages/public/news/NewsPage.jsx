import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../config";
import { useSettings } from "../../../context/SettingsContext";

const NewsPage = () => {
  const { settings } = useSettings();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/news`);
      const data = await response.json();
      setNews(data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAssetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-[#E7ECE6] overflow-hidden animate-pulse">
      <div className="bg-[#F7F5F0] h-60 w-full" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-[#F7F5F0] rounded w-1/4" />
        <div className="h-6 bg-[#F7F5F0] rounded w-3/4" />
        <div className="h-4 bg-[#F7F5F0] rounded w-full" />
        <div className="h-10 bg-[#F7F5F0] rounded-xl w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="w-full font-body text-[#1C231F] bg-[#F7F5F0] min-h-screen pb-24">
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
              Latest Updates
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            News & Announcements
          </h1>
        </div>
      </section>

      {/* NEWS GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="font-display text-xl text-[#5B6660]">No news articles available at the moment.</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl border border-[#E7ECE6] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative overflow-hidden h-60 w-full bg-[#F7F5F0]">
                  {item.cover_image && (
                    <img
                      src={resolveAssetUrl(item.cover_image)}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-[#D98E32] font-semibold tracking-wider uppercase">
                    {item.publish_date ? new Date(item.publish_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                  </div>
                  <h3 className="font-display text-xl font-semibold mt-3 text-[#1C231F] group-hover:text-[#1F4D3D] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[#5B6660] text-sm leading-relaxed line-clamp-4 font-light flex-1">
                    {item.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-2 bg-[#122B22] hover:bg-[#1F4D3D] text-[#F7F5F0] font-medium text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all group/btn"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsPage;