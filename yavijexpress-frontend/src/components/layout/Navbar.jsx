import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FaHome,
  FaUser,
  FaBell,
  FaCreditCard,
  FaExclamationTriangle,
  FaCar,
  FaUserShield,
  FaUserTie,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaMoon,
  FaSun
} from "react-icons/fa";

// TERA CUSTOM LOGO IMPORT KARNA
import customLogo from "/img/logo.jpg.png"; // Tera logo path
// Ya fir: import customLogo from "/images/logo.png";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark-theme", !isDarkMode);
    document.documentElement.classList.toggle("light-theme", isDarkMode);
  };

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome />, show: true },
    { path: "/about", label: "About", show: true },
    { path: "/contact", label: "Contact", show: true },
  ];

  const userNavItems = [
    { path: "/profile", label: "Profile", icon: <FaUser />, role: "ALL" },
    { path: "/notifications", label: "Notifications", icon: <FaBell />, role: "ALL" },
    { path: "/payments", label: "Payments", icon: <FaCreditCard />, role: "ALL" },
    { path: "/emergency", label: "Emergency", icon: <FaExclamationTriangle />, role: "ALL" },
    {
      path: "/dashboard/passenger",
      label: "Dashboard",
      icon: <FaUserTie />,
      role: "PASSENGER"
    },
    {
      path: "/dashboard/driver",
      label: "Driver Dashboard",
      icon: <FaCar />,
      role: "DRIVER"
    },
    {
      path: "/dashboard/admin",
      label: "Admin Panel",
      icon: <FaUserShield />,
      role: "ADMIN"
    },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        {/* Left Section - Brand & Main Links */}
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <div className="brand-logo">
              {/* TERA CUSTOM LOGO YAHAN */}
              <div className="logo-container">
                <img
                  src={customLogo}
                  alt="YaVij Express Logo"
                  className="custom-logo"
                  onError={(e) => {
                    // If logo fails to load, show fallback
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="logo-fallback">
                        <div class="logo-icon">🚖</div>
                      </div>
                    `;
                  }}
                />
                {/* Loading State */}
                <div className="logo-loader"></div>
              </div>

              <div className="brand-text">
                <span className="brand-primary">YaVij</span>
                <span className="brand-secondary">Express</span>
                <div className="brand-tagline">Ride with Confidence</div>
              </div>
            </div>
          </Link>

          <div className="navbar-desktop-links">
            {navItems.map((item) => (
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                >
                  {item.icon && <span className="nav-icon">{item.icon}</span>}
                  {item.label}
                  {location.pathname === item.path && <span className="active-indicator"></span>}
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="navbar-right">
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {user ? (
            <>
              {/* User Profile Dropdown */}
              <div className="user-dropdown">
                <div className="user-avatar">
                  <div className="avatar-circle">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.name || "User"}</span>
                    <span className="user-role">{user.role?.toLowerCase()}</span>
                  </div>
                  <FaCog className="dropdown-arrow" />
                </div>

                <div className="dropdown-menu">
                  {userNavItems.map((item) => (
                    (item.role === "ALL" || user.role === item.role) && (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="dropdown-item"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )
                  ))}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </>
          ) : (
            <>
              {/* Auth Buttons */}
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>

              <button
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <div className="mobile-brand">
              <img
                src={customLogo}
                alt="YaVij Express Logo"
                className="mobile-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="mobile-logo-fallback">🚖</div>
                  `;
                }}
              />
              <div className="mobile-brand-text">
                <div className="mobile-brand-primary">YaVij Express</div>
                <div className="mobile-brand-tagline">Ride with Confidence</div>
              </div>
            </div>
          </div>

          <div className="mobile-menu-items">
            {/* Navigation Links */}
            {navItems.map((item) => (
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item ${location.pathname === item.path ? "active" : ""}`}
                >
                  {item.icon && <span className="mobile-nav-icon">{item.icon}</span>}
                  {item.label}
                </Link>
              )
            ))}

            {/* User Links */}
            {user && userNavItems.map((item) => (
              (item.role === "ALL" || user.role === item.role) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item ${location.pathname === item.path ? "active" : ""}`}
                >
                  {item.icon && <span className="mobile-nav-icon">{item.icon}</span>}
                  {item.label}
                </Link>
              )
            ))}

            {/* Auth Buttons for Mobile */}
            {!user && (
              <>
                <Link to="/login" className="mobile-nav-item">
                  <span className="mobile-nav-icon">🔑</span>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-item">
                  <span className="mobile-nav-icon">📝</span>
                  Register
                </Link>
              </>
            )}

            {/* Theme Toggle in Mobile */}
            <button className="mobile-nav-item theme-toggle-mobile" onClick={toggleTheme}>
              <span className="mobile-nav-icon">
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </span>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Logout Button */}
            {user && (
              <button className="mobile-nav-item logout" onClick={handleLogout}>
                <span className="mobile-nav-icon">
                  <FaSignOutAlt />
                </span>
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>
        )}
      </nav>

      {/* Navbar Spacer */}
      <div className="navbar-spacer"></div>
    </>
  );
};

export default Navbar;