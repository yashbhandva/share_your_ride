import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="not-found-page">
      {/* Animated Background */}
      <div className="background-elements">
        <motion.div
          className="bg-circle"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="not-found-container">
        {/* Error Code */}
        <div className="error-code-section">
          <motion.div
            className="error-code"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <span className="code-digit">4</span>
            <motion.span
              className="code-digit zero"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              0
            </motion.span>
            <span className="code-digit">4</span>
          </motion.div>
        </div>

        {/* Error Message */}
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <h1>Page Not Found</h1>
          <p className="error-text">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className="btn btn-primary">
            <FaHome />
            <span>Go to Homepage</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            <FaArrowLeft />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="quick-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>Try these pages instead:</p>
          <div className="link-cards">
            <Link to="/dashboard" className="link-card">
              <span className="card-icon">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/profile" className="link-card">
              <span className="card-icon">👤</span>
              <span>Profile</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;