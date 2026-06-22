import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenExpiryTimer = useRef(null);

  // Decode JWT to get expiration time
  const getTokenExpiration = (jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    
    // Clear timer
    if (tokenExpiryTimer.current) {
      clearTimeout(tokenExpiryTimer.current);
      tokenExpiryTimer.current = null;
    }
  }, []);

  // Setup auto-logout timer
  const setupAutoLogout = useCallback((jwtToken) => {
    // Clear any existing timer
    if (tokenExpiryTimer.current) {
      clearTimeout(tokenExpiryTimer.current);
    }

    const expirationTime = getTokenExpiration(jwtToken);
    if (!expirationTime) {
      return;
    }

    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    // If token is already expired
    if (timeUntilExpiry <= 0) {
      logout();
      // Redirect will be handled by the route protection
      return;
    }

    // Set timer to logout when token expires
    tokenExpiryTimer.current = setTimeout(() => {
      console.log("Token expired - Auto logout");
      logout();
      // Force reload to redirect to login
      window.location.href = '/login';
    }, timeUntilExpiry);

    console.log(`Auto-logout scheduled in ${Math.round(timeUntilExpiry / 1000 / 60)} minutes`);
  }, [logout]);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        // Check if token is still valid
        const expirationTime = getTokenExpiration(storedToken);
        const currentTime = Date.now();

        if (expirationTime && expirationTime > currentTime) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setupAutoLogout(storedToken);
        } else {
          // Token expired, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }

    // Cleanup timer on unmount
    return () => {
      if (tokenExpiryTimer.current) {
        clearTimeout(tokenExpiryTimer.current);
      }
    };
  }, [setupAutoLogout]);

  const login = (jwtToken, userData) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
    
    // Setup auto-logout timer
    setupAutoLogout(jwtToken);
  };

  const hasRole = (...roles) => {
    return roles.includes(user?.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};