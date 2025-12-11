import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    "nav-link" + (isActive(path) ? " nav-link-active" : "");

  return (
    <nav className="nav-root">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          YaVij Express
        </Link>
        <Link to="/about" className={linkClass("/about")}>
          About
        </Link>
        <Link to="/contact" className={linkClass("/contact")}>
          Contact
        </Link>
      </div>

      <div className="nav-right">
        {!user && (
          <>
            <Link to="/login" className={linkClass("/login")}>
              Login
            </Link>
            <Link to="/register" className={linkClass("/register")}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
            <Link
              to="/notifications"
              className={linkClass("/notifications")}
            >
              Notifications
            </Link>
            <Link to="/payments" className={linkClass("/payments")}>
              Payments
            </Link>
            <Link to="/emergency" className={linkClass("/emergency")}>
              Emergency
            </Link>
            {user.role === "PASSENGER" && (
              <Link
                to="/dashboard/passenger"
                className={linkClass("/dashboard/passenger")}
              >
                Passenger
              </Link>
            )}
            {user.role === "DRIVER" && (
              <Link
                to="/dashboard/driver"
                className={linkClass("/dashboard/driver")}
              >
                Driver
              </Link>
            )}
            {user.role === "ADMIN" && (
              <Link
                to="/dashboard/admin"
                className={linkClass("/dashboard/admin")}
              >
                Admin
              </Link>
            )}
            <button className="nav-button" onClick={logoutUser}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
