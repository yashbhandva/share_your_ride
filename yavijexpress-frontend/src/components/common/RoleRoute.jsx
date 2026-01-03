import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setChecking(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || checking) {
    return (
      <div className="role-checking-container">
        <div className="role-checking-spinner"></div>
        <div className="role-checking-text">
          Verifying access for <span className="role-checking-role">{user?.role || "..."}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-icon"></div>
        <h1 className="access-denied-title">Access Denied</h1>
        <p className="access-denied-message">
          Your role <strong>({user.role})</strong> does not have permission to access this page.
          Required roles: {allowedRoles.join(", ")}.
        </p>
        <div className="access-denied-actions">
          <a href="/" className="access-denied-btn access-denied-btn-primary">
            Go to Home
          </a>
          <a href="/profile" className="access-denied-btn access-denied-btn-secondary">
            View Profile
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RoleRoute;