import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaCar,
  FaUserShield,
  FaUserTie,
  FaArrowRight
} from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password);
      loginUser({
        accessToken: data.token,
        id: data.id,
        role: data.role,
        email: data.email || formData.email,
        name: data.name,
      });

      // Role-based navigation with delay for better UX
      setTimeout(() => {
        const role = data.role;
        if (role === "ADMIN") navigate("/dashboard/admin");
        else if (role === "DRIVER") navigate("/dashboard/driver");
        else navigate("/dashboard/passenger");
      }, 500);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const roleBenefits = [
    {
      role: "PASSENGER",
      icon: <FaUserTie />,
      title: "Passenger",
      benefits: ["Quick ride booking", "Real-time tracking", "Safe payments"]
    },
    {
      role: "DRIVER",
      icon: <FaCar />,
      title: "Driver",
      benefits: ["Flexible schedule", "Good earnings", "Support 24/7"]
    },
    {
      role: "ADMIN",
      icon: <FaUserShield />,
      title: "Admin",
      benefits: ["Full control", "Analytics", "User management"]
    }
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Form */}
        <motion.div
          className="login-form-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-wrapper">
            <div className="form-header">
              <div className="logo">
                <div className="logo-icon">🚖</div>
                <div className="logo-text">
                  <span className="logo-primary">YaVij</span>
                  <span className="logo-secondary">Express</span>
                </div>
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to access your dashboard</p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                className="alert alert-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <div className="alert-content">
                  ⚠️ {error}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  <span>Email Address</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  <span>Password</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
{/*                 <div className="form-options"> */}
{/*                   <Link to="/forgot-password" className="forgot-password"> */}
{/*                     Forgot Password? */}
{/*                   </Link> */}
{/*                 </div> */}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="signup-link">
                <p>Don't have an account?</p>
                <Link to="/register" className="signup-btn">
                  Create Account
                  <FaArrowRight />
                </Link>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right Side - Benefits */}
        <motion.div
          className="login-info-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="info-wrapper">
            <h2>One Platform, Multiple Roles</h2>
            <p className="info-subtitle">
              YaVij Express serves different user needs with dedicated dashboards
            </p>

            <div className="benefits-grid">
              {roleBenefits.map((role, index) => (
                <motion.div
                  key={role.role}
                  className="benefit-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="benefit-icon">
                    {role.icon}
                  </div>
                  <h3>{role.title}</h3>
                  <ul className="benefit-list">
                    {role.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <FaArrowRight className="bullet-icon" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="login-stats">
              <div className="stat-item">
                <div className="stat-value">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">99%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>

            {/* Security Info */}
            <div className="security-note">
              <div className="security-icon">🔒</div>
              <div className="security-text">
                <h4>Secure Login</h4>
                <p>Your credentials are encrypted with industry-standard security.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;