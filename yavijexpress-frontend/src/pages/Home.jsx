import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCar,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaUserFriends,
  FaRupeeSign,
  FaArrowRight,
  FaUsers,
  FaHeart
} from "react-icons/fa";

const Home = () => {
  // Features data
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "100% Safe Rides",
      description: "Verified drivers, real-time tracking, and emergency assistance",
      color: "#3A36E0"
    },
    {
      icon: <FaClock />,
      title: "Quick Pickup",
      description: "Average pickup time under 5 minutes in metro cities",
      color: "#10B981"
    },
    {
      icon: <FaStar />,
      title: "Premium Service",
      description: "Clean, comfortable cars with professional drivers",
      color: "#F59E0B"
    },
    {
      icon: <FaRupeeSign />,
      title: "Affordable Pricing",
      description: "Transparent pricing with no hidden charges",
      color: "#EF4444"
    }
  ];

  // Stats data - FOR HERO SECTION
  const heroStats = [
    { value: "5000+", label: "Happy Riders" },
    { value: "1000+", label: "Verified Drivers" },
    { value: "25+", label: "Cities" },
    { value: "4.8★", label: "Rating" }
  ];

  // Stats data - FOR STATS SECTION
  const stats = [
    { value: "50K+", label: "Registered Users", icon: <FaUserFriends /> },
    { value: "25+", label: "Cities", icon: "🏙️" },
    { value: "4.9", label: "Rating", icon: <FaStar /> },
    { value: "1M+", label: "Rides Completed", icon: <FaCar /> }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Regular Passenger",
      content: "YaVij Express has transformed my daily commute. The drivers are professional and rides are always on time!",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Priya Patel",
      role: "Business Traveler",
      content: "Perfect for airport transfers. Safe, reliable, and affordable service.",
      rating: 5,
      avatar: "👩‍💼"
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Welcome to
              <span className="brand-name"> YaVij Express</span>
            </h1>
            <p className="hero-subtitle">
              India's fastest-growing ride-sharing platform connecting passengers
              with verified drivers across 25+ cities.
            </p>

            {/* ===== HERO STATS SECTION - ADDED HERE ===== */}
            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {heroStats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </motion.div>
            {/* ===== END HERO STATS ===== */}

            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                <FaUsers />
                Start Riding
              </Link>
              <Link to="/register" className="btn btn-outline">
                <FaCar />
                Become a Driver
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hero-image"
          >
            <div className="floating-car">🚖</div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose YaVij?</h2>
            <p className="section-subtitle">Experience the best in ride-sharing</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What People Say</h2>
            <p className="section-subtitle">Trusted by thousands of users</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2>Ready to Join Our Community?</h2>
            <p>Sign up today and get your first ride with 20% discount</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn">
                <FaArrowRight />
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;