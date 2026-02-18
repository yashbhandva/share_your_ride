import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { register } from "../api/authApi";
import "../assets/register.scss";

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
  FaCheckCircle,
  FaIdCard,
  FaFileAlt,
  FaInfoCircle,
  FaExclamationCircle
} from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "PASSENGER",
    aadhaarNumber: "",
    drivingLicense: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateFields = () => {
    const errors = {};

    // Aadhaar validation - Mandatory for all
    if (!form.aadhaarNumber || form.aadhaarNumber.trim() === "") {
      errors.aadhaarNumber = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(form.aadhaarNumber)) {
      errors.aadhaarNumber = "Aadhaar must be exactly 12 digits";
    }

    // Mobile validation
    if (!form.mobile || form.mobile.trim() === "") {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      errors.mobile = "Mobile must be exactly 10 digits";
    }

    // Driving License validation - Only for drivers
    if (form.role === "DRIVER") {
      if (!form.drivingLicense || form.drivingLicense.trim() === "") {
        errors.drivingLicense = "Driving license is required for drivers";
      } else if (form.drivingLicense.length < 5) {
        errors.drivingLicense = "Enter a valid driving license number";
      }
    }

    // Email validation
    if (!form.email || form.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email is invalid";
    }

    // Name validation
    if (!form.name || form.name.trim() === "") {
      errors.name = "Full name is required";
    } else if (form.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    return errors;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    // Basic validations
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

    // Field validations
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);

      // Show first error as main error
      const firstError = Object.values(validationErrors)[0];
      setError(`Please fix: ${firstError}`);
      return;
    }

    setLoading(true);

    try {
      // Prepare data matching backend DTO
      const apiData = {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        role: form.role,
        aadhaarNumber: form.aadhaarNumber,
        drivingLicense: form.drivingLicense
      };

      // For passenger, we still send drivingLicense but it can be empty
      // Backend will handle it as optional

      console.log('Sending to API:', apiData);

      await register(apiData);
      setSuccess("Registration successful! Redirecting to OTP verification...");
      setTimeout(() => navigate("/verify-otp", {
        state: {
          email: form.email,
          name: form.name,
          role: form.role,
          mobile: form.mobile
        }
      }), 2000);
    } catch (err) {
      console.log('Error response:', err.response);
      const respData = err.response?.data;

      let errorMessage = "Registration failed. Please try again.";

      if (typeof respData === "string") {
        const lines = respData.split('\n');
        const actualMessage = lines[lines.length - 1].trim();

        if (actualMessage && actualMessage !== '') {
          if (actualMessage.includes("Aadhaar already registered")) {
            errorMessage = "This Aadhaar number is already registered.";
          } else if (actualMessage.includes("Email already registered")) {
            errorMessage = "Email already registered. Please use a different email.";
          } else if (actualMessage.includes("Mobile number already registered")) {
            errorMessage = "Mobile number already registered.";
          } else if (actualMessage.includes("Aadhaar")) {
            errorMessage = "Invalid Aadhaar number. Please enter valid 12-digit Aadhaar.";
          } else if (actualMessage.includes("password")) {
            errorMessage = "Password must be at least 8 characters";
          } else {
            errorMessage = actualMessage;
          }
        }
      } else if (respData && typeof respData === "object") {
        // Handle validation errors from backend
        if (respData.errors) {
          const errorMessages = Object.values(respData.errors).flat();
          errorMessage = errorMessages.join(", ");
        } else if (respData.message) {
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
      "24/7 customer support",
      "Aadhaar verification required"
    ],
    DRIVER: [
      "Aadhaar + Driving License required",
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
                  <span className="logo-primary">Yavigo</span>
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
                    <FaExclamationCircle /> {error}
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
                    <FaCheckCircle /> {success}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser className="input-icon" />
                  <span>Full Name *</span>
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
                {fieldErrors.name && (
                  <div className="field-error">
                    <FaExclamationCircle /> {fieldErrors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  <span>Email Address *</span>
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
                {fieldErrors.email && (
                  <div className="field-error">
                    <FaExclamationCircle /> {fieldErrors.email}
                  </div>
                )}
              </div>

              {/* Mobile Field */}
              <div className="form-group">
                <label htmlFor="mobile">
                  <FaPhone className="input-icon" />
                  <span>Mobile Number *</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit mobile number"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="form-input"
                />
                {fieldErrors.mobile && (
                  <div className="field-error">
                    <FaExclamationCircle /> {fieldErrors.mobile}
                  </div>
                )}
                <div className="field-note">
                  <FaInfoCircle /> Required for OTP verification
                </div>
              </div>

              {/* Aadhaar Field (Mandatory for all) */}
              <div className="form-group">
                <label htmlFor="aadhaarNumber">
                  <FaIdCard className="input-icon" />
                  <span>Aadhaar Number *</span>
                </label>
                <input
                  id="aadhaarNumber"
                  type="text"
                  name="aadhaarNumber"
                  value={form.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength="12"
                  pattern="[0-9]{12}"
                  required
                  className="form-input"
                />
                {fieldErrors.aadhaarNumber && (
                  <div className="field-error">
                    <FaExclamationCircle /> {fieldErrors.aadhaarNumber}
                  </div>
                )}
                <div className="field-note">
                  <FaInfoCircle /> Required for KYC verification
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  <span>Password *</span>
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
                  <span>Confirm Password *</span>
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
                  <span>Account Type *</span>
                </label>
                <div className="role-selection">
                  <button
                    type="button"
                    className={`role-option ${form.role === 'PASSENGER' ? 'selected' : ''}`}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        role: 'PASSENGER',
                        drivingLicense: ""
                      }));
                    }}
                  >
                    <FaUserTie />
                    <span>Passenger</span>
                    <p>Book rides and travel</p>
                    <div className="role-note">Aadhaar Required</div>
                  </button>
                  <button
                    type="button"
                    className={`role-option ${form.role === 'DRIVER' ? 'selected' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, role: 'DRIVER' }))}
                  >
                    <FaCar />
                    <span>Driver</span>
                    <p>Earn by driving</p>
                    <div className="role-note">Aadhaar + License Required</div>
                  </button>
                </div>
              </div>

              {/* Driving License Field (Only for Drivers) */}
              <AnimatePresence>
                {form.role === "DRIVER" && (
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="drivingLicense">
                      <FaFileAlt className="input-icon" />
                      <span>Driving License *</span>
                    </label>
                    <input
                      id="drivingLicense"
                      type="text"
                      name="drivingLicense"
                      value={form.drivingLicense}
                      onChange={handleChange}
                      placeholder="Enter your driving license number"
                      required={form.role === "DRIVER"}
                      className="form-input"
                    />
                    {fieldErrors.drivingLicense && (
                      <div className="field-error">
                        <FaExclamationCircle /> {fieldErrors.drivingLicense}
                      </div>
                    )}
                    <div className="field-note">
                      <FaInfoCircle /> Required for driver verification
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
              <h2>Why Join Yavigo ?</h2>
              <p className="benefits-subtitle">
                Choose the account type that fits your needs
              </p>
            </div>

            {/* Role Benefits */}
            <div className="benefits-container">
              <div className="benefits-tabs">
                <button
                  className={`benefits-tab ${form.role === 'PASSENGER' ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({
                    ...prev,
                    role: 'PASSENGER',
                    drivingLicense: ""
                  }))}
                >
                  <FaUserTie />
                  Passenger Benefits
                </button>
                <button
                  className={`benefits-tab ${form.role === 'DRIVER' ? 'active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, role: 'DRIVER' }))}
                >
                  <FaCar />
                  Driver Benefits
                </button>
              </div>

              <div className="benefits-content">
                <h3>{form.role === 'PASSENGER' ? 'Passenger' : 'Driver'} Requirements</h3>
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
                <h4>Secure & Verified Platform</h4>
              </div>
              <p>We use bank-level security and mandatory KYC verification to ensure your safety.</p>
              <div className="security-features">
                <div className="security-feature">
                  <div className="feature-icon">🆔</div>
                  <div className="feature-text">
                    <strong>Aadhaar Verification</strong>
                    <span>Mandatory for all users</span>
                  </div>
                </div>
                <div className="security-feature">
                  <div className="feature-icon">📄</div>
                  <div className="feature-text">
                    <strong>Document Check</strong>
                    <span>Drivers verified thoroughly</span>
                  </div>
                </div>
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
                <div className="stat-label">Verified Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">KYC Verified</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4.9</div>
                <div className="stat-label">Safety Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;