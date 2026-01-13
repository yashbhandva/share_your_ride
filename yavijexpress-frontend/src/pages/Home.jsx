import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../assets/home.scss";
import { useEffect } from "react";

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
  // Reusable animation variant for scroll-triggered animations
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  };

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
            className="hero-text"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="hero-title">
              Welcome to
              <span className="brand-name"> YaVij Express</span>
            </h1>
            <p className="hero-subtitle">
              India's fastest-growing ride-sharing platform connecting passengers
              with verified drivers across 25+ cities.
            </p>

            <motion.div
              className="hero-stats"
              variants={fadeInUp}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="hero-stat hover-lift">
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="hero-buttons"
              variants={fadeInUp}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link to="/register" className="btn btn-primary hover-glow">
                <FaUsers />
                Start Riding
              </Link>
              <Link to="/register" className="btn btn-outline">
                <FaCar />
                Become a Driver
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        className="features-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Why Choose YaVij?</h2>
            <p className="section-subtitle">Experience the best in ride-sharing</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature) => (
              <motion.div key={feature.title} className="feature-card hover-lift" variants={fadeInUp}>
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="stats-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <motion.div key={stat.label} className="stat-card hover-lift" variants={fadeInUp}>
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="testimonials-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <div className="container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">What People Say</h2>
            <p className="section-subtitle">Trusted by thousands of users</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} className="testimonial-card hover-lift" variants={fadeInUp}>
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
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="container">
          <motion.div className="cta-content" variants={fadeInUp}>
            <h2>Ready to Join Our Community?</h2>
            <p>Sign up today and get your first ride with 20% discount</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn hover-glow">
                <FaArrowRight />
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
