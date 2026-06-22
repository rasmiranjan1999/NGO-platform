import { useEffect, useState } from "react";
import { API_BASE } from "../../../config";

const GalleryPage = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumDetails, setAlbumDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/gallery/albums`);
      const data = await response.json();
      setAlbums(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openAlbum = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/gallery/albums/${id}`);
      const data = await response.json();
      setSelectedAlbum(id);
      setAlbumDetails(data);
    } catch (error) {
      console.error(error);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
      <div className="h-64 w-full bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
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
          .tilt-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
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
              Moments That Inspire
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Our Gallery
          </h1>
        </div>
      </section>

      {!selectedAlbum ? (
        /* ALBUMS GRID */
        <section className="py-20">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#122B22] mb-3">
                  Photo <span className="gradient-text">Albums</span>
                </h2>
                <p className="text-lg text-gray-600">Browse through our collection of memorable moments</p>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-display text-2xl font-bold text-gray-400 mb-2">No Albums Yet</h3>
                <p className="text-gray-500">Check back soon for photo albums from our events</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album, index) => (
                  <div
                    key={album.id}
                    className="tilt-card bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => openAlbum(album.id)}
                  >
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#122B22] to-[#1F4D3D]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-bold text-2xl text-[#122B22] mb-2 group-hover:text-[#FF6B4A] transition-colors">
                        {album.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(album.event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                      <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span>View Album</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* ALBUM DETAIL VIEW */
        <section className="py-20">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#122B22] mb-2">
                  {albumDetails?.album?.title}
                </h2>
                <p className="text-gray-600">
                  {albumDetails?.album?.event_date && new Date(albumDetails.album.event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedAlbum(null);
                  setAlbumDetails(null);
                }}
                className="flex items-center gap-2 bg-white text-[#122B22] px-6 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Albums
              </button>
            </div>

            {albumDetails?.images?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-display text-2xl font-bold text-gray-400 mb-2">No Photos Yet</h3>
                <p className="text-gray-500">This album doesn't have any photos yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albumDetails?.images?.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gray-100"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => setSelectedImage(image.image)}
                  >
                    <img
                      src={`${API_BASE}${image.image}`}
                      alt={image.title || `Photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      {image.title && (
                        <p className="text-white font-semibold text-sm">{image.title}</p>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-[#122B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* IMAGE LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={`${API_BASE}${selectedImage}`}
            alt="Full size"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
