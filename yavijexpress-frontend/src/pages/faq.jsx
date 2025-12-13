import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuestionCircle,
  FaUserCheck,
  FaCar,
  FaSearch,
  FaCreditCard,
  FaTimesCircle,
  FaIdCard,
  FaShieldAlt,
  FaExclamationTriangle,
  FaUserSlash,
  FaStar,
  FaHeadset,
  FaBan,
  FaWallet,
  FaTrash,
  FaExpandArrowsAlt,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaShare,
  FaBookOpen,
  FaCommentAlt
} from "react-icons/fa";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedItems, setExpandedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "general", title: "General", icon: <FaQuestionCircle />, count: 5 },
    { id: "booking", title: "Booking & Rides", icon: <FaCar />, count: 4 },
    { id: "safety", title: "Safety & Security", icon: <FaShieldAlt />, count: 4 },
    { id: "account", title: "Account & Support", icon: <FaUserCheck />, count: 5 },
  ];

  const faqItems = {
    general: [
      {
        id: "what-is",
        question: "What is YaVij Express?",
        answer: "YaVij Express is a community-based ride-sharing platform where drivers can share their planned trips and passengers can book available seats for safe and affordable travel.",
        tags: ["Platform", "Introduction"]
      },
      {
        id: "who-can-use",
        question: "Who can use YaVij Express?",
        answer: "Any user above 18 years of age can register. Drivers must have a valid driving license, vehicle registration, and insurance. Both drivers and passengers need to complete identity verification.",
        tags: ["Eligibility", "Registration"]
      },
      {
        id: "taxi-service",
        question: "Is YaVij Express a taxi service?",
        answer: "No. YaVij Express is a technology platform that connects drivers and passengers. It does not own vehicles or provide transportation services directly. We're a community ride-sharing platform.",
        tags: ["Platform Type"]
      },
      {
        id: "free-to-use",
        question: "Is YaVij Express free to use?",
        answer: "Account creation is completely free. Charges apply only when booking a ride or using paid services. There are no subscription fees or hidden charges.",
        tags: ["Pricing", "Cost"]
      },
      {
        id: "future-expansion",
        question: "Will YaVij Express expand in the future?",
        answer: "Yes. The platform is designed to scale with additional features, cities, and services. We're constantly working on expanding to new locations and adding innovative features.",
        tags: ["Future", "Expansion"]
      }
    ],
    booking: [
      {
        id: "book-ride",
        question: "How do I book a ride?",
        answer: "You can search for rides by selecting source, destination, date, and time. Once a suitable ride is found, you can book a seat by completing the payment. The process takes less than 2 minutes.",
        tags: ["Booking", "Process"]
      },
      {
        id: "payment-work",
        question: "How does payment work?",
        answer: "Payments are made securely through integrated payment gateways like Razorpay or Stripe. Booking is confirmed only after successful payment. All transactions are encrypted and secure.",
        tags: ["Payment", "Security"]
      },
      {
        id: "cancel-ride",
        question: "Can I cancel a ride?",
        answer: "Yes. You can cancel a booking based on the platform's cancellation policy. Refunds depend on the cancellation timing. Full refunds are available for cancellations made more than 2 hours before the trip.",
        tags: ["Cancellation", "Refund"]
      },
      {
        id: "rate-users",
        question: "Can I rate other users?",
        answer: "Yes. After a ride is completed, both driver and passenger can rate and review each other to maintain trust and transparency. Ratings help build a reliable community.",
        tags: ["Ratings", "Reviews"]
      }
    ],
    safety: [
      {
        id: "driver-verification",
        question: "How are drivers verified?",
        answer: "Drivers must submit identity documents, driving license, vehicle registration, and insurance. These documents are reviewed and approved by the admin. Only verified drivers can offer rides.",
        tags: ["Verification", "Safety"]
      },
      {
        id: "data-safe",
        question: "Is my personal data safe?",
        answer: "Yes. YaVij Express uses secure authentication, encryption, and follows strict privacy policies to protect user data. We never share your data with third parties without consent.",
        tags: ["Privacy", "Security"]
      },
      {
        id: "dangerous-driving",
        question: "What if a driver drives under influence or behaves dangerously?",
        answer: "Such behavior is strictly prohibited. Users can report the incident immediately using the SOS feature. The driver's account will be suspended or permanently banned after investigation.",
        tags: ["Safety", "Reporting"]
      },
      {
        id: "emergency-support",
        question: "Does the app provide emergency support?",
        answer: "Yes. The app includes an emergency (SOS) feature and real-time ride tracking to enhance user safety during trips. Emergency contacts are notified automatically in critical situations.",
        tags: ["Emergency", "SOS"]
      }
    ],
    account: [
      {
        id: "dispute-resolution",
        question: "What happens if there is a dispute during a ride?",
        answer: "Users can report issues through the app. Admin will review trip data and take necessary action, including refunds or account suspension if required. Most disputes are resolved within 24 hours.",
        tags: ["Dispute", "Support"]
      },
      {
        id: "passenger-misbehavior",
        question: "What if a passenger misbehaves or damages the vehicle?",
        answer: "Drivers can report passengers through the app. Verified complaints may lead to warnings, penalties, or account termination. Security deposits may be used for damages.",
        tags: ["Misbehavior", "Reporting"]
      },
      {
        id: "technical-issues",
        question: "What should I do if I face technical issues?",
        answer: "You can contact customer support through the app or raise a ticket from your dashboard. Our support team responds within 2 hours and resolves most issues within 24 hours.",
        tags: ["Support", "Technical"]
      },
      {
        id: "admin-block",
        question: "Can admin block users?",
        answer: "Yes. Admin has the authority to suspend or permanently block accounts that violate platform policies. All actions are logged and can be appealed through our support system.",
        tags: ["Account", "Suspension"]
      },
      {
        id: "delete-account",
        question: "How do I delete my account?",
        answer: "You can request account deletion from the profile settings or contact support. Account deletion is processed within 7 days, and all personal data is permanently removed.",
        tags: ["Account", "Deletion"]
      }
    ]
  };

  const toggleItem = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredItems = searchQuery
    ? Object.values(faqItems).flat().filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : faqItems[activeCategory];

  const handleDownloadFAQ = () => {
    const element = document.createElement("a");
    const content = filteredItems.map(item =>
      `Q: ${item.question}\nA: ${item.answer}\n\n`
    ).join('');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "YaVij-Express-FAQ.txt";
    document.body.appendChild(element);
    element.click();
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const slideIn = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <motion.section
        className="faq-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <div className="faq-badge">
            <FaQuestionCircle className="badge-icon" />
            <span>Help Center</span>
          </div>
          <h1 className="faq-title">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="faq-subtitle">
            Find quick answers to common questions about YaVij Express.
            Can't find what you're looking for? Contact our support team.
          </p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search questions, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimesCircle />
                </button>
              )}
            </div>
            <div className="search-actions">
              <button className="action-btn" onClick={handleDownloadFAQ}>
                <FaDownload /> Download FAQ
              </button>
              <a href="/contact" className="action-btn outline">
                <FaCommentAlt /> Ask a Question
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="faq-container">
        {/* Sidebar Categories */}
        <motion.aside
          className="faq-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sidebar-header">
            <h3>FAQ Categories</h3>
            <div className="total-questions">
              {Object.values(faqItems).flat().length} Questions
            </div>
          </div>

          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchQuery("");
                }}
              >
                <div className="category-icon">
                  {category.icon}
                </div>
                <div className="category-content">
                  <h4>{category.title}</h4>
                  <div className="category-count">
                    {category.count} questions
                  </div>
                </div>
                {activeCategory === category.id && (
                  <div className="active-indicator"></div>
                )}
              </button>
            ))}
          </div>

          {/* Popular Questions */}
          <div className="popular-questions">
            <h4>Popular Questions</h4>
            <div className="popular-list">
              <button
                className="popular-item"
                onClick={() => {
                  setActiveCategory("general");
                  toggleItem("what-is");
                }}
              >
                <FaQuestionCircle className="popular-icon" />
                <span>What is YaVij Express?</span>
              </button>
              <button
                className="popular-item"
                onClick={() => {
                  setActiveCategory("booking");
                  toggleItem("book-ride");
                }}
              >
                <FaCar className="popular-icon" />
                <span>How to book a ride?</span>
              </button>
              <button
                className="popular-item"
                onClick={() => {
                  setActiveCategory("safety");
                  toggleItem("driver-verification");
                }}
              >
                <FaShieldAlt className="popular-icon" />
                <span>Driver verification process</span>
              </button>
              <button
                className="popular-item"
                onClick={() => {
                  setActiveCategory("account");
                  toggleItem("cancel-ride");
                }}
              >
                <FaCreditCard className="popular-icon" />
                <span>Cancellation & refund policy</span>
              </button>
            </div>
          </div>

          {/* Quick Support */}
          <div className="quick-support">
            <h4>Need More Help?</h4>
            <a href="/contact" className="support-link">
              <FaHeadset className="support-icon" />
              <div className="support-content">
                <strong>Contact Support</strong>
                <span>24/7 customer service</span>
              </div>
            </a>
            <a href="/privacy" className="support-link">
              <FaBookOpen className="support-icon" />
              <div className="support-content">
                <strong>Privacy Policy</strong>
                <span>How we protect your data</span>
              </div>
            </a>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          className="faq-content"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          {/* Current Category Info */}
          <div className="category-header">
            <div className="category-info">
              <div className="current-category-icon">
                {categories.find(c => c.id === activeCategory)?.icon}
              </div>
              <div>
                <h2>{categories.find(c => c.id === activeCategory)?.title} Questions</h2>
                <p className="category-description">
                  {activeCategory === "general" && "General information about our platform"}
                  {activeCategory === "booking" && "Booking, payments, and ride management"}
                  {activeCategory === "safety" && "Safety features and security measures"}
                  {activeCategory === "account" && "Account management and support"}
                </p>
              </div>
            </div>
            <div className="results-info">
              {searchQuery ? (
                <span className="search-results">
                  Found {filteredItems.length} results for "{searchQuery}"
                </span>
              ) : (
                <span className="item-count">
                  {filteredItems.length} questions
                </span>
              )}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="faq-items">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="faq-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={expandedItems.includes(item.id)}
                  >
                    <div className="question-content">
                      <span className="question-number">Q{index + 1}</span>
                      <h3>{item.question}</h3>
                    </div>
                    <div className="question-action">
                      <div className="question-tags">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <FaChevronUp className="chevron-icon" />
                      ) : (
                        <FaChevronDown className="chevron-icon" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedItems.includes(item.id) && (
                      <motion.div
                        className="faq-answer"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={slideIn}
                      >
                        <div className="answer-content">
                          <div className="answer-icon">
                            <FaQuestionCircle />
                          </div>
                          <div className="answer-text">
                            <p>{item.answer}</p>
                            <div className="answer-actions">
                              <button className="helpful-btn">
                                <FaQuestionCircle /> Was this helpful?
                              </button>
                              <button className="share-btn">
                                <FaShare /> Share
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaSearch className="empty-icon" />
                <h3>No results found</h3>
                <p>We couldn't find any questions matching "{searchQuery}"</p>
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </div>

          {/* Still Have Questions */}
          <div className="additional-help">
            <div className="help-card">
              <div className="help-icon">
                <FaHeadset />
              </div>
              <div className="help-content">
                <h3>Still have questions?</h3>
                <p>Our support team is here to help you 24/7</p>
                <div className="help-actions">
                  <a href="/contact" className="help-btn primary">
                    Contact Support
                  </a>
                  <a href="/documentation" className="help-btn">
                    View Documentation
                  </a>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="faq-stats">
              <div className="stat-card">
                <FaQuestionCircle className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">{Object.values(faqItems).flat().length}</div>
                  <div className="stat-label">Total Questions</div>
                </div>
              </div>
              <div className="stat-card">
                <FaHeadset className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">24/7</div>
                  <div className="stat-label">Support Available</div>
                </div>
              </div>
              <div className="stat-card">
                <FaShieldAlt className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Secure Platform</div>
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </div>

      {/* Quick Contact Bar */}
      <motion.div
        className="quick-contact-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="contact-content">
          <div className="contact-text">
            <h4>Can't find what you're looking for?</h4>
            <p>Our team is ready to assist you with any questions</p>
          </div>
          <div className="contact-actions">
            <a href="/contact" className="contact-btn primary">
              <FaHeadset /> Live Chat
            </a>
            <a href="mailto:support@yavijexpress.com" className="contact-btn">
              <FaCommentAlt /> Email Support
            </a>
            <a href="tel:+911234567890" className="contact-btn">
              <FaHeadset /> Call Us
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;