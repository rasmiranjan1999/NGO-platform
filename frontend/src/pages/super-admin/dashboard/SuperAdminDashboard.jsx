import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import {
  FaUserShield,
  FaUsers,
  FaUserFriends,
  FaHourglassHalf,
  FaTasks,
  FaNewspaper,
  FaImages,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRocket,
  FaBell,
} from "react-icons/fa";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [statsRes, activitiesRes, healthRes, notificationsRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/recent-activities?limit=6"),
        api.get("/dashboard/system-health"),
        api.get("/dashboard/notifications?limit=5"),
      ]);

      setStats(statsRes.data.data);
      setRecentActivities(activitiesRes.data.data);
      setSystemHealth(healthRes.data.data);
      setNotifications(notificationsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getActivityIcon = (category) => {
    switch (category) {
      case 'member':
        return <FaUsers />;
      case 'volunteer':
        return <FaUserFriends />;
      case 'news':
        return <FaNewspaper />;
      case 'activity':
        return <FaTasks />;
      default:
        return <FaCheckCircle />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Admins",
      value: stats?.admins || 0,
      icon: <FaUserShield className="w-8 h-8" />,
      gradient: "from-purple-500 to-purple-700",
      bgGradient: "from-purple-50 to-purple-100",
      change: "+2",
      changeType: "up",
    },
    {
      title: "Total Members",
      value: stats?.members || 0,
      icon: <FaUsers className="w-8 h-8" />,
      gradient: "from-blue-500 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100",
      change: "+12",
      changeType: "up",
    },
    {
      title: "Volunteers",
      value: stats?.volunteers || 0,
      icon: <FaUserFriends className="w-8 h-8" />,
      gradient: "from-green-500 to-green-700",
      bgGradient: "from-green-50 to-green-100",
      change: "+8",
      changeType: "up",
    },
    {
      title: "Pending Requests",
      value: stats?.pending_volunteers || 0,
      icon: <FaHourglassHalf className="w-8 h-8" />,
      gradient: "from-orange-500 to-orange-700",
      bgGradient: "from-orange-50 to-orange-100",
      change: "-3",
      changeType: "down",
      alert: (stats?.pending_volunteers || 0) > 5,
    },
  ];

  const contentCards = [
    {
      title: "Activities",
      value: stats?.activities || 0,
      icon: <FaTasks className="w-6 h-6" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "News Articles",
      value: stats?.news || 0,
      icon: <FaNewspaper className="w-6 h-6" />,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Gallery Images",
      value: stats?.gallery_images || 0,
      icon: <FaImages className="w-6 h-6" />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
  ];

  const quickActions = [
    {
      title: "Manage Admins",
      description: "Add, edit, or remove admin users",
      icon: <FaUserShield className="w-5 h-5" />,
      path: "/super-admin/admins",
      color: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    },
    {
      title: "Review Volunteers",
      description: `${stats?.pending_volunteers || 0} pending applications`,
      icon: <FaUserFriends className="w-5 h-5" />,
      path: "/super-admin/volunteers",
      color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      badge: stats?.pending_volunteers || 0,
    },
    {
      title: "Manage Content",
      description: "Update activities, news & gallery",
      icon: <FaTasks className="w-5 h-5" />,
      path: "/super-admin/activities",
      color: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: <FaClock className="w-5 h-5" />,
      path: "/super-admin/settings",
      color: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
    },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out backwards;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }
      `}</style>

      {/* Header Section */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FaRocket className="text-blue-600" />
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your platform today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className={`px-6 py-3 rounded-xl font-semibold shadow-lg ${
              systemHealth?.overall?.operational 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
            }`}>
              {systemHealth?.overall?.operational ? '✓ System Active' : '⚠ System Check'}
            </div>
          </div>
        </div>

        {/* Notifications Bar */}
        {notifications.length > 0 && (
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaBell className="text-blue-600 w-5 h-5 mt-1 animate-pulse" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notif, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{notif.message}</span>
                      {notif.action && (
                        <button
                          onClick={() => navigate(notif.action)}
                          className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap ml-4"
                        >
                          {notif.actionText || 'View'} →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className="animate-slide-up hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} p-6 border border-gray-200 shadow-lg`}>
              {card.alert && (
                <div className="absolute top-3 right-3">
                  <FaExclamationTriangle className="text-orange-500 w-5 h-5 animate-pulse" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                  {card.icon}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {card.value}
                  </h3>
                  {card.change && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      card.changeType === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {card.changeType === "up" ? (
                        <FaArrowUp className="w-3 h-3" />
                      ) : (
                        <FaArrowDown className="w-3 h-3" />
                      )}
                      {card.change}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Statistics */}
      <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaChartLine className="text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-gray-900">Content Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contentCards.map((card, index) => (
              <div
                key={card.title}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md"
              >
                <div className={`${card.bgColor} p-3 rounded-xl`}>
                  <div className={card.color}>{card.icon}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white rounded-xl p-6 text-left transition-all hover:shadow-xl hover:scale-105 relative group`}
            >
              {action.badge > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse">
                  {action.badge}
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                {action.icon}
                <h3 className="font-bold text-lg">{action.title}</h3>
              </div>
              <p className="text-white/90 text-sm">{action.description}</p>
              <div className="mt-4 flex items-center text-sm font-semibold">
                Go to section →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaClock className="text-blue-600" />
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === "success" ? "bg-green-100 text-green-600" :
                      activity.type === "warning" ? "bg-orange-100 text-orange-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>
                      {getActivityIcon(activity.category)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaClock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activities</p>
                </div>
              )}
            </div>
            {recentActivities.length > 0 && (
              <button 
                onClick={() => fetchDashboardData()}
                className="w-full mt-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors"
              >
                Refresh Activity →
              </button>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              System Health
            </h2>
            {systemHealth ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Database</span>
                    <span className={`text-sm font-semibold ${
                      systemHealth.database.health >= 90 ? 'text-green-600' : 
                      systemHealth.database.health >= 70 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {systemHealth.database.status} ({systemHealth.database.latency}ms)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        systemHealth.database.health >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                        systemHealth.database.health >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${systemHealth.database.health}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Server Response</span>
                    <span className="text-sm font-semibold text-green-600">
                      {systemHealth.server.status}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                      style={{ width: `${systemHealth.server.health}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                    <span className={`text-sm font-semibold ${
                      systemHealth.storage.percentage < 50 ? 'text-green-600' : 
                      systemHealth.storage.percentage < 80 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {systemHealth.storage.status} ({systemHealth.storage.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        systemHealth.storage.percentage < 50 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                        systemHealth.storage.percentage < 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${systemHealth.storage.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">API Performance</span>
                    <span className="text-sm font-semibold text-green-600">
                      {systemHealth.api.status}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" 
                      style={{ width: `${systemHealth.api.health}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p>Loading system health...</p>
              </div>
            )}
            {systemHealth && (
              <div className={`mt-6 p-4 border rounded-lg ${
                systemHealth.overall.operational 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className={`flex items-center gap-2 ${
                  systemHealth.overall.operational ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {systemHealth.overall.operational ? (
                    <FaCheckCircle className="w-5 h-5" />
                  ) : (
                    <FaExclamationTriangle className="w-5 h-5" />
                  )}
                  <span className="font-semibold">{systemHealth.overall.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;