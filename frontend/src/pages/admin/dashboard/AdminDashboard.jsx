import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import {
  FaUsers,
  FaUserFriends,
  FaTasks,
  FaNewspaper,
  FaImages,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaSync,
  FaEye,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSync className="animate-spin text-5xl text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats?.members || 0,
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Volunteers",
      value: stats?.volunteers || 0,
      icon: FaUserFriends,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-100",
      textColor: "text-green-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Pending Volunteers",
      value: stats?.pending_volunteers || 0,
      icon: FaClock,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-100",
      textColor: "text-amber-600",
      trend: "5 New",
      trendUp: false,
    },
    {
      title: "Activities",
      value: stats?.activities || 0,
      icon: FaTasks,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      textColor: "text-purple-600",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "News Articles",
      value: stats?.news || 0,
      icon: FaNewspaper,
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50 to-rose-100",
      textColor: "text-pink-600",
      trend: "+3%",
      trendUp: true,
    },
    {
      title: "Gallery Images",
      value: stats?.gallery_images || 0,
      icon: FaImages,
      color: "from-cyan-500 to-teal-600",
      bgColor: "from-cyan-50 to-teal-100",
      textColor: "text-cyan-600",
      trend: "+20%",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      title: "Manage Volunteers",
      description: "Review and approve volunteer applications",
      icon: FaUserFriends,
      color: "from-green-600 to-emerald-600",
      path: "/admin/volunteers",
    },
    {
      title: "Manage Members",
      description: "Add and manage organization members",
      icon: FaUsers,
      color: "from-blue-600 to-indigo-600",
      path: "/admin/members",
    },
    {
      title: "Activities",
      description: "Create and manage activities",
      icon: FaTasks,
      color: "from-purple-600 to-violet-600",
      path: "/admin/activities",
    },
    {
      title: "News",
      description: "Publish news and updates",
      icon: FaNewspaper,
      color: "from-pink-600 to-rose-600",
      path: "/admin/news",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back! Here's what's happening with your organization today.
          </p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group relative bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgColor} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white text-2xl" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${card.trendUp ? 'text-green-600' : 'text-slate-600'}`}>
                    {card.trendUp ? <FaArrowUp /> : <FaClock />}
                    {card.trend}
                  </div>
                </div>
                
                <p className="text-sm font-medium text-slate-600 mb-2">{card.title}</p>
                <h3 className={`text-4xl font-bold ${card.textColor} mb-2`}>
                  {card.value.toLocaleString()}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FaChartLine />
                  <span>vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <FaPlus className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            <p className="text-sm text-slate-500">Commonly used features for faster access</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 hover:from-white hover:to-slate-50 rounded-xl p-6 text-left border-2 border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Stats */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Platform Summary</h2>
              <p className="text-sm text-slate-500">Overview of your platform metrics</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Members</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.members || 0}</p>
                </div>
              </div>
              <FaCheckCircle className="text-blue-500 text-2xl" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaUserFriends className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Approved Volunteers</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.volunteers || 0}</p>
                </div>
              </div>
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <FaClock className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-amber-600">{stats?.pending_volunteers || 0}</p>
                </div>
              </div>
              <FaExclamationCircle className="text-amber-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <FaNewspaper className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Content Overview</h2>
              <p className="text-sm text-slate-500">Your published content statistics</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FaTasks className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Activities Published</p>
                  <p className="text-2xl font-bold text-purple-600">{stats?.activities || 0}</p>
                </div>
              </div>
              <button className="text-purple-500 hover:text-purple-700 transition-colors">
                <FaEye className="text-xl" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                  <FaNewspaper className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">News Articles</p>
                  <p className="text-2xl font-bold text-pink-600">{stats?.news || 0}</p>
                </div>
              </div>
              <button className="text-pink-500 hover:text-pink-700 transition-colors">
                <FaEye className="text-xl" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <FaImages className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Gallery Images</p>
                  <p className="text-2xl font-bold text-cyan-600">{stats?.gallery_images || 0}</p>
                </div>
              </div>
              <button className="text-cyan-500 hover:text-cyan-700 transition-colors">
                <FaEye className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;