import { motion } from "framer-motion";
import { 
  FaRocket, 
  FaShieldAlt, 
  FaUsers, 
  FaAward, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCar,
  FaChartLine,
  FaHandshake,
  FaStar,
  FaLinkedin,
  FaTwitter,
  FaGithub
} from "react-icons/fa";

const About = () => {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      bio: "Former Head of Operations at Uber India. 10+ years experience in transportation and logistics.",
      image: "👨‍💼",
      color: "#3A36E0",
      skills: ["Strategy", "Leadership", "Operations"],
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Priya Sharma",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer specialized in scalable platforms and real-time systems.",
      image: "👩‍💻",
      color: "#10B981",
      skills: ["Technology", "Architecture", "AI/ML"],
      linkedin: "#",
      github: "#"
    }
  ];

  const companyStats = [
    { icon: <FaMapMarkerAlt />, label: "Cities", value: "25+", color: "#3A36E0" },
    { icon: <FaCar />, label: "Vehicles", value: "5000+", color: "#10B981" },
    { icon: <FaUsers />, label: "Users", value: "100K+", color: "#8B5CF6" },
    { icon: <FaChartLine />, label: "Growth", value: "300%", color: "#F59E0B" },
    { icon: <FaStar />, label: "Rating", value: "4.8/5", color: "#EF4444" },
    { icon: <FaHandshake />, label: "Partners", value: "50+", color: "#06B6D4" }
  ];

  const values = [
    {
      icon: <FaShieldAlt />,
      title: "Safety First",
      description: "Every ride is insured with real-time tracking and emergency features.",
      color: "#3A36E0"
    },
    {
      icon: <FaRocket />,
      title: "Speed & Efficiency",
      description: "Average pickup time under 5 minutes in metro cities.",
      color: "#10B981"
    },
    {
      icon: <FaUsers />,
      title: "Community Focus",
      description: "Supporting local drivers and sustainable transportation.",
      color: "#8B5CF6"
    },
    {
      icon: <FaAward />,
      title: "Excellence",
      description: "5-star rated service with quality checks and training.",
      color: "#F59E0B"
    }
  ];

  const milestones = [
    { year: "2020", title: "Founded", description: "Started operations in Bengaluru" },
    { year: "2021", title: "Expansion", description: "Launched in 5 major cities" },
    { year: "2022", title: "Series A", description: "Raised $10M in funding" },
    { year: "2023", title: "Tech Launch", description: "AI-powered dispatch system" },
    { year: "2024", title: "Pan-India", description: "Operating in 25+ cities" }
  ];

  const fadeInUp = {
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
    <div className="about-page">
      {/* Hero Section */}
      <motion.section 
        className="about-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="about-hero-content">
          <h1 className="about-title">
            <span className="gradient-text">Redefining Urban Mobility</span>
          </h1>
          <p className="about-subtitle">
            YaVij Express is India's fastest-growing ride-sharing platform, 
            connecting millions of riders with verified drivers across 25+ cities.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">2+</div>
              <div className="stat-label">Years of Trust</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">99.7%</div>
              <div className="stat-label">Ride Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="floating-car">🚖</div>
          <div className="floating-map">🗺️</div>
          <div className="floating-star">⭐</div>
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section 
        className="about-story"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="section-header">
          <h2>Our Story</h2>
          <p>From a simple idea to India's most trusted ride-sharing platform</p>
        </div>
        <motion.div className="story-content" variants={fadeInUp}>
          <div className="story-text">
            <p>
              Founded in 2020 by <strong>Rajesh Kumar</strong> and <strong>Priya Sharma</strong>, 
              YaVij Express began with a mission to solve urban transportation challenges in India.
            </p>
            <p>
              What started as a small startup in Bengaluru has now grown into a pan-India platform, 
              serving over 100,000 users daily with safe, reliable, and affordable rides.
            </p>
            <p>
              Our name "YaVij" symbolizes <em>"Journey of Victory"</em> - celebrating every successful 
              journey we facilitate for our customers.
            </p>
          </div>
          <div className="story-image">
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-content">
                    <h4>{milestone.title}</h4>
                    <p>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Core Values */}
      <motion.section 
        className="about-values"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="section-header">
          <h2>Our Core Values</h2>
          <p>The principles that drive everything we do</p>
        </div>
        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              className="value-card"
              variants={fadeInUp}
              style={{ borderTopColor: value.color }}
              whileHover={{ y: -10 }}
            >
              <div className="value-icon" style={{ color: value.color }}>
                {value.icon}
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="about-team"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="section-header">
          <h2>Meet Our Leadership</h2>
          <p>The visionaries behind YaVij Express</p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              className="team-card"
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
            >
              <div className="team-avatar" style={{ backgroundColor: member.color }}>
                <span className="avatar-emoji">{member.image}</span>
                <div className="avatar-badge">{member.role.split(' ')[0]}</div>
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-skills">
                  {member.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="team-social">
                  {member.linkedin && (
                    <a href={member.linkedin} className="social-link">
                      <FaLinkedin />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} className="social-link">
                      <FaTwitter />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} className="social-link">
                      <FaGithub />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="about-stats"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="section-header">
          <h2>By The Numbers</h2>
          <p>Our impact in numbers</p>
        </div>
        <div className="stats-grid">
          {companyStats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section 
        className="about-mission"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="mission-grid">
          <motion.div className="mission-card" variants={fadeInUp}>
            <div className="mission-header">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
            </div>
            <p>
              To make urban transportation accessible, affordable, and safe for 
              every Indian by leveraging technology and community partnerships.
            </p>
          </motion.div>
          <motion.div className="vision-card" variants={fadeInUp}>
            <div className="mission-header">
              <div className="mission-icon">🚀</div>
              <h3>Our Vision</h3>
            </div>
            <p>
              To become India's most trusted mobility platform, connecting 
              100+ cities and creating 50,000+ driver-partner opportunities by 2025.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="about-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-content">
          <h2>Join Our Journey</h2>
          <p>Be part of India's transportation revolution</p>
          <div className="cta-buttons">
            <a href="/register" className="cta-btn primary">
              Start Riding
            </a>
            <a href="/contact" className="cta-btn secondary">
              Partner With Us
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;