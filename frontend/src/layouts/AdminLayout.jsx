import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  FaTachometerAlt,
  FaUserFriends,
  FaUsers,
  FaTasks,
  FaNewspaper,
  FaImages,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt className="w-5 h-5" />,
      path: "/admin/dashboard",
    },
    {
      name: "Members",
      icon: <FaUsers className="w-5 h-5" />,
      path: "/admin/members",
    },
    {
      name: "Volunteers",
      icon: <FaUserFriends className="w-5 h-5" />,
      path: "/admin/volunteers",
    },
    {
      name: "Activities",
      icon: <FaTasks className="w-5 h-5" />,
      path: "/admin/activities",
    },
    {
      name: "News",
      icon: <FaNewspaper className="w-5 h-5" />,
      path: "/admin/news",
    },
    {
      name: "Gallery",
      icon: <FaImages className="w-5 h-5" />,
      path: "/admin/gallery",
    },
    {
      name: "Team",
      icon: <FaUsers className="w-5 h-5" />,
      path: "/admin/team",
    },
    {
      name: "Contact",
      icon: <FaEnvelope className="w-5 h-5" />,
      path: "/admin/contact",
    },
    {
      name: "Settings",
      icon: <FaCog className="w-5 h-5" />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .sidebar-enter {
          animation: slideIn 0.3s ease-out;
        }
        .hover-glow {
          transition: all 0.3s ease;
        }
        .hover-glow:hover {
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
          transform: translateX(4px);
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
        text-white flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                BKSS Platform
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Admin Portal
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl transition-all hover-glow group relative ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/50"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <div className="mb-3 p-4 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || "admin@bkss.org"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-red-500/50 font-medium"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaBars className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="hidden md:flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5 min-w-[300px]">
                  <FaSearch className="text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group">
                  <FaBell className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || "Admin"}</p>
                        <p className="text-xs text-gray-500">{user?.email || "admin@bkss.org"}</p>
                      </div>
                      <button
                        onClick={() => navigate("/admin/settings")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <FaCog className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <p>© 2026 BKSS Platform. All Rights Reserved.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Status: <span className="font-semibold text-green-600">All Systems Operational</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;