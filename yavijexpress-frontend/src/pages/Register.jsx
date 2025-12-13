import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../api/authApi";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUserTie,
  FaCar,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "PASSENGER",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await register(form);
      setSuccess("Registration successful! Redirecting to OTP verification...");
      setTimeout(() => navigate("/verify-otp", {
        state: {
          email: form.email,
          name: form.name
        }
      }), 2000);
    } catch (err) {
      console.log('Error response:', err.response);
      const status = err.response?.status;
      const respData = err.response?.data;

      let errorMessage = "Registration failed. Please try again.";

      if (typeof respData === "string") {
        const lines = respData.split('\n');
        const actualMessage = lines[lines.length - 1].trim() || lines[lines.length - 2]?.trim();

        if (actualMessage && actualMessage !== '') {
          if (actualMessage.includes("Email already registered")) {
            errorMessage = "Email already registered. Please use a different email or login.";
          } else if (actualMessage.includes("Mobile number already registered")) {
            errorMessage = "Mobile number already registered.";
          } else if (actualMessage.includes("password")) {
            errorMessage = "Password must be at least 8 characters";
          } else {
            errorMessage = actualMessage;
          }
        }
      } else if (respData && typeof respData === "object") {
        if (respData.message) {
          errorMessage = respData.message;
        } else {
          const messages = Object.values(respData).filter(msg => msg && typeof msg === 'string');
          if (messages.length > 0) {
            errorMessage = messages.join("\n");
          }
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roleBenefits = {
    PASSENGER: [
      "Quick ride booking",
      "Real-time tracking",
      "Multiple payment options",
      "24/7 customer support"
    ],
    DRIVER: [
      "Flexible working hours",
      "Good earning potential",
      "Weekly payments",
      "Vehicle support programs"
    ]
  };

  const passwordRequirements = [
    "At least 8 characters",
    "One uppercase letter",
    "One lowercase letter",
    "One number",
    "One special character"
  ];

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Form */}
        <motion.div
          className="register-form-section"
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
              <h1>Create Account</h1>
              <p>Join thousands of users in our ride-sharing community</p>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="alert alert-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="alert-content">
                    ⚠️ {error}
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="alert alert-success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="alert-content">
                    ✅ {success}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser className="input-icon" />
                  <span>Full Name</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="form-input"
                />
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  <span>Email Address</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                />
              </div>

              {/* Mobile Field */}
              <div className="form-group">
                <label htmlFor="mobile">
                  <FaPhone className="input-icon" />
                  <span>Mobile Number</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit mobile number"
                  className="form-input"
                />
              </div>

              {/* Password Field */}
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
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
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

                {/* Password Requirements */}
                <div className="requirements-list">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`requirement-item ${
                        checkPasswordRequirement(form.password, index) ? 'met' : ''
                      }`}
                    >
                      <FaCheckCircle className="check-icon" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaLock className="input-icon" />
                  <span>Confirm Password</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label>
                  <FaUserTie className="input-icon" />
                  <span>Account Type</span>
                </label>
                <div className="role-selection">
                  <button
                    type="button"
                    className={`role-option ${form.role === 'PASSENGER' ? 'selected' : ''}`}
                    onClick={() => setForm({...form, role: 'PASSENGER'})}
                  >
                    <FaUserTie />
                    <span>Passenger</span>
                    <p>Book rides and travel</p>
                  </button>
                  <button
                    type="button"
                    className={`role-option ${form.role === 'DRIVER' ? 'selected' : ''}`}
                    onClick={() => setForm({...form, role: 'DRIVER'})}
                  >
                    <FaCar />
                    <span>Driver</span>
                    <p>Earn by driving</p>
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="terms-group">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="terms" className="terms-label">
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${loading ? "loading" : ""}`}
                disabled={loading || !termsAccepted}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight />
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="login-link">
                <p>Already have an account?</p>
                <Link to="/login" className="login-btn">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right Side - Benefits */}
        <motion.div
          className="register-info-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="info-wrapper">
            <div className="benefits-header">
              <h2>Why Join YaVij Express?</h2>
              <p className="benefits-subtitle">
                Choose the account type that fits your needs
              </p>
            </div>

            {/* Role Benefits */}
            <div className="benefits-container">
              <div className="benefits-tabs">
                <button
                  className={`benefits-tab ${form.role === 'PASSENGER' ? 'active' : ''}`}
                  onClick={() => setForm({...form, role: 'PASSENGER'})}
                >
                  <FaUserTie />
                  Passenger Benefits
                </button>
                <button
                  className={`benefits-tab ${form.role === 'DRIVER' ? 'active' : ''}`}
                  onClick={() => setForm({...form, role: 'DRIVER'})}
                >
                  <FaCar />
                  Driver Benefits
                </button>
              </div>

              <div className="benefits-content">
                <h3>{form.role === 'PASSENGER' ? 'Passenger' : 'Driver'} Benefits</h3>
                <ul className="benefits-list">
                  {roleBenefits[form.role].map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FaCheckCircle className="benefit-icon" />
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Security Info */}
            <div className="security-info">
              <div className="security-header">
                <FaShieldAlt className="security-icon" />
                <h4>Secure Registration</h4>
              </div>
              <p>Your personal information is protected with bank-level security and encryption.</p>
              <div className="security-features">
                <div className="security-feature">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-text">
                    <strong>Data Encryption</strong>
                    <span>End-to-end protection</span>
                  </div>
                </div>
                <div className="security-feature">
                  <div className="feature-icon">🛡️</div>
                  <div className="feature-text">
                    <strong>Privacy First</strong>
                    <span>We don't share your data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-value">50K+</div>
                <div className="stat-label">Registered Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">25+</div>
                <div className="stat-label">Cities</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4.9</div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper function to check password requirements
const checkPasswordRequirement = (password, index) => {
  switch(index) {
    case 0: return password.length >= 8;
    case 1: return /[A-Z]/.test(password);
    case 2: return /[a-z]/.test(password);
    case 3: return /[0-9]/.test(password);
    case 4: return /[^A-Za-z0-9]/.test(password);
    default: return false;
  }
};

// Import AnimatePresence
import { AnimatePresence } from "framer-motion";

export default Register;