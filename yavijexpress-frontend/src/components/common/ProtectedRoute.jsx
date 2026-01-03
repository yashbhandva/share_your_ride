import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Loading state assume karte hain

  if (loading) {
    return (
      <div className="auth-checking-container">
        <div className="auth-loading-spinner"></div>
        <div className="auth-loading-text">Checking authentication...</div>
      </div>
    );
  }

  if (!user) {
    // Optional: Redirect with message
    // setTimeout(() => {}, 100); // Small delay for UX
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;