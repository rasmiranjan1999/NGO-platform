import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { API_BASE } from "../../config";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";

const Navbar = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [peopleDropdownOpen, setPeopleDropdownOpen] = useState(false);
  const [mobilePeopleOpen, setMobilePeopleOpen] = useState(false);
  const closeTimer = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobilePeopleOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Cleanup hover-intent timer on unmount
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openPeopleMenu = () => {
    clearTimeout(closeTimer.current);
    setPeopleDropdownOpen(true);
  };

  const closePeopleMenuWithDelay = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPeopleDropdownOpen(false), 150);
  };

  const mainNavItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Activities", path: "/activities" },
    { name: "News", path: "/news" },
    { name: "Gallery", path: "/gallery" },
  ];

  const peopleDropdownItems = [
    { name: "Team", path: "/team", icon: "👥" },
    { name: "Members", path: "/members", icon: "👤" },
    { name: "Volunteers", path: "/volunteers", icon: "🤝" },
  ];

  const isPeopleActive = ["/team", "/members", "/volunteers"].includes(
    location.pathname
  );

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-16px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .nav-appear {
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mobile-menu-overlay {
          animation: fadeIn 0.25s ease-out;
        }
        .mobile-menu-panel {
          animation: slideInLeft 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-item-stagger {
          animation: slideInLeft 0.35s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        .dropdown-menu {
          animation: slideInDown 0.18s ease-out;
        }
        .logo-float:hover {
          animation: float 0.6s ease-in-out;
        }
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .submenu-collapse {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          transition: grid-template-rows 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .submenu-collapse.open {
          grid-template-rows: 1fr;
        }
        .submenu-collapse > div {
          min-height: 0;
        }
        .mobile-menu-fixed-top {
          top: 4rem;
        }
        @media (min-width: 640px) {
          .mobile-menu-fixed-top {
            top: 5rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-appear, .mobile-menu-overlay, .mobile-menu-panel,
          .nav-item-stagger, .dropdown-menu, .logo-float:hover,
          .shimmer-effect, .submenu-collapse {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-appear ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-100"
            : "bg-white/95 backdrop-blur-md shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group relative z-10"
            >
              {settings?.logo ? (
                <div className="relative logo-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#4ABFA8] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 scale-150" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                  <div className="relative bg-white rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-lg">
                    <img
                      src={`${API_BASE}${settings.logo}`}
                      alt="BKSS Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain rounded-lg sm:rounded-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative logo-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#4ABFA8] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 scale-150" />
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#122B22] via-[#1F4D3D] to-[#2A5D4A] flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl overflow-hidden">
                    <span className="relative z-10">B</span>
                    <div className="absolute inset-0 shimmer-effect rounded-2xl opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              )}

              <div className="max-w-[200px] sm:max-w-none">
                <h1 className="font-bold text-xs sm:text-base md:text-lg lg:text-xl text-[#122B22] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF6B4A] group-hover:to-[#D98E32] transition-all duration-500 leading-tight truncate sm:whitespace-normal">
                  {settings?.ngo_name || "BKSS"}
                </h1>
                {settings?.registration_number && (
                  <p className="text-[9px] sm:text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300 truncate">
                    Reg. No: {settings.registration_number}
                  </p>
                )}
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${
                      isActive
                        ? "text-[#FF6B4A]"
                        : "text-gray-700 hover:text-[#FF6B4A]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#FF6B4A]/10 to-[#D98E32]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">{item.name}</span>
                      {isActive ? (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] rounded-full" />
                      ) : (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] rounded-full group-hover:w-3/4 transition-all duration-300" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              {/* PEOPLE DROPDOWN */}
              <div 
                className="relative"
                onMouseEnter={openPeopleMenu}
                onMouseLeave={closePeopleMenuWithDelay}
              >
                <button
                  type="button"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden flex items-center gap-1 ${
                    isPeopleActive
                      ? "text-[#FF6B4A]"
                      : "text-gray-700 hover:text-[#FF6B4A]"
                  }`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#FF6B4A]/10 to-[#D98E32]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">People</span>
                  <HiChevronDown
                    className={`w-4 h-4 relative z-10 transition-transform duration-300 ${
                      peopleDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  {isPeopleActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] rounded-full" />
                  )}
                </button>

                {peopleDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 dropdown-menu z-[9999]">
                    {peopleDropdownItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#FF6B4A]/10 hover:to-[#D98E32]/10 ${
                            isActive
                              ? "text-[#FF6B4A] bg-gradient-to-r from-[#FF6B4A]/5 to-[#D98E32]/5"
                              : "text-gray-700 hover:text-[#FF6B4A]"
                          }`
                        }
                      >
                        <span className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? "text-[#FF6B4A]"
                      : "text-gray-700 hover:text-[#FF6B4A]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#FF6B4A]/10 to-[#D98E32]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Contact</span>
                    {isActive ? (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] rounded-full" />
                    ) : (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] rounded-full group-hover:w-3/4 transition-all duration-300" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/volunteer-apply"
                className="ml-4 relative bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-2xl hover:shadow-[#FF6B4A]/40 transition-all duration-300 hover:scale-105 overflow-hidden group"
              >
                <span className="relative z-10">Join Us</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#D98E32] to-[#FF6B4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </NavLink>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl hover:bg-gradient-to-br hover:from-[#FF6B4A]/10 hover:to-[#D98E32]/10 transition-all duration-300 group z-50"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              type="button"
            >
              {mobileOpen ? (
                <HiX className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF6B4A] transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <HiMenuAlt3 className="w-6 h-6 sm:w-7 sm:h-7 text-[#122B22] group-hover:text-[#FF6B4A] transition-all duration-300 group-hover:scale-110" />
              )}
            </button>
          </div>
        </div>

      </header>

      {/* MOBILE MENU — rendered OUTSIDE <header> on purpose.
          <header> has backdrop-blur-xl/md (backdrop-filter), and any
          backdrop-filter/filter/transform on an ancestor creates a new
          containing block for `position: fixed` descendants. That made
          this panel position itself relative to the header's own box
          (only as tall as the h-16/h-20 row) instead of the viewport,
          clipping it down to a thin strip. Keeping it as a sibling of
          <header> guarantees it's fixed to the real viewport. */}
      {mobileOpen && (
        <div className="lg:hidden fixed left-0 right-0 bottom-0 z-40 mobile-menu-overlay mobile-menu-fixed-top">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute inset-0 bg-white overflow-y-auto overscroll-contain mobile-menu-panel shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <nav className="space-y-1 sm:space-y-2">
                {mainNavItems.map((item, index) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item-stagger block px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-[#FF6B4A]/15 to-[#D98E32]/15 text-[#FF6B4A] shadow-sm border-l-4 border-[#FF6B4A]"
                          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-l-4 border-transparent"
                      }`
                    }
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    {item.name}
                  </NavLink>
                ))}

                {/* MOBILE PEOPLE ACCORDION */}
                <div
                  className="nav-item-stagger"
                  style={{ animationDelay: `${mainNavItems.length * 0.04}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setMobilePeopleOpen((v) => !v)}
                    aria-expanded={mobilePeopleOpen}
                    className={`w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 border-l-4 ${
                      isPeopleActive
                        ? "bg-gradient-to-r from-[#FF6B4A]/15 to-[#D98E32]/15 text-[#FF6B4A] shadow-sm border-[#FF6B4A]"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-transparent"
                    }`}
                  >
                    <span>People</span>
                    <HiChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                        mobilePeopleOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Height-animated, never opacity-gated: items are always interactive
                      the instant the accordion opens, regardless of animation timing. */}
                  <div
                    className={`submenu-collapse ${
                      mobilePeopleOpen ? "open" : ""
                    }`}
                  >
                    <div className="ml-4 mt-1 space-y-1 sm:space-y-2 pb-1">
                      {peopleDropdownItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `block px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-[#FF6B4A]/10 to-[#D98E32]/10 text-[#FF6B4A]"
                                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                            }`
                          }
                        >
                          <span className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>

                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `nav-item-stagger block px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 relative overflow-hidden border-l-4 ${
                      isActive
                        ? "bg-gradient-to-r from-[#FF6B4A]/15 to-[#D98E32]/15 text-[#FF6B4A] shadow-sm border-[#FF6B4A]"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-transparent"
                    }`
                  }
                  style={{
                    animationDelay: `${(mainNavItems.length + 1) * 0.04}s`,
                  }}
                >
                  Contact
                </NavLink>
              </nav>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <NavLink
                  to="/volunteer-apply"
                  className="block text-center bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-[#FF6B4A]/40 transition-all duration-300 active:scale-95"
                  style={{
                    animation: "scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  Join Us Today
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPACER to prevent content from hiding under fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Navbar;