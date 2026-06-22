import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../../../config";

const NewsDetailsPage = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/news/${slug}`);
      const data = await response.json();
      setNews(data.data || null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="animate-pulse text-[#122B22] font-display text-xl">Loading Article...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center p-6">
        <h2 className="font-display text-2xl text-[#1C231F]">Article not found</h2>
        <Link to="/news" className="mt-4 text-[#D98E32] font-medium hover:underline">Return to News</Link>
      </div>
    );
  }

  return (
    <div className="w-full font-body text-[#1C231F] bg-[#F7F5F0] min-h-screen pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* HERO SECTION - Minimal */}
      <section className="relative w-full bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-[#F7F5F0] py-6 sm:py-8 border-b border-[#1F4D3D]">
        <div className="relative w-full max-w-4xl mx-auto px-6">
          <Link to="/news" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D98E32] hover:text-white transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Back to News
          </Link>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            {news.title}
          </h1>
          <p className="mt-6 text-[#CFE0D6] font-medium text-sm tracking-wider uppercase">
            {news.publish_date ? new Date(news.publish_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {news.cover_image && (
          <figure className="w-full h-64 sm:h-96 mb-10 overflow-hidden rounded-2xl border border-[#E7ECE6] shadow-sm">
            <img
              src={resolveAssetUrl(news.cover_image)}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </figure>
        )}

        <article className="bg-white p-8 md:p-12 rounded-2xl border border-[#E7ECE6] shadow-sm">
          <div className="whitespace-pre-line leading-relaxed text-[#5B6660] text-lg font-light">
            {news.description}
          </div>
        </article>

        {/* FOOTER ACTION */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-2 bg-[#E7ECE6] hover:bg-[#D1D9D2] text-[#122B22] px-6 py-3 rounded-xl font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            Copy Link
          </button>
        </div>
      </main>
    </div>
  );
};

export default NewsDetailsPage;