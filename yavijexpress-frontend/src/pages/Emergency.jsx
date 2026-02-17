import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import LocationPicker from "../components/common/LocationPicker.jsx";
import "../assets/home.scss";
import "../assets/emergency.scss";


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
  FaSpinner,
  FaMap,
  FaCrosshairs,
  FaTimes,
  FaExpand,
  FaCompress
} from "react-icons/fa";

const Emergency = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    tripId: "",
    message: "",
    latitude: "",
    longitude: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(true);
  const [mapType, setMapType] = useState("roadmap");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const res = await api.get(`/api/emergency/contacts/${user.id}`);
      setContacts(res.data || []);
    } catch (e) {
      console.error("Failed to fetch emergency contacts", e);
      // Fallback to default contacts if API fails
      setContacts([
        { type: "Police", number: "100" },
        { type: "Ambulance", number: "102" },
        { type: "Fire", number: "101" },
        { type: "YaVij Helpline", number: "1800-XXX-XXXX" }
      ]);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (latlng) => {
    setForm((prev) => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6),
    }));
    setLocationError("");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationError("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setLocationError("");

        // Center map on current location
        if (window.mapInstance) {
          window.mapInstance.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          window.mapInstance.setZoom(15);
        }
      },
      (error) => {
        let errorMessage = "Failed to get your location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Please allow location access to use this feature";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleClearLocation = () => {
    setForm(prev => ({
      ...prev,
      latitude: '',
      longitude: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Validate trip ID
    if (!form.tripId.trim()) {
      setError("Please enter a valid Trip ID");
      return;
    }

    // Validate message
    if (!form.message.trim()) {
      setError("Please describe the emergency situation");
      return;
    }

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

      // Reset form after successful submission
      setForm({
        tripId: "",
        message: "",
        latitude: "",
        longitude: ""
      });

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setResult(null);
      }, 10000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send SOS alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const emergencyTypes = [
    { id: 1, title: "Medical Emergency", desc: "Need immediate medical assistance", icon: "🚑" },
    { id: 2, title: "Accident", desc: "Vehicle accident or collision", icon: "💥" },
    { id: 3, title: "Safety Concern", desc: "Feel unsafe or threatened", icon: "🛡️" },
    { id: 4, title: "Vehicle Breakdown", desc: "Stranded due to vehicle issue", icon: "🚗" },
    { id: 5, title: "Road Hazard", desc: "Dangerous road conditions", icon: "⚠️" },
    { id: 6, title: "Other Emergency", desc: "Other critical situation", icon: "🚨" },
  ];

  const handleEmergencyTypeClick = (title) => {
    setForm(prev => ({ ...prev, message: title }));
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    // You can pass this to LocationPicker if it supports map type
  };

  return (
    <div className="emergency-page">
           <section className="portfolio-hero">
                        <div className="container">
                          <div className="hero-content">
                            <h1 className="hero-title">🚨 Emergency</h1>
                            <p className="hero-description">
                              Access emergency contacts and support instantly.</p>
                          </div>
                        </div>
                      </section>
      <div className="emergency-container-with-map">

        {/* ===== BIG MAP BOX SECTION ===== */}
        <div className="big-map-section">
          <div className={`map-container ${isMapExpanded ? 'expanded' : ''}`}>
            <div className="map-header">
              <div>
                <div className="map-title">
                  <FaMapMarkerAlt className="map-title-icon" />
                  <span>Emergency Location Map</span>
                </div>
                <div className="map-subtitle">
                  Click on the map to set your emergency location. This helps responders find you faster.
                </div>
              </div>
              <div className="map-controls">
                <button
                  className={`map-control-btn ${mapType === 'roadmap' ? 'active' : ''}`}
                  onClick={() => handleMapTypeChange('roadmap')}
                >
                  <FaMap />
                  Map
                </button>
                <button
                  className={`map-control-btn ${mapType === 'satellite' ? 'active' : ''}`}
                  onClick={() => handleMapTypeChange('satellite')}
                >
                  <FaGlobe />
                  Satellite
                </button>
                <button
                  className="map-control-btn"
                  onClick={() => setIsMapExpanded(!isMapExpanded)}
                >
                  {isMapExpanded ? <FaCompress /> : <FaExpand />}
                  {isMapExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </div>

            <div className="map-body">
              {showLocationPicker ? (
                <>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    height="100%"
                    width="100%"
                    showControls={true}
                    mapType={mapType}
                  />

                  {locationError && (
                    <div className="map-status">
                      <div className="map-alert map-error">
                        <FaExclamationTriangle />
                        {locationError}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="map-placeholder">
                  <div className="placeholder-icon">🗺️</div>
                  <div className="placeholder-title">Emergency Location Map</div>
                  <div className="placeholder-subtitle">
                    Enable location services to see your current position on the map.
                    Click anywhere on the map to set your emergency location.
                  </div>
                  <button
                    className="use-current-location"
                    onClick={() => setShowLocationPicker(true)}
                  >
                    <FaMapMarkerAlt />
                    Show Map
                  </button>
                </div>
              )}
            </div>

            <div className="map-actions">
              <div className="current-location">
                <div className="location-label">Selected Coordinates:</div>
                <div className="coordinates-display">
                  <span className="coordinate lat">
                    {form.latitude ? `Lat: ${form.latitude}` : 'Not set'}
                  </span>
                  <span className="coordinate lng">
                    {form.longitude ? `Lng: ${form.longitude}` : 'Not set'}
                  </span>
                </div>
              </div>
              <div className="map-action-buttons">
                <button
                  className="use-current-location"
                  onClick={handleUseCurrentLocation}
                >
                  <FaCrosshairs />
                  Use Current Location
                </button>
                <button
                  className="clear-location"
                  onClick={handleClearLocation}
                  disabled={!form.latitude && !form.longitude}
                >
                  <FaTimes />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== LEFT SECTION - FORM ===== */}
        <motion.div
          className="emergency-form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                    <FaExclamationTriangle />
                    <div>
                      <strong>Error!</strong>
                      <p>{error}</p>
                    </div>
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
                      <p className="success-note">Emergency services have been notified. Stay on the line.</p>
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
                  <span>Trip ID *</span>
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
                  <span>Emergency Description *</span>
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
                      <span className="type-icon">{type.icon}</span>
                      <span className="type-title">{type.title}</span>
                      <span className="type-desc">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Connection Info */}
              <div className="map-connection-info">
                <p>
                  <FaMapMarkerAlt />
                  Your location is set from the map above. Click on the map to change it.
                </p>
              </div>

              {/* Important Note */}
              <div className="warning-note">
                <div className="warning-header">
                  <FaExclamationTriangle />
                  <span>Important Notice</span>
                </div>
                <p>
                  This will trigger a real emergency response. Use only in genuine emergencies.
                  False alerts may lead to legal action and penalties.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${loading ? "loading" : ""}`}
                disabled={loading || !form.tripId.trim() || !form.message.trim()}
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

        {/* ===== RIGHT SECTION - INFO ===== */}
        <motion.div
          className="emergency-info-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              {contactsLoading ? (
                <div className="contacts-loading">Loading contacts...</div>
              ) : (
                <div className="contact-list">
                  {contacts.map((contact, index) => (
                    <div key={index} className="contact-item">
                      <div className="contact-type">{contact.type}</div>
                      <div className="contact-number">{contact.number}</div>
                    </div>
                  ))}
                </div>
              )}
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