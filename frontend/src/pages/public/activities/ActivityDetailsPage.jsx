import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../../../config";

const ActivityDetailsPage = () => {
  const { slug } = useParams();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Resolve image URL safely
  const resolveAssetUrl = (path) => {
    if (!path) return "";

    // Already a full URL
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const base = API_BASE.replace(/\/$/, "");

    // If backend returns "/uploads/..."
    if (path.startsWith("/")) {
      return `${base}${path}`;
    }

    // If backend returns "uploads/..."
    if (path.startsWith("uploads/")) {
      return `${base}/${path}`;
    }

    // If backend returns only filename
    return `${base}/uploads/${path}`;
  };

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/api/activities/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch activity");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Activity Data:", data);

        const activityData = data?.data || null;

        console.log(
          "Generated Image URL:",
          resolveAssetUrl(activityData?.cover_image)
        );

        setActivity(activityData);
      })
      .catch((error) => {
        console.error("Error fetching activity:", error);
        setActivity(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F5F0] flex items-center justify-center animate-pulse">
        <div className="text-[#122B22] font-display text-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F5F0] text-[#1C231F]">
        <h2 className="font-display text-3xl font-semibold">
          Activity Not Found
        </h2>

        <Link
          to="/activities"
          className="mt-6 text-[#1F4D3D] hover:underline"
        >
          Return to Activities
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-body text-[#1C231F] bg-[#F7F5F0] selection:bg-[#D98E32] selection:text-[#122B22] min-h-screen pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Fraunces', Georgia, serif;
        }

        .font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      {/* HERO - Minimal */}
      <section className="relative w-full bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-[#F7F5F0] py-6 sm:py-8">
        <div className="relative w-full max-w-4xl mx-auto px-6">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 mb-6 text-[#D98E32] hover:text-white transition-colors text-xs uppercase tracking-[0.25em] font-bold"
          >
            ← Back to Activities
          </Link>

          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            {activity.title}
          </h1>

          <p className="mt-6 text-[#CFE0D6] text-lg font-light flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#D98E32]"></span>
            {activity.activity_date
              ? new Date(activity.activity_date).toLocaleDateString()
              : "Date TBD"}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-6 -mt-16">
        <article className="bg-white p-8 lg:p-12 rounded-2xl border border-[#E7ECE6] shadow-sm">
          {/* IMAGE */}
          {activity.cover_image && !imageError && (
            <div className="mb-10 overflow-hidden rounded-xl border border-[#E7ECE6]">
              <img
                src={resolveAssetUrl(activity.cover_image)}
                alt={activity.title}
                className="w-full max-h-[500px] object-cover"
                loading="lazy"
                onError={() => {
                  console.error(
                    "Image failed to load:",
                    resolveAssetUrl(activity.cover_image)
                  );
                  setImageError(true);
                }}
              />
            </div>
          )}

          {imageError && (
            <div className="mb-10 rounded-xl border border-[#E7ECE6] bg-gray-100 p-8 text-center text-gray-500">
              Image not available
            </div>
          )}

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D98E32] mb-3 font-semibold">
              Activity Overview
            </p>

            <h2 className="font-display text-3xl font-semibold text-[#1C231F]">
              Details
            </h2>
          </div>

          <div className="border-t border-[#E7ECE6] pt-8 text-[#5B6660] leading-relaxed text-lg font-light whitespace-pre-line">
            {activity.description || "No description available."}
          </div>
        </article>
      </main>
    </div>
  );
};

export default ActivityDetailsPage;