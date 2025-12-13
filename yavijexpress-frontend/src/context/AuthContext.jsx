import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { logoutApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("userRole");
        const email = localStorage.getItem("userEmail");
        const name = localStorage.getItem("userName");
        const idStr = localStorage.getItem("userId");
        const storedLoginTime = localStorage.getItem("loginTime");
        const id = idStr ? Number(idStr) : null;

        if (token && role) {
          setUser({ id, email, role, name });
          setLoginTime(storedLoginTime ? new Date(storedLoginTime) : new Date());

          // Set session expiry (24 hours from login)
          const expiry = new Date();
          expiry.setHours(expiry.getHours() + 24);
          setSessionExpiry(expiry);

          // Save login time if not already saved
          if (!storedLoginTime) {
            localStorage.setItem("loginTime", new Date().toISOString());
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-logout when session expires
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSession = () => {
      if (new Date() >= sessionExpiry) {
        handleAutoLogout("Your session has expired. Please login again.");
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // Session warning 5 minutes before expiry
  useEffect(() => {
    if (!sessionExpiry) return;

    const warnBeforeExpiry = () => {
      const now = new Date();
      const warningTime = new Date(sessionExpiry.getTime() - 5 * 60000); // 5 minutes before

      if (now >= warningTime && now < sessionExpiry) {
        // You can trigger a notification here
        console.warn("Session will expire in 5 minutes");
        // Optionally dispatch a custom event for UI notification
        window.dispatchEvent(new CustomEvent('session-warning'));
      }
    };

    const interval = setInterval(warnBeforeExpiry, 60000);
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  const handleAutoLogout = useCallback((message) => {
    logoutUser();

    // Dispatch event for UI to show notification
    window.dispatchEvent(new CustomEvent('session-expired', {
      detail: { message }
    }));
  }, []);

  const loginUser = useCallback(({ accessToken, id, role, email, name }) => {
    // Clear any existing session data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTime");

    // Set new session data
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userRole", role);
    if (id != null) localStorage.setItem("userId", String(id));
    if (email) localStorage.setItem("userEmail", email);
    if (name) localStorage.setItem("userName", name);

    const loginTime = new Date();
    localStorage.setItem("loginTime", loginTime.toISOString());

    // Set user state
    setUser({ id, email, role, name });
    setLoginTime(loginTime);

    // Set session expiry (24 hours)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    setSessionExpiry(expiry);

    // Dispatch login event for analytics/audit
    window.dispatchEvent(new CustomEvent('user-login', {
      detail: { userId: id, role, timestamp: loginTime }
    }));
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      // Dispatch logout event for analytics/audit
      if (user) {
        window.dispatchEvent(new CustomEvent('user-logout', {
          detail: { userId: user.id, role: user.role, timestamp: new Date() }
        }));
      }

      await logoutApi();
    } catch (error) {
      console.warn("Logout API error (proceeding with client logout):", error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear all auth-related localStorage
      const keysToRemove = [
        "accessToken",
        "userRole",
        "userEmail",
        "userName",
        "userId",
        "loginTime"
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear session timer
      setSessionExpiry(null);
      setLoginTime(null);
      setUser(null);
    }
  }, [user]);

  // Update user profile (partial updates)
  const updateUserProfile = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return prev;

      const updatedUser = { ...prev, ...updates };

      // Sync with localStorage
      if (updates.name) {
        localStorage.setItem("userName", updates.name);
      }
      if (updates.email) {
        localStorage.setItem("userEmail", updates.email);
      }

      return updatedUser;
    });
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  }, [user]);

  // Get session duration in minutes
  const getSessionDuration = useCallback(() => {
    if (!loginTime) return 0;
    return Math.floor((new Date() - loginTime) / 60000);
  }, [loginTime]);

  // Get time until session expiry in minutes
  const getTimeUntilExpiry = useCallback(() => {
    if (!sessionExpiry) return 0;
    const diff = sessionExpiry - new Date();
    return Math.max(0, Math.floor(diff / 60000));
  }, [sessionExpiry]);

  // Refresh session (extend expiry)
  const refreshSession = useCallback(() => {
    if (!user) return false;

    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // Extend by 24 hours
    setSessionExpiry(expiry);

    return true;
  }, [user]);

  // Clear session data (without API call)
  const clearSession = useCallback(() => {
    const keysToRemove = [
      "accessToken",
      "userRole",
      "userEmail",
      "userName",
      "userId",
      "loginTime"
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));
    setSessionExpiry(null);
    setLoginTime(null);
    setUser(null);
  }, []);

  // Validate token (simplified - in real app, would call API)
  const validateToken = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }, []);

  const value = {
    user,
    loading,
    loginUser,
    logoutUser,
    updateUserProfile,
    hasRole,
    hasAnyRole,
    getSessionDuration,
    getTimeUntilExpiry,
    refreshSession,
    clearSession,
    validateToken,
    isAuthenticated: !!user,
    sessionExpiry,
    loginTime
  };

  // Show loading state while initializing
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loader">
          <div className="loader-spinner"></div>
          <p>Initializing session...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};