import { useEffect, useState } from "react";
import { API_BASE } from "../../../config";

const AboutPage = () => {
  const [settings, setSettings] = useState({});
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Concurrent collection framework from both endpoints
    Promise.all([
      fetch(`${API_BASE}/api/settings`).then((res) => res.json()),
      fetch(`${API_BASE}/api/team`).then((res) => res.json()),
    ])
      .then(([settingsData, teamData]) => {
        setSettings(settingsData.data || {});
        setTeam(teamData.data || []);
      })
      .catch((error) => {2
        console.error("Error fetching about page data profiles:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  // Logic to search and filter specific profile slots dynamically from the parsed array
  const president = team.find((member) =>
    member.designation?.toLowerCase().includes("president")
  );
  const secretary = team.find((member) =>
    member.designation?.toLowerCase().includes("secretary")
  );

  return (
    <div className="w-full font-body text-[#1C231F] bg-[#F7F5F0] selection:bg-[#D98E32] selection:text-[#122B22] min-h-screen pb-24">
      {/* Typography Font Injections */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* HERO SECTION - Minimal Size */}
      <section className="relative w-full bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-[#F7F5F0] border-b border-[#1F4D3D] py-6 sm:py-8">
        <div className="relative w-full max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 mb-2 justify-center">
            <span className="w-3 h-[1px] bg-[#D98E32]"></span>
            <p className="text-[9px] uppercase tracking-[0.15em] font-medium text-[#D98E32]">
              About Us
            </p>
            <span className="w-3 h-[1px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-xl sm:text-2xl lg:text-3xl tracking-tight">
            About {settings.ngo_name || "NGO"}
          </h1>
        </div>
      </section>

      {loading ? (
        /* SKELETON LOADING STATE */
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-12 animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl border border-[#E7ECE6]">
            <div className="space-y-4">
              <div className="h-4 bg-[#F7F5F0] rounded w-1/4"></div>
              <div className="h-8 bg-[#F7F5F0] rounded w-3/4"></div>
              <div className="space-y-2 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-[#F7F5F0] rounded"></div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-56 h-56 rounded-full bg-[#F7F5F0]"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* NGO CORE INFORMATION SECTION */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
                <div className="bg-white p-8 lg:p-10 rounded-2xl border border-[#E7ECE6] shadow-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D98E32] mb-3 font-semibold">
                    Who We Are
                  </p>
                  <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C231F] mb-8">
                    Organisation Information
                  </h2>

                  <dl className="divide-y divide-[#E7ECE6] border-y border-[#E7ECE6] text-sm">
                    <div className="grid grid-cols-3 gap-4 py-4.5">
                      <dt className="text-[#5B6660] uppercase tracking-wider font-medium text-xs flex items-center">
                        Organisation
                      </dt>
                      <dd className="col-span-2 font-semibold text-[#1C231F]">
                        {settings.ngo_name || "—"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-4.5">
                      <dt className="text-[#5B6660] uppercase tracking-wider font-medium text-xs flex items-center">
                        Registration No.
                      </dt>
                      <dd className="col-span-2 font-mono font-bold text-[#1C231F]">
                        {settings.registration_number || "—"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-4.5">
                      <dt className="text-[#5B6660] uppercase tracking-wider font-medium text-xs flex items-center">
                        Email Address
                      </dt>
                      <dd className="col-span-2 font-medium">
                        {settings.email ? (
                          <a
                            href={`mailto:${settings.email}`}
                            className="text-[#1F4D3D] hover:text-[#D98E32] underline decoration-[#D98E32]/40 transition-colors break-all"
                          >
                            {settings.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-4.5">
                      <dt className="text-[#5B6660] uppercase tracking-wider font-medium text-xs flex items-center">
                        Phone Contact
                      </dt>
                      <dd className="col-span-2 font-semibold">
                        {settings.phone ? (
                          <a
                            href={`tel:${settings.phone}`}
                            className="text-[#1F4D3D] hover:text-[#D98E32] transition-colors"
                          >
                            {settings.phone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-4.5">
                      <dt className="text-[#5B6660] uppercase tracking-wider font-medium text-xs">
                        Registered Address
                      </dt>
                      <dd className="col-span-2 font-normal text-[#5B6660] leading-relaxed">
                        {settings.address || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* LOGO BOX SHIELD */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-full border border-[#D98E32] scale-105 opacity-40 group-hover:scale-110 transition-all duration-500"></div>
                    <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full border border-[#E7ECE6] bg-white flex items-center justify-center p-6 shadow-xl shadow-black/[0.02] relative z-10">
                      {settings.logo ? (
                        <img
                          src={resolveAssetUrl(settings.logo)}
                          alt={`${settings.ngo_name || "Organization"} Official Logo Verification Seal`}
                          className="w-40 h-40 lg:w-48 lg:h-48 object-contain transition-transform duration-300 group-hover:scale-102"
                        />
                      ) : (
                        <div className="w-44 h-44 lg:w-52 lg:h-52 rounded-full bg-gradient-to-br from-[#122B22] to-[#16362B] text-[#F7F5F0] flex items-center justify-center font-display text-4xl font-bold border-4 border-white shadow-inner shadow-black/20">
                          {settings.ngo_name?.substring(0, 4).toUpperCase() || "ORG"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CHRONOLOGY PROFILE HISTORY STRIP */}
          <section className="py-24 bg-white border-y border-[#E7ECE6]">
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-[#D98E32]"></span>
                <p className="text-xs uppercase tracking-[0.25em] text-[#D98E32] font-semibold">
                  Where We Began
                </p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C231F] mb-8">
                Our History
              </h2>
              <div className="text-[#5B6660] leading-relaxed whitespace-pre-line text-lg font-light border-l-2 border-[#E7ECE6] pl-6 lg:pl-8 italic">
                {settings.history ||
                  "History details are presently being initialized by the administration directory."}
              </div>
            </div>
          </section>

          {/* VISION & MISSION CARD ROW CONTAINER */}
          <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            {/* VISION CARD */}
            <div className="bg-white border border-[#E7ECE6] rounded-2xl p-8 lg:p-10 hover:shadow-xl hover:border-[#D98E32]/20 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-[1px] bg-[#D98E32]"></span>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D98E32] font-semibold">
                    Looking Ahead
                  </p>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C231F] mb-6">
                  Our Vision
                </h2>
                <p className="text-[#5B6660] leading-relaxed whitespace-pre-line text-base font-normal">
                  {settings.vision || "Vision parameters are currently being processed."}
                </p>
              </div>
              <div className="pt-6 text-right text-xs tracking-widest uppercase font-bold text-[#E7ECE6]">
                {settings.ngo_name?.substring(0, 4).toUpperCase() || "ORG"} Horizon
              </div>
            </div>

            {/* MISSION CARD */}
            <div className="bg-[#122B22] border border-[#1F4D3D] rounded-2xl p-8 lg:p-10 hover:shadow-xl transition-all duration-300 text-[#F7F5F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-[1px] bg-[#D98E32]"></span>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D98E32] font-semibold">
                    How We Work
                  </p>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-[#CFE0D6] leading-relaxed whitespace-pre-line text-base font-light">
                  {settings.mission ||
                    "Mission manifest blueprints are currently undergoing updates."}
                </p>
              </div>
              <div className="pt-6 text-right text-xs tracking-widest uppercase font-bold text-[#1F4D3D]">
                {settings.ngo_name?.substring(0, 4).toUpperCase() || "ORG"} Action
              </div>
            </div>
          </section>

          {/* LEADERSHIP TEAM SECTION */}
          <section className="py-24 bg-[#F0EDE6] border-t border-[#E7ECE6]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D98E32] mb-3 font-semibold">
                  People Behind the Work
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C231F]">
                  Leadership Team
                </h2>
                <p className="text-[#5B6660] mt-3 max-w-sm mx-auto text-sm">
                  Official operational executives filtering updates from our primary database directory.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {/* PRESIDENT CARD */}
                <div className="border border-[#E7ECE6] rounded-2xl p-8 lg:p-10 text-center bg-white hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-[#1F4D3D]"></div>
                  
                  {president ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="relative mb-5 w-36 h-36 mx-auto">
                        <div className="absolute inset-0 rounded-full border border-[#D98E32] scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
                        {president.photo ? (
                          <img
                            src={resolveAssetUrl(president.photo)}
                            alt={`${president.name} - ${settings.ngo_name || "Organization"} President`}
                            className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-white shadow-md relative z-10"
                          />
                        ) : (
                          <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-[#122B22] to-[#16362B] text-[#F7F5F0] border-4 border-white flex items-center justify-center font-display font-medium text-3xl shadow-sm relative z-10">
                            {president.name ? president.name.charAt(0) : "P"}
                          </div>
                        )}
                      </div>

                      <p className="text-xs uppercase tracking-[0.2em] text-[#D98E32] font-bold">
                        {president.designation || "President"}
                      </p>
                      <h3 className="font-display text-2xl font-bold text-[#1C231F] mt-2 group-hover:text-[#1F4D3D] transition-colors tracking-tight">
                        {president.name}
                      </h3>
                      {president.mobile && (
                        <>
                          <div className="w-12 h-[1px] bg-[#E7ECE6] my-4"></div>
                          <p className="text-[#5B6660] text-sm font-medium tracking-wide">
                            Contact: {president.mobile}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full py-16 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="font-display text-lg font-medium">President profile not available</p>
                      <p className="text-xs text-gray-400 mt-1">Not assigned in system registry</p>
                    </div>
                  )}
                </div>

                {/* SECRETARY CARD */}
                <div className="border border-[#E7ECE6] rounded-2xl p-8 lg:p-10 text-center bg-white hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-[#D98E32]"></div>
                  
                  {secretary ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="relative mb-5 w-36 h-36 mx-auto">
                        <div className="absolute inset-0 rounded-full border border-[#1F4D3D] scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
                        {secretary.photo ? (
                          <img
                            src={resolveAssetUrl(secretary.photo)}
                            alt={`${secretary.name} - ${settings.ngo_name || "Organization"} Secretary`}
                            className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-white shadow-md relative z-10"
                          />
                        ) : (
                          <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-[#D98E32] to-[#b37122] text-white border-4 border-white flex items-center justify-center font-display font-medium text-3xl shadow-sm relative z-10">
                            {secretary.name ? secretary.name.charAt(0) : "S"}
                          </div>
                        )}
                      </div>

                      <p className="text-xs uppercase tracking-[0.2em] text-[#D98E32] font-bold">
                        {secretary.designation || "Secretary"}
                      </p>
                      <h3 className="font-display text-2xl font-bold text-[#1C231F] mt-2 group-hover:text-[#1F4D3D] transition-colors tracking-tight">
                        {secretary.name}
                      </h3>
                      {secretary.mobile && (
                        <>
                          <div className="w-12 h-[1px] bg-[#E7ECE6] my-4"></div>
                          <p className="text-[#5B6660] text-sm font-medium tracking-wide">
                            Contact: {secretary.mobile}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full py-16 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="font-display text-lg font-medium">Secretary profile not available</p>
                      <p className="text-xs text-gray-400 mt-1">Not assigned in system registry</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AboutPage;