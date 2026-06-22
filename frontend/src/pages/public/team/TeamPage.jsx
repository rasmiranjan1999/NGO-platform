import { useEffect, useState } from "react";
import { API_BASE } from "../../../config";

const TeamPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/team`);
      const data = await response.json();
      setMembers(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 animate-pulse">
      <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4" />
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
      `}</style>

      {/* HERO SECTION - Minimal Header */}
      <section className="relative w-full bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-[#F7F5F0] border-b border-[#1F4D3D] py-7 sm:py-8">
        <div className="relative w-full max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3 justify-center">
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
            <p className="text-xs uppercase tracking-[0.25em] font-medium text-[#D98E32]">
              People Behind the Work
            </p>
            <span className="w-8 h-[2px] bg-[#D98E32]"></span>
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Our Team
          </h1>
        </div>
      </section>

      {/* TEAM MEMBERS SECTION */}
      <section className="py-20">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#122B22] mb-4">
              Leadership <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals united by a common purpose to serve and empower our community
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="font-display text-2xl font-bold text-gray-400 mb-2">No Team Members Yet</h3>
              <p className="text-gray-500">Team information will be added soon</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.map((member, index) => (
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
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] ring-4 ring-white shadow-xl flex items-center justify-center text-white text-3xl font-bold">
                        {member.name?.charAt(0) || "T"}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#122B22] mb-1">{member.name}</h3>
                  <p className="text-[#FF6B4A] font-semibold mb-3">{member.designation}</p>
                  {member.mobile && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${member.mobile}`} className="hover:text-[#FF6B4A]">{member.mobile}</a>
                    </div>
                  )}
                  {member.bio && (
                    <p className="text-gray-600 text-sm line-clamp-3">{member.bio}</p>
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

export default TeamPage;
