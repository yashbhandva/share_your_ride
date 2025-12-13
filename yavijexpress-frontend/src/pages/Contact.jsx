import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosClient";
import {
  FaPaperPlane,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaEnvelopeOpen,
  FaHeadset,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post("/api/contact", form);

      setSuccess("✅ Message sent successfully! We'll get back to you within 24 hours.");
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setSuccess("");
        setSubmitted(false);
      }, 5000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: ["support@yavijexpress.com", "info@yavijexpress.com"],
      color: "#3A36E0"
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      details: ["+91 98765 43210", "+91 98765 43211"],
      color: "#10B981"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      details: ["123 Express Street", "Tech Park, Bengaluru", "Karnataka 560001"],
      color: "#8B5CF6"
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: ["Mon-Fri: 9:00 AM - 8:00 PM", "Sat-Sun: 10:00 AM - 6:00 PM"],
      color: "#F59E0B"
    }
  ];

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <motion.div
        className="contact-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="contact-hero-content">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have questions, feedback, or need assistance? Our team is here to help you 24/7.
          </p>
          <div className="contact-stats">
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2h</span>
              <span className="stat-label">Avg Response Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="contact-container">
        {/* Contact Info Cards */}
        <motion.div
          className="contact-info-grid"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {contactInfo.map((info, index) => (
            <div
              key={info.title}
              className="contact-info-card"
              style={{ borderTop: `4px solid ${info.color}` }}
            >
              <div className="contact-info-icon" style={{ color: info.color }}>
                {info.icon}
              </div>
              <h3 className="contact-info-title">{info.title}</h3>
              <div className="contact-info-details">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="contact-info-text">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <motion.div
            className="contact-form-wrapper"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="form-header" variants={itemVariants}>
              <div className="form-icon">
                <FaEnvelopeOpen />
              </div>
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className="alert alert-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FaExclamationCircle />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="alert alert-success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FaCheckCircle />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="contact-form">
              <motion.div className="form-row" variants={itemVariants}>
                <div className="form-group">
                  <label>
                    <FaUser className="input-icon" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaEnvelope className="input-icon" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label>
                  <FaHeadset className="input-icon" />
                  <span>Subject *</span>
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing Issue">Billing Issue</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label>
                  <FaPaperPlane className="input-icon" />
                  <span>Message *</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us how we can help you..."
                  className="form-textarea"
                />
                <div className="character-count">
                  {form.message.length}/500 characters
                </div>
              </motion.div>

              <motion.div className="form-footer" variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`submit-btn ${loading ? "loading" : ""}`}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
                <p className="form-note">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </motion.div>
            </form>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="faq-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>Frequently Asked Questions</h3>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>What's your response time?</h4>
                <p>We typically respond within 2 hours during business hours and within 12 hours outside business hours.</p>
              </div>
              <div className="faq-item">
                <h4>Do you offer 24/7 support?</h4>
                <p>Yes! Our emergency support line is available 24/7 for critical issues affecting your rides.</p>
              </div>
              <div className="faq-item">
                <h4>Can I schedule a callback?</h4>
                <p>Absolutely! Include your phone number in the message and we'll call you at your preferred time.</p>
              </div>
              <div className="faq-item">
                <h4>Where are you located?</h4>
                <p>Our headquarters are in Bengaluru, but we serve customers across India with local support teams.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Emergency Contact */}
        <motion.div
          className="emergency-contact"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="emergency-content">
            <div className="emergency-icon">🚨</div>
            <div className="emergency-text">
              <h3>Emergency Support</h3>
              <p>Need immediate assistance? Call our 24/7 emergency line</p>
              <a href="tel:+91 95125 70683" className="emergency-phone">
                📞 1800-123-456
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;