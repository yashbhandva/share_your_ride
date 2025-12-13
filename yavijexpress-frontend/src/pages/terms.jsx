import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileContract,
  FaUserCheck,
  FaShieldAlt,
  FaCar,
  FaUser,
  FaCreditCard,
  FaExclamationTriangle,
  FaStar,
  FaBan,
  FaDatabase,
  FaSync,
  FaBalanceScale,
  FaCheckCircle,
  FaDownload,
  FaQuestionCircle,
  FaGavel,
  FaHandshake,
  FaBook,
  FaTimesCircle
} from "react-icons/fa";

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showAcceptance, setShowAcceptance] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState({
    general: false,
    safety: false,
    data: false,
    conduct: false
  });

  const sections = [
    { id: "acceptance", title: "Acceptance of Terms", icon: <FaFileContract /> },
    { id: "platform", title: "Platform Role", icon: <FaCar /> },
    { id: "eligibility", title: "User Eligibility", icon: <FaUserCheck /> },
    { id: "account", title: "Account Responsibility", icon: <FaUser /> },
    { id: "driver", title: "Driver Responsibilities", icon: <FaCar /> },
    { id: "passenger", title: "Passenger Responsibilities", icon: <FaUser /> },
    { id: "booking", title: "Booking & Payment", icon: <FaCreditCard /> },
    { id: "safety", title: "Safety & Liability", icon: <FaShieldAlt /> },
    { id: "prohibited", title: "Prohibited Activities", icon: <FaBan /> },
    { id: "ratings", title: "Ratings & Reviews", icon: <FaStar /> },
    { id: "suspension", title: "Account Suspension", icon: <FaTimesCircle /> },
    { id: "data", title: "Data Usage", icon: <FaDatabase /> },
    { id: "updates", title: "Policy Updates", icon: <FaSync /> },
    { id: "governing", title: "Governing Law", icon: <FaBalanceScale /> },
    { id: "conclusion", title: "Conclusion", icon: <FaHandshake /> }
  ];

  const termsContent = {
    acceptance: {
      title: "Acceptance of Terms",
      content: `By registering, accessing, or using YaVij-Express, users agree to comply with these Terms of Service. If a user does not agree with these terms, they must not use the platform.`,
      points: [
        "Agreement to all terms by platform usage",
        "Mandatory compliance for all users",
        "Right to refuse service for non-compliance"
      ],
      warning: "Important: Continued use implies acceptance"
    },
    platform: {
      title: "Platform Role",
      content: `YaVij-Express acts only as a technology platform that connects drivers and passengers. The platform does not own vehicles and does not provide transportation services directly.`,
      points: [
        "Technology intermediary only",
        "No direct transportation services",
        "Connecting platform for verified users"
      ]
    },
    eligibility: {
      title: "User Eligibility",
      content: `All users must meet specific criteria to ensure safety and compliance on our platform.`,
      points: [
        "Minimum age: 18 years",
        "Valid driving license for drivers",
        "Accurate registration information",
        "Vehicle registration for drivers"
      ]
    },
    account: {
      title: "Account Responsibility",
      content: `Users are solely responsible for maintaining the security and integrity of their accounts.`,
      points: [
        "Confidentiality of login credentials",
        "Full responsibility for account activities",
        "No sharing or impersonation allowed",
        "Immediate reporting of unauthorized access"
      ],
      warning: "All account actions are traceable to the registered user"
    },
    driver: {
      title: "Driver Responsibilities",
      content: `Drivers must adhere to strict safety and professional standards while using our platform.`,
      points: [
        "Compliance with all traffic laws",
        "Zero tolerance for alcohol/drugs while driving",
        "Maintain roadworthy insured vehicles",
        "Professional conduct with all passengers"
      ],
      consequences: [
        "Immediate suspension for violations",
        "Permanent termination for serious offenses",
        "Legal action for severe misconduct"
      ]
    },
    passenger: {
      title: "Passenger Responsibilities",
      content: `Passengers must maintain respectful and lawful behavior throughout their journey.`,
      points: [
        "Adherence to safety protocols",
        "No damage to vehicle property",
        "Respectful conduct towards drivers",
        "Compliance with local laws"
      ],
      consequences: [
        "Temporary suspension for minor violations",
        "Permanent ban for harassment or damage",
        "Legal liability for criminal activities"
      ]
    },
    booking: {
      title: "Booking, Payment & Cancellation",
      content: `Clear policies govern all financial transactions and booking modifications on our platform.`,
      points: [
        "Booking confirmation after payment",
        "Timely cancellation for full refunds",
        "Platform rules govern all disputes",
        "No liability for external delays"
      ],
      note: "Refund policies are clearly displayed during booking"
    },
    safety: {
      title: "Safety & Liability",
      content: `Safety is our priority, but users must understand their personal responsibilities.`,
      points: [
        "No liability for user negligence",
        "Driver responsibility for vehicle safety",
        "Personal risk acknowledgment",
        "Emergency protocols in place"
      ],
      warning: "Always verify driver/vehicle details before boarding"
    },
    prohibited: {
      title: "Prohibited Activities",
      content: `Certain activities are strictly forbidden to maintain platform integrity and user safety.`,
      points: [
        "No fake identities or documents",
        "Zero tolerance for violence or harassment",
        "Strict prohibition of fraud",
        "No platform hacking or misuse"
      ],
      consequences: [
        "Immediate account termination",
        "Legal prosecution",
        "Permanent blacklisting"
      ]
    },
    ratings: {
      title: "Ratings & Reviews",
      content: `Our rating system depends on honest feedback to maintain service quality.`,
      points: [
        "Post-ride rating system",
        "Genuine feedback only",
        "Admin review of abusive content",
        "Fair dispute resolution process"
      ],
      note: "Ratings influence driver/passenger matching"
    },
    suspension: {
      title: "Account Suspension or Termination",
      content: `We reserve the right to restrict access to maintain platform safety and quality.`,
      points: [
        "Suspension for policy violations",
        "Termination for severe misconduct",
        "Immediate restriction for safety threats",
        "No prior notice in emergency cases"
      ],
      warning: "All actions are logged and reviewable"
    },
    data: {
      title: "Data Usage",
      content: `User data handling follows strict privacy guidelines for protection and transparency.`,
      points: [
        "As per Privacy Policy",
        "Service-essential processing only",
        "Consent for operational data use",
        "Transparent data practices"
      ],
      note: "Refer to Privacy Policy for detailed information"
    },
    updates: {
      title: "Policy Updates",
      content: `Our terms evolve with platform improvements and legal requirements.`,
      points: [
        "Periodic updates as needed",
        "Continued use implies acceptance",
        "Notification for significant changes",
        "Historical version tracking"
      ],
      note: "Check this page regularly for updates"
    },
    governing: {
      title: "Governing Law",
      content: `All platform operations and disputes fall under applicable legal frameworks.`,
      points: [
        "Subject to local jurisdiction",
        "Dispute resolution mechanisms",
        "Legal compliance requirements",
        "International standards adherence"
      ]
    },
    conclusion: {
      title: "Conclusion",
      content: `By using YaVij-Express, users agree to act responsibly, respect community rules, and help maintain a safe and trusted ride-sharing environment.`,
      points: [
        "Community responsibility",
        "Safe ride-sharing commitment",
        "Mutual respect principle",
        "Continuous improvement goal"
      ]
    }
  };

  const handleAcceptAll = () => {
    setAcceptedTerms({
      general: true,
      safety: true,
      data: true,
      conduct: true
    });
  };

  const handleDownloadTerms = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("terms-content").innerText], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = "YaVij-Express-Terms-of-Service.txt";
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
    <div className="terms-page">
      {/* Hero Header */}
      <motion.section
        className="terms-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <div className="terms-badge">
            <FaGavel className="badge-icon" />
            <span>Legal Terms</span>
          </div>
          <h1 className="terms-title">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="terms-subtitle">
            Your rights and responsibilities when using YaVij Express.
            Please read carefully before using our services.
          </p>

          <div className="acceptance-status">
            <div className="status-item">
              <FaCheckCircle className={`status-icon ${acceptedTerms.general ? 'accepted' : 'pending'}`} />
              <span>General Terms</span>
            </div>
            <div className="status-item">
              <FaShieldAlt className={`status-icon ${acceptedTerms.safety ? 'accepted' : 'pending'}`} />
              <span>Safety Rules</span>
            </div>
            <div className="status-item">
              <FaDatabase className={`status-icon ${acceptedTerms.data ? 'accepted' : 'pending'}`} />
              <span>Data Terms</span>
            </div>
            <div className="status-item">
              <FaHandshake className={`status-icon ${acceptedTerms.conduct ? 'accepted' : 'pending'}`} />
              <span>Code of Conduct</span>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="terms-container">
        {/* Sidebar Navigation */}
        <motion.aside
          className="terms-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sidebar-header">
            <h3>Terms Sections</h3>
            <button
              className="download-btn"
              onClick={handleDownloadTerms}
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
            <button
              className="action-btn primary"
              onClick={() => setShowAcceptance(true)}
            >
              <FaCheckCircle /> Accept Terms
            </button>
            <a href="/privacy" className="action-btn">
              <FaBook /> Privacy Policy
            </a>
            <a href="/contact" className="action-btn outline">
              <FaQuestionCircle /> Legal Questions
            </a>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          className="terms-content"
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
                <h2>{termsContent[activeSection].title}</h2>
                <div className="section-indicator">
                  Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
                </div>
              </div>
            </div>
            <div className="legal-note">
              <FaExclamationTriangle /> Legally Binding Document
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
            <div className="content-body" id="terms-content">
              <p className="content-paragraph">{termsContent[activeSection].content}</p>

              {/* Warning Box */}
              {termsContent[activeSection].warning && (
                <div className="warning-box">
                  <FaExclamationTriangle className="warning-icon" />
                  <div className="warning-content">
                    <strong>Important Notice</strong>
                    <p>{termsContent[activeSection].warning}</p>
                  </div>
                </div>
              )}

              {/* Note Box */}
              {termsContent[activeSection].note && (
                <div className="note-box">
                  <FaBook className="note-icon" />
                  <div className="note-content">
                    <strong>Note</strong>
                    <p>{termsContent[activeSection].note}</p>
                  </div>
                </div>
              )}

              {/* Points List */}
              <div className="points-section">
                <h3>Key Points:</h3>
                <div className="points-list">
                  {termsContent[activeSection].points.map((point, index) => (
                    <motion.div
                      key={index}
                      className="point-item"
                      variants={fadeIn}
                      whileHover={{ scale: 1.02 }}
                    >
                      <FaCheckCircle className="point-icon" />
                      <span>{point}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Consequences Section */}
              {termsContent[activeSection].consequences && (
                <div className="consequences-section">
                  <h3>Consequences of Violation:</h3>
                  <div className="consequences-list">
                    {termsContent[activeSection].consequences.map((item, index) => (
                      <div key={index} className="consequence-item">
                        <FaBan className="consequence-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  ← Previous Section
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
                  Next Section →
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Reference Cards */}
          <div className="quick-reference">
            <h3>Quick Reference</h3>
            <div className="reference-grid">
              <div className="reference-card">
                <div className="reference-header">
                  <FaUser className="reference-icon" />
                  <h4>For Drivers</h4>
                </div>
                <ul>
                  <li>Valid license required</li>
                  <li>Vehicle insurance mandatory</li>
                  <li>Zero tolerance for DUI</li>
                  <li>Professional conduct</li>
                </ul>
              </div>

              <div className="reference-card">
                <div className="reference-header">
                  <FaUser className="reference-icon" />
                  <h4>For Passengers</h4>
                </div>
                <ul>
                  <li>Respect driver property</li>
                  <li>No harassment policy</li>
                  <li>Timely cancellations</li>
                  <li>Honest ratings</li>
                </ul>
              </div>

              <div className="reference-card">
                <div className="reference-header">
                  <FaShieldAlt className="reference-icon" />
                  <h4>Safety Rules</h4>
                </div>
                <ul>
                  <li>Verify before boarding</li>
                  <li>Use SOS feature</li>
                  <li>Share ride details</li>
                  <li>Report incidents</li>
                </ul>
              </div>

              <div className="reference-card">
                <div className="reference-header">
                  <FaBan className="reference-icon" />
                  <h4>Strictly Prohibited</h4>
                </div>
                <ul>
                  <li>Fake identities</li>
                  <li>Violence/threats</li>
                  <li>Platform misuse</li>
                  <li>Account sharing</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.main>
      </div>

      {/* Acceptance Modal */}
      <AnimatePresence>
        {showAcceptance && (
          <motion.div
            className="acceptance-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAcceptance(false)}
          >
            <motion.div
              className="acceptance-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <FaGavel className="modal-icon" />
                <h2>Terms of Service Acceptance</h2>
              </div>

              <div className="modal-body">
                <p className="modal-intro">
                  Please review and accept each section of our Terms of Service to continue using YaVij Express.
                </p>

                <div className="acceptance-sections">
                  <div className="acceptance-section">
                    <div className="section-header">
                      <h4>General Terms</h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={acceptedTerms.general}
                          onChange={(e) => setAcceptedTerms({
                            ...acceptedTerms,
                            general: e.target.checked
                          })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Platform usage agreement and compliance requirements</p>
                  </div>

                  <div className="acceptance-section">
                    <div className="section-header">
                      <h4>Safety & Liability</h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={acceptedTerms.safety}
                          onChange={(e) => setAcceptedTerms({
                            ...acceptedTerms,
                            safety: e.target.checked
                          })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Understanding safety protocols and personal responsibility</p>
                  </div>

                  <div className="acceptance-section">
                    <div className="section-header">
                      <h4>Data Usage Terms</h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={acceptedTerms.data}
                          onChange={(e) => setAcceptedTerms({
                            ...acceptedTerms,
                            data: e.target.checked
                          })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Agreement to our Privacy Policy and data handling practices</p>
                  </div>

                  <div className="acceptance-section">
                    <div className="section-header">
                      <h4>Code of Conduct</h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={acceptedTerms.conduct}
                          onChange={(e) => setAcceptedTerms({
                            ...acceptedTerms,
                            conduct: e.target.checked
                          })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Commitment to respectful and lawful platform usage</p>
                  </div>
                </div>

                <div className="accept-all">
                  <button
                    className="accept-all-btn"
                    onClick={handleAcceptAll}
                  >
                    <FaCheckCircle /> Accept All Terms
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn secondary"
                  onClick={() => setShowAcceptance(false)}
                >
                  Review Later
                </button>
                <button
                  className="modal-btn primary"
                  onClick={() => {
                    if (acceptedTerms.general && acceptedTerms.safety &&
                        acceptedTerms.data && acceptedTerms.conduct) {
                      setShowAcceptance(false);
                      // Save acceptance to backend
                      localStorage.setItem('termsAccepted', 'true');
                    }
                  }}
                  disabled={!(acceptedTerms.general && acceptedTerms.safety &&
                    acceptedTerms.data && acceptedTerms.conduct)}
                >
                  <FaHandshake /> Confirm Acceptance
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acceptance Toast */}
      {acceptedTerms.general && acceptedTerms.safety &&
       acceptedTerms.data && acceptedTerms.conduct && (
        <motion.div
          className="acceptance-toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <FaCheckCircle className="toast-icon" />
          <div className="toast-content">
            <strong>Terms Accepted Successfully</strong>
            <p>You can now use all platform features</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TermsOfService;