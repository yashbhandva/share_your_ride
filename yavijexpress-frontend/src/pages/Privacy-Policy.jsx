import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldAlt,
  FaDatabase,
  FaUserLock,
  FaFileContract,
  FaBell,
  FaKey,
  FaHistory,
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaCheckCircle,
  FaLock,
  FaSync,
  FaEnvelope,
  FaQuestionCircle
} from "react-icons/fa";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [showConsent, setShowConsent] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const sections = [
    { id: "introduction", title: "Introduction", icon: <FaShieldAlt /> },
    { id: "information", title: "Information We Collect", icon: <FaDatabase /> },
    { id: "usage", title: "How We Use Data", icon: <FaUserLock /> },
    { id: "sharing", title: "Data Sharing Policy", icon: <FaFileContract /> },
    { id: "security", title: "Data Security", icon: <FaLock /> },
    { id: "rights", title: "User Privacy Rights", icon: <FaKey /> },
    { id: "retention", title: "Data Retention", icon: <FaHistory /> },
    { id: "safety", title: "Safety & Emergency", icon: <FaExclamationTriangle /> },
    { id: "updates", title: "Policy Updates", icon: <FaSync /> },
    { id: "conclusion", title: "Conclusion", icon: <FaCheckCircle /> }
  ];

  const policyContent = {
    introduction: {
      title: "Introduction",
      content: `YaVij Express respects the privacy of all users and is committed to protecting personal information shared on the platform. This privacy policy explains how user data is collected, used, stored, and protected while using the application.`,
      points: [
        "Transparent data practices",
        "User-first privacy approach",
        "Legal compliance"
      ]
    },
    information: {
      title: "Information We Collect",
      content: `We collect only the data required to operate the platform safely and efficiently, ensuring minimal intrusion while maximum safety.`,
      points: [
        "Personal details (name, email, phone, role)",
        "Identity verification documents",
        "Vehicle information for drivers",
        "Ride-related data and history",
        "Technical data for security"
      ]
    },
    usage: {
      title: "How We Use User Data",
      content: `User information is used exclusively for platform operation and enhancement, never for unauthorized purposes.`,
      points: [
        "Account creation and authentication",
        "Driver and passenger verification",
        "Ride booking and trip matching",
        "Payment processing",
        "System performance improvement",
        "Safety notifications and alerts"
      ]
    },
    sharing: {
      title: "Data Sharing Policy",
      content: `We maintain strict controls over data sharing, ensuring your information remains protected at all times.`,
      points: [
        "Never sold or shared for marketing",
        "Shared only between driver/passenger during active trips",
        "Secure payment gateway processing",
        "Legal compliance when required",
        "No third-party data mining"
      ]
    },
    security: {
      title: "Data Security Measures",
      content: `Advanced security protocols protect your data from unauthorized access and breaches.`,
      points: [
        "Military-grade encryption for passwords",
        "JWT-based API authentication",
        "Encrypted document storage",
        "Role-based access control",
        "24/7 system monitoring",
        "Regular security audits"
      ]
    },
    rights: {
      title: "User Privacy Rights",
      content: `You have complete control over your personal data and privacy settings.`,
      points: [
        "View and update personal information",
        "Request account deletion",
        "Control notification preferences",
        "Download your data",
        "Report privacy concerns",
        "Opt-out of non-essential communications"
      ]
    },
    retention: {
      title: "Data Retention Policy",
      content: `We retain data only as long as necessary for service delivery and legal compliance.`,
      points: [
        "Personal data stored for active service period",
        "Financial records maintained per legal requirements",
        "Inactive accounts archived after 24 months",
        "Ride history available for 36 months",
        "Right to permanent deletion upon request"
      ]
    },
    safety: {
      title: "Safety & Emergency Data Use",
      content: `In emergency situations, limited data access ensures user safety without compromising privacy.`,
      points: [
        "Location sharing during SOS alerts",
        "Limited data access for emergency services",
        "Temporary access for safety response",
        "Emergency contact notification",
        "Automatic incident reporting"
      ]
    },
    updates: {
      title: "Policy Updates",
      content: `We continuously improve our privacy practices and keep users informed about changes.`,
      points: [
        "Email notifications for significant changes",
        "In-app announcements",
        "30-day advance notice for major updates",
        "Version history available",
        "User consent for material changes"
      ]
    },
    conclusion: {
      title: "Conclusion",
      content: `YaVij Express is built with privacy-by-design principles, ensuring transparency, security, and trust. User data is handled responsibly to provide a safe, reliable, and respectful ride-sharing experience.`,
      points: [
        "Privacy as core principle",
        "Continuous improvement",
        "User trust and transparency",
        "Safe ride-sharing ecosystem"
      ]
    }
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setShowConsent(false);
    // Here you can save acceptance to backend
    localStorage.setItem('privacyPolicyAccepted', 'true');
  };

  const handleDownloadPolicy = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("policy-content").innerText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "YaVij-Express-Privacy-Policy.txt";
    document.body.appendChild(element);
    element.click();
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="privacy-page">
      {/* Hero Header */}
      <motion.section
        className="privacy-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <div className="privacy-badge">
            <FaShieldAlt className="badge-icon" />
            <span>Privacy Protected</span>
          </div>
          <h1 className="privacy-title">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="privacy-subtitle">
            Your trust is our priority. This document explains how we collect, use, and protect your data.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <FaDatabase className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">Zero</div>
                <div className="stat-label">Data Sold</div>
              </div>
            </div>
            <div className="stat">
              <FaLock className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">256-bit</div>
                <div className="stat-label">Encryption</div>
              </div>
            </div>
            <div className="stat">
              <FaUserLock className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">Full</div>
                <div className="stat-label">Control</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="privacy-container">
        {/* Sidebar Navigation */}
        <motion.aside
          className="privacy-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sidebar-header">
            <h3>Policy Sections</h3>
            <button
              className="download-btn"
              onClick={handleDownloadPolicy}
            >
              <FaDownload /> Download
            </button>
          </div>

          <nav className="section-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-text">{section.title}</span>
                {activeSection === section.id && (
                  <span className="nav-indicator"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="sidebar-actions">
            <button className="action-btn" onClick={() => setShowConsent(true)}>
              <FaCheckCircle /> Accept Policy
            </button>
            <a href="/contact" className="action-btn outline">
              <FaQuestionCircle /> Questions?
            </a>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          className="privacy-content"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <div className="content-header">
            <div className="section-meta">
              <div className="section-icon">
                {sections.find(s => s.id === activeSection)?.icon}
              </div>
              <div>
                <h2>{policyContent[activeSection].title}</h2>
                <div className="section-indicator">
                  Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
                </div>
              </div>
            </div>
            <div className="last-updated">
              <FaSync /> Last updated: Dec 2024
            </div>
          </div>

          <motion.div
            className="content-card"
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="content-body" id="policy-content">
              <p className="content-paragraph">{policyContent[activeSection].content}</p>

              <div className="points-grid">
                {policyContent[activeSection].points.map((point, index) => (
                  <motion.div
                    key={index}
                    className="point-card"
                    variants={fadeIn}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="point-icon">
                      {activeSection === 'rights' ? <FaEye /> :
                       activeSection === 'security' ? <FaLock /> :
                       activeSection === 'sharing' ? <FaFileContract /> :
                       <FaCheckCircle />}
                    </div>
                    <div className="point-content">
                      <h4>{point}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="content-navigation">
              {sections.findIndex(s => s.id === activeSection) > 0 && (
                <button
                  className="nav-btn prev"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    setActiveSection(sections[currentIndex - 1].id);
                  }}
                >
                  ← Previous
                </button>
              )}

              <div className="page-indicator">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="page-count">
                  {sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}
                </span>
              </div>

              {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
                <button
                  className="nav-btn next"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    setActiveSection(sections[currentIndex + 1].id);
                  }}
                >
                  Next →
                </button>
              )}
            </div>
          </motion.div>

          {/* User Rights Quick Access */}
          <div className="rights-quick-access">
            <h3>Quick Privacy Actions</h3>
            <div className="rights-grid">
              <a href="/profile" className="right-card">
                <FaEye className="right-icon" />
                <h4>View Your Data</h4>
                <p>Access all personal information we store</p>
              </a>
              <a href="/settings" className="right-card">
                <FaEdit className="right-icon" />
                <h4>Update Information</h4>
                <p>Edit your profile and preferences</p>
              </a>
              <button className="right-card" onClick={() => setShowConsent(true)}>
                <FaCheckCircle className="right-icon" />
                <h4>Manage Consent</h4>
                <p>Review and update privacy settings</p>
              </button>
              <a href="/contact" className="right-card">
                <FaEnvelope className="right-icon" />
                <h4>Contact DPO</h4>
                <p>Reach out to our Data Protection Officer</p>
              </a>
            </div>
          </div>
        </motion.main>
      </div>

      {/* Consent Modal */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            className="consent-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConsent(false)}
          >
            <motion.div
              className="consent-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <FaShieldAlt className="modal-icon" />
                <h2>Privacy Policy Acceptance</h2>
              </div>

              <div className="modal-body">
                <p>
                  By accepting this privacy policy, you acknowledge that you have read,
                  understood, and agree to our data practices as described.
                </p>

                <div className="consent-points">
                  <div className="consent-point">
                    <FaCheckCircle className="point-icon" />
                    <span>I understand how my data is collected and used</span>
                  </div>
                  <div className="consent-point">
                    <FaCheckCircle className="point-icon" />
                    <span>I accept the terms of data sharing and security</span>
                  </div>
                  <div className="consent-point">
                    <FaCheckCircle className="point-icon" />
                    <span>I acknowledge my privacy rights</span>
                  </div>
                </div>

                <div className="acceptance-status">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <span>I accept the Privacy Policy</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn secondary"
                  onClick={() => setShowConsent(false)}
                >
                  Review Later
                </button>
                <button
                  className="modal-btn primary"
                  onClick={handleAcceptTerms}
                  disabled={!acceptedTerms}
                >
                  <FaCheckCircle /> Accept & Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acceptance Toast */}
      {acceptedTerms && (
        <motion.div
          className="acceptance-toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <FaCheckCircle className="toast-icon" />
          <div className="toast-content">
            <strong>Privacy Policy Accepted</strong>
            <p>Your privacy preferences have been saved</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PrivacyPolicy;