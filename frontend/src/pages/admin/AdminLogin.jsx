import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role === "super_admin") {
      navigate("/super-admin/dashboard", { replace: true });
    } else {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      login(data.token, data.user);

      if (data.user.role === "super_admin") {
        navigate("/super-admin/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 60px rgba(59, 130, 246, 0.6); }
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl float-animation" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl float-animation" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 pulse-glow">
          
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <FaShieldAlt className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              BKSS Platform
            </h1>
            <p className="text-blue-200 font-medium">
              Admin Portal Access
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur-sm">
              <p className="text-red-200 text-sm font-medium text-center">
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-100">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bkss.org"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl 
                           text-white placeholder-blue-300/60 outline-none 
                           focus:bg-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-100">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                  <FaLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl 
                           text-white placeholder-blue-300/60 outline-none 
                           focus:bg-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       text-white font-bold rounded-xl shadow-lg hover:shadow-xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-blue-200 text-sm mt-6">
          © 2026 BKSS Platform. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;