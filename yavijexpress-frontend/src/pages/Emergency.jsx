import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosClient";

import {
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaPaperPlane,
  FaShieldAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaPhone,
  FaUser,
  FaGlobe,
  FaSpinner
} from "react-icons/fa";

const Emergency = () => {
  const [form, setForm] = useState({
    tripId: "",
    message: "",
    latitude: "",
    longitude: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      setLoading(true);
      const payload = {
        tripId: Number(form.tripId),
        message: form.message,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };
      const res = await api.post("/api/emergency/sos", payload);
      setResult(res.data || null);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send SOS alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const emergencyTypes = [
    { id: 1, title: "Medical Emergency", desc: "Need immediate medical assistance" },
    { id: 2, title: "Accident", desc: "Vehicle accident or collision" },
    { id: 3, title: "Safety Concern", desc: "Feel unsafe or threatened" },
    { id: 4, title: "Vehicle Breakdown", desc: "Stranded due to vehicle issue" },
  ];

  const handleEmergencyTypeClick = (title) => {
    setForm(prev => ({ ...prev, message: title }));
  };

  return (
    <div className="emergency-page">
      <div className="emergency-container">
        {/* Left Section - Form */}
        <motion.div
          className="emergency-form-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-wrapper">
            <div className="form-header">
              <div className="logo">
                <div className="logo-icon">🚨</div>
                <div className="logo-text">
                  <span className="logo-primary">Emergency</span>
                  <span className="logo-secondary">Response</span>
                </div>
              </div>
              <h1>Send Emergency Alert</h1>
              <p>Use this form to send an immediate SOS alert linked to your trip</p>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="alert alert-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="alert-content">
                    <FaExclamationTriangle /> {error}
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  className="alert alert-success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="alert-content">
                    <FaCheckCircle />
                    <div>
                      <strong>SOS Alert Sent Successfully!</strong>
                      <p>Response ID: {result.id || "N/A"} • Time: {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="emergency-form">
              {/* Trip ID */}
              <div className="form-group">
                <label htmlFor="tripId">
                  <FaUser className="input-icon" />
                  <span>Trip ID</span>
                </label>
                <input
                  id="tripId"
                  type="text"
                  name="tripId"
                  value={form.tripId}
                  onChange={handleChange}
                  placeholder="Enter your trip identifier"
                  required
                  className="form-input"
                />
                <p className="form-hint">Numeric identifier of your ongoing trip</p>
              </div>

              {/* Emergency Message */}
              <div className="form-group">
                <label htmlFor="message">
                  <FaExclamationTriangle className="input-icon" />
                  <span>Emergency Description</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe the emergency situation in detail..."
                  required
                  className="form-input textarea"
                  rows="3"
                />
                <p className="form-hint">Be specific about what happened and what help you need</p>
              </div>

              {/* Quick Emergency Types */}
              <div className="form-group">
                <label>
                  <FaInfoCircle className="input-icon" />
                  <span>Quick Select Emergency Type</span>
                </label>
                <div className="emergency-types">
                  {emergencyTypes.map((type) => (
                    <button
                      type="button"
                      key={type.id}
                      className={`emergency-type-btn ${
                        form.message === type.title ? 'selected' : ''
                      }`}
                      onClick={() => handleEmergencyTypeClick(type.title)}
                    >
                      <span className="type-title">{type.title}</span>
                      <span className="type-desc">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordinates Toggle */}
              <div className="form-group">
                <div className="coordinates-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${showCoordinates ? 'active' : ''}`}
                    onClick={() => setShowCoordinates(!showCoordinates)}
                  >
                    <FaGlobe />
                    {showCoordinates ? 'Hide Coordinates' : 'Add Location Coordinates'}
                  </button>
                  <p className="toggle-hint">Optional: Provide exact GPS coordinates for faster response</p>
                </div>
              </div>

              {/* Coordinates Fields (Conditional) */}
              <AnimatePresence>
                {showCoordinates && (
                  <motion.div
                    className="coordinates-grid"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="form-group">
                      <label htmlFor="latitude">
                        <FaMapMarkerAlt className="input-icon" />
                        <span>Latitude</span>
                      </label>
                      <input
                        id="latitude"
                        type="text"
                        name="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        placeholder="e.g., 28.7041"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="longitude">
                        <FaMapMarkerAlt className="input-icon" />
                        <span>Longitude</span>
                      </label>
                      <input
                        id="longitude"
                        type="text"
                        name="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        placeholder="e.g., 77.1025"
                        className="form-input"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Important Note */}
              <div className="warning-note">
                <div className="warning-header">
                  <FaExclamationTriangle />
                  <span>Important Notice</span>
                </div>
                <p>
                  This will trigger a real emergency response. Use only in genuine emergencies.
                  False alerts may lead to legal action.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner-icon" />
                    Sending Emergency Alert...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="btn-icon" />
                    Send Emergency SOS
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right Section - Info */}
        <motion.div
          className="emergency-info-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="info-wrapper">
            <div className="info-header">
              <h2>Emergency Response Protocol</h2>
              <p className="info-subtitle">
                Here's what happens when you send an SOS
              </p>
            </div>

            {/* Response Steps */}
            <div className="response-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Immediate Alert</h4>
                  <p>Emergency services and trip contacts are notified instantly</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Location Sharing</h4>
                  <p>Your real-time location is shared with responders</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Live Monitoring</h4>
                  <p>Trip details and status are monitored continuously</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Support Call</h4>
                  <p>Emergency coordinator calls you within 2 minutes</p>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="contacts-section">
              <div className="section-header">
                <FaPhone className="section-icon" />
                <h4>Emergency Contacts</h4>
              </div>
              <div className="contact-list">
                <div className="contact-item">
                  <div className="contact-type">Police</div>
                  <div className="contact-number">100</div>
                </div>
                <div className="contact-item">
                  <div className="contact-type">Ambulance</div>
                  <div className="contact-number">102</div>
                </div>
                <div className="contact-item">
                  <div className="contact-type">Fire</div>
                  <div className="contact-number">101</div>
                </div>
                <div className="contact-item">
                  <div className="contact-type">Yavij Support</div>
                  <div className="contact-number">1800-XXX-XXXX</div>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="safety-tips">
              <div className="section-header">
                <FaShieldAlt className="section-icon" />
                <h4>Safety Tips</h4>
              </div>
              <ul className="tips-list">
                <li>
                  <FaCheckCircle className="tip-icon" />
                  Stay on the line until help arrives
                </li>
                <li>
                  <FaCheckCircle className="tip-icon" />
                  Share your exact location if possible
                </li>
                <li>
                  <FaCheckCircle className="tip-icon" />
                  Keep your phone accessible and charged
                </li>
                <li>
                  <FaCheckCircle className="tip-icon" />
                  Follow instructions from emergency services
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Monitoring</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">&lt;2min</div>
                <div className="stat-label">Response Time</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">99%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Emergency;