import { useEffect, useState } from "react";
import { API_BASE } from "../../../config";
import { useSettings } from "../../../context/SettingsContext";

const MembersPage = () => {
  const { settings } = useSettings();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [selectedQualification, setSelectedQualification] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/members/public`);
      const data = await response.json();
      setMembers(data.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract dynamic configuration for criteria drop-downs
  const uniqueOccupations = Array.from(
    new Set(members.map((m) => m.occupation).filter(Boolean))
  );
  const uniqueQualifications = Array.from(
    new Set(members.map((m) => m.qualification).filter(Boolean))
  );

  // Filter and sorting core processing engine
  const filteredMembers = members
    .filter((member) => {
      const matchesSearch =
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.member_id?.toLowerCase().includes(search.toLowerCase()) ||
        member.occupation?.toLowerCase().includes(search.toLowerCase());

      const matchesOccupation =
        !selectedOccupation || member.occupation === selectedOccupation;

      const matchesQualification =
        !selectedQualification || member.qualification === selectedQualification;

      return matchesSearch && matchesOccupation && matchesQualification;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "id-asc") return (a.member_id || "").localeCompare(b.member_id || "");
      if (sortBy === "id-desc") return (b.member_id || "").localeCompare(a.member_id || "");
      return 0;
    });

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedOccupation("");
    setSelectedQualification("");
    setSortBy("name-asc");
  };

  return (
    <div className="w-full font-body text-[#1C231F] bg-[#F7F5F0] selection:bg-[#D98E32] selection:text-[#122B22] min-h-screen pb-24">
      {/* Typography Configuration Injection */}
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
              Community Directory
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Our Members
          </h1>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative z-20 w-full mt-12 max-w-5xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 grid grid-cols-2 divide-x divide-[#E7ECE6] text-center overflow-hidden border border-[#E7ECE6]/50">
          <div className="py-8 px-4 hover:bg-[#F7F5F0]/50 transition-colors duration-300">
            <p className="font-display text-3xl lg:text-4xl font-semibold text-[#1F4D3D] tracking-tight">
              {members.length}
            </p>
            <p className="mt-1.5 text-xs text-[#5B6660] uppercase tracking-[0.2em] font-medium">
              Registered Total
            </p>
          </div>
          <div className="py-8 px-4 hover:bg-[#F7F5F0]/50 transition-colors duration-300">
            <p className="font-display text-3xl lg:text-4xl font-semibold text-[#D98E32] tracking-tight">
              {filteredMembers.length}
            </p>
            <p className="mt-1.5 text-xs text-[#5B6660] uppercase tracking-[0.2em] font-medium">
              Matches Found
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH AND CONTROL DASHBOARD */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
        <div className="bg-white p-6 rounded-2xl border border-[#E7ECE6] shadow-sm space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            {/* Search Input field */}
            <div className="relative lg:col-span-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="h-4 w-4 text-[#5B6660]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by name, identity ID, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#F7F5F0]/60 border border-[#E7ECE6] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#D98E32] focus:border-[#D98E32] transition-all text-[#1C231F]"
              />
            </div>

            {/* Sorting mechanism */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#F7F5F0]/60 border border-[#E7ECE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#D98E32] text-[#1C231F] font-medium appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235B6660\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              >
                <option value="name-asc">Sort Alphabetical (A - Z)</option>
                <option value="name-desc">Sort Alphabetical (Z - A)</option>
                <option value="id-asc">Sort Registry ID (Ascending)</option>
                <option value="id-desc">Sort Registry ID (Descending)</option>
              </select>
            </div>

            {/* Clear button filter action triggers */}
            <div>
              {(search || selectedOccupation || selectedQualification) ? (
                <button
                  onClick={handleResetFilters}
                  className="w-full text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100/70 rounded-xl py-3.5 transition-colors border border-red-100"
                >
                  Clear Active Filters
                </button>
              ) : (
                <div className="text-center text-xs text-[#5B6660] font-medium tracking-wide py-3 bg-[#F7F5F0]/40 rounded-xl border border-dashed border-[#E7ECE6]">
                  Filters Synchronized
                </div>
              )}
            </div>
          </div>

          {/* Categorized Dropdown Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E7ECE6]/60">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#5B6660] mb-1.5">Categorize By Occupation</label>
              <select
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="w-full bg-[#F7F5F0]/60 border border-[#E7ECE6] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D98E32] text-[#1C231F] appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235B6660\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              >
                <option value="">All Occupations / Professional Profiles</option>
                {uniqueOccupations.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#5B6660] mb-1.5">Categorize By Qualification</label>
              <select
                value={selectedQualification}
                onChange={(e) => setSelectedQualification(e.target.value)}
                className="w-full bg-[#F7F5F0]/60 border border-[#E7ECE6] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D98E32] text-[#1C231F] appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235B6660\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              >
                <option value="">All Qualifications</option>
                {uniqueQualifications.map((qual) => (
                  <option key={qual} value={qual}>{qual}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* CORE DISPLAY GRID ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          /* Premium animated card skeleton wrappers */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-[#E7ECE6] p-6 text-center animate-pulse">
                <div className="w-28 h-28 rounded-full bg-[#F7F5F0] mx-auto mb-4" />
                <div className="h-4 bg-[#F7F5F0] rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-[#F7F5F0] rounded w-1/2 mx-auto mb-4" />
                <div className="h-8 bg-[#F7F5F0] rounded-full w-full mx-auto mt-4" />
              </div>
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          /* Seamless editorial Empty State layout structure design element */
          <div className="bg-white border border-[#E7ECE6] rounded-2xl p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-12 h-12 bg-[#F7F5F0] text-[#D98E32] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-semibold text-[#1C231F]">No Members Match</h3>
            <p className="text-[#5B6660] mt-2 text-sm leading-relaxed">
              We couldn't track down any active members answering to your current search definitions or criteria pairings.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-wider bg-[#1F4D3D] text-[#F7F5F0] hover:bg-[#16362B] px-6 py-3 rounded-full transition-colors"
            >
              Reset Configuration
            </button>
          </div>
        ) : (
          /* Active Results Display Grid Container matching Home Volunteer design spec */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-[#E7ECE6] rounded-2xl p-6 text-center flex flex-col justify-between items-center hover:shadow-xl hover:border-[#D98E32]/30 transition-all duration-300 group"
              >
                <div className="w-full flex flex-col items-center">
                  {/* Identity reference label tag badge header segment row alignment */}
                  <span className="text-[10px] font-mono font-bold tracking-wider px-3 py-1 bg-[#F7F5F0] text-[#5B6660] rounded-full border border-[#E7ECE6] mb-5">
                    ID: {member.member_id || `${settings?.ngo_name?.substring(0, 4).toUpperCase() || "ORG"}-PENDING`}
                  </span>

                  {/* Profile photo circle container element block wrapper layout alignment */}
                  <div className="relative mb-5 w-28 h-28">
                    <div className="absolute inset-0 rounded-full border border-[#D98E32] scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
                    {member.photo ? (
                      <img
                        src={`${API_BASE}${member.photo}`}
                        alt={member.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm relative z-10"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#122B22] to-[#16362B] text-[#F7F5F0] border-4 border-white flex items-center justify-center font-display font-medium text-2xl shadow-sm relative z-10 uppercase">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#1C231F] group-hover:text-[#1F4D3D] transition-colors leading-snug line-clamp-1">
                    {member.name}
                  </h3>

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#D98E32] mt-1.5 min-h-[16px]">
                    {member.occupation || "General Member"}
                  </p>

                  {member.qualification && (
                    <p className="text-xs text-[#5B6660] font-normal italic mt-1 line-clamp-1">
                      {member.qualification}
                    </p>
                  )}
                </div>

                {/* Profile Modal activation button element anchor block container row bottom card placement */}
                <div className="w-full mt-6 pt-4 border-t border-[#E7ECE6]/60">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="w-full bg-transparent border border-[#E7ECE6] text-[#1F4D3D] hover:bg-[#1F4D3D] hover:text-white hover:border-[#1F4D3D] rounded-full transition-all text-xs font-semibold py-2.5 shadow-sm"
                  >
                    View Card Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DETAILED MEMORANDUM PROFILE MODAL INTERFACE */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1813]/60 backdrop-blur-sm transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#F7F5F0] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#1F4D3D]/10 transform transition-transform duration-300 animate-[slideUp_0.3s_ease-out]">
            {/* Modal branding accent heading banner alignment block context */}
            <div className="bg-gradient-to-r from-[#122B22] to-[#16362B] px-6 py-4.5 flex items-center justify-between text-[#F7F5F0] border-b border-[#1F4D3D]">
              <span className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-[#D98E32]">
                {settings?.ngo_name || "Organization"} Identity Verification Record
              </span>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-full text-[#CFE0D6] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close layout container profile dashboard view modal sheet"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile context primary details display field item layout alignment header block */}
            <div className="p-6 text-center border-b border-[#E7ECE6] bg-white">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border border-[#D98E32] scale-105"></div>
                {selectedMember.photo ? (
                  <img
                    src={`${API_BASE}${selectedMember.photo}`}
                    alt={selectedMember.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#122B22] to-[#16362B] text-[#F7F5F0] border-2 border-white flex items-center justify-center font-display font-medium text-2xl shadow-inner relative z-10 uppercase">
                    {getInitials(selectedMember.name)}
                  </div>
                )}
              </div>
              <h2 className="font-display text-xl font-bold text-[#1C231F] leading-tight">{selectedMember.name}</h2>
              <span className="inline-block text-[10px] font-mono font-bold px-3 py-1 bg-[#F7F5F0] text-[#5B6660] rounded-md mt-2 border border-[#E7ECE6]">
                Registry ID: {selectedMember.member_id || `${settings?.ngo_name?.substring(0, 4).toUpperCase() || "ORG"}-PENDING`}
              </span>
            </div>

            {/* Structured core properties item mapping definition metadata rows list block panel area */}
            <div className="px-6 py-5 space-y-4 text-sm bg-white/40">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 text-[#D98E32] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#5B6660] uppercase tracking-wider">Professional Profile Role</h4>
                  <p className="text-[#1C231F] font-semibold mt-0.5">{selectedMember.occupation || "Not Specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 text-[#D98E32] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.824-3.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#5B6660] uppercase tracking-wider">Educational Qualification</h4>
                  <p className="text-[#1C231F] font-medium mt-0.5">{selectedMember.qualification || "Not Specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 text-[#D98E32] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#5B6660] uppercase tracking-wider">Contact Number</h4>
                  {selectedMember.mobile ? (
                    <a href={`tel:${selectedMember.mobile}`} className="text-[#1F4D3D] font-bold hover:text-[#D98E32] transition-colors mt-0.5 inline-block">
                      {selectedMember.mobile}
                    </a>
                  ) : (
                    <p className="text-[#5B6660] italic font-light text-xs mt-0.5">Private Information</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 text-[#D98E32] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#5B6660] uppercase tracking-wider">Email Address</h4>
                  {selectedMember.email ? (
                    <a href={`mailto:${selectedMember.email}`} className="text-[#1F4D3D] font-bold hover:text-[#D98E32] transition-colors break-all mt-0.5 inline-block">
                      {selectedMember.email}
                    </a>
                  ) : (
                    <p className="text-[#5B6660] italic font-light text-xs mt-0.5">Private Information</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 text-[#D98E32] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#5B6660] uppercase tracking-wider">Residential Address</h4>
                  <p className="text-[#1C231F] leading-relaxed font-normal mt-0.5">{selectedMember.address || "Not Specified"}</p>
                </div>
              </div>
            </div>

            {/* Modal dismissal button block panel row alignment edge context component view close section link */}
            <div className="bg-white px-6 py-4 text-right border-t border-[#E7ECE6]">
              <button
                onClick={() => setSelectedMember(null)}
                className="bg-[#1F4D3D] hover:bg-[#16362B] text-[#F7F5F0] text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-sm shadow-[#1F4D3D]/10"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;