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
  FaWhatsapp,
  FaInstagram,
  FaGithub,
  FaCode,
  FaServer,
  FaCloud,
  FaMobileAlt,
  FaGlobe,
  FaDatabase
} from "react-icons/fa";

// 2 NEW CEO PHOTOS IMPORT - Adjust paths as needed
import ceo1Photo from '/img/yash.jpg'; // First CEO photo
import ceo2Photo from '/img/vijay.jpg'; // Second CEO photo

// Alternative: Use public folder paths
// const ceo1Photo = "/images/ceo1.jpg";
// const ceo2Photo = "/images/ceo2.jpg";

const About = () => {
  // SIRF 2 NEW TEAM MEMBERS - Both CEOs with real photos
  const teamMembers = [
    {
      name: "Yash Bhandva",
      role: "CEO & Co-Founder",
      bio: "IIT Delhi graduate with 12+ years in tech startups. Previously founded two successful SaaS companies. Passionate about solving India's mobility challenges through technology.",
      image: "👨",
      photo: ceo1Photo, // Real photo path
      color: "#3A36E0",
      skills: ["Entrepreneurship", "Strategy", "Funding", "Growth Hacking", "Leadership", "Java"],
      whatsapp: "https://wa.me/919512570683",
      instagram: "https://www.instagram.com/_y_a_s_h004/",
      isRealPhoto: true,
      isNew: true
    },
    {
      name: "Vijay Bhandva",
      role: "COO & Co-Founder",
      bio: "Ex-McKinsey consultant with deep expertise in operations and scaling. Led operations for India's largest logistics company. MBA from IIM Ahmedabad with focus on sustainable mobility.",
      image: "👨",
      photo: ceo2Photo, // Real photo path
      color: "#10B981",
      skills: ["Operations", "Logistics", "Scale Management", "Process Optimization", "Team Building"],
      whatsapp: "https://wa.me/919016376642",
      instagram: "https://www.instagram.com/_y_a_s_h004/",
      isRealPhoto: true,
      isNew: true
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
      description: "Every ride is insured with real-time tracking and emergency features. Driver verification and 24/7 safety monitoring.",
      color: "#3A36E0"
    },
    {
      icon: <FaRocket />,
      title: "Speed & Efficiency",
      description: "Average pickup time under 5 minutes in metro cities. Optimized routes using AI algorithms.",
      color: "#10B981"
    },
    {
      icon: <FaUsers />,
      title: "Community Focus",
      description: "Supporting local drivers and sustainable transportation. Creating opportunities across India.",
      color: "#8B5CF6"
    },
    {
      icon: <FaAward />,
      title: "Excellence",
      description: "5-star rated service with quality checks and continuous training programs for all partners.",
      color: "#F59E0B"
    }
  ];

  const milestones = [
    { year: "2020", title: "Founded", description: "Started operations in Bengaluru with seed funding" },
    { year: "2021", title: "Expansion", description: "Launched in 5 major metro cities across India" },
    { year: "2022", title: "Series A", description: "Raised $15M in funding from leading VC firms" },
    { year: "2023", title: "Tech Innovation", description: "Launched AI-powered dispatch and route optimization" },
    { year: "2024", title: "Pan-India Reach", description: "Operating in 25+ cities with 5000+ vehicle partners" }
  ];

  // Tech Stack - Platform ke technologies show karne ke liye
  const techStack = [
    { icon: <FaCode />, name: "React/Next.js", description: "Frontend Framework" },
    { icon: <FaServer />, name: "Node.js", description: "Backend API" },
    { icon: <FaDatabase />, name: "MongoDB", description: "Database" },
    { icon: <FaCloud />, name: "AWS", description: "Cloud Infrastructure" },
    { icon: <FaMobileAlt />, name: "React Native", description: "Mobile Apps" },
    { icon: <FaGlobe />, name: "WebSocket", description: "Real-time Tracking" }
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
            Founded by visionary leaders <strong>Yash Bhandva</strong> and <strong>Vijay Bhandva</strong>,
            YaVij Express is India's fastest-growing ride-sharing platform.
            <br />
            <span className="tech-mention">
              Connecting millions of riders with verified drivers across 25+ cities with cutting-edge technology.
            </span>
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
              <div className="stat-label">Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">&lt;5min</div>
              <div className="stat-label">Avg Pickup Time</div>
            </div>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="floating-car">🚖</div>
          <div className="floating-map">📍</div>
          <div className="floating-star">🌟</div>
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
              Founded in 2020 by <strong>Yash Bhandva</strong> and <strong>Vijay Bhandva</strong>,
              YaVij Express began with a mission to solve urban transportation challenges in India.
            </p>
            <p>
             YaVij-Express was born from a simple but powerful idea — making everyday travel easier, safer, and more reliable for everyone. Like many people, we noticed how difficult it can be to find trustworthy transportation at the right time, especially for daily commuting, long-distance travel, or urgent trips.
            </p>
            <p>
              The name YaVij represents the collaboration and shared vision of its founders, combining innovation, responsibility, and dedication to solving real-world mobility problems. We wanted to create a platform where people don't just book rides, but travel with confidence.
            </p>
            <p>
             From the beginning, our focus has been on community-based ride sharing. By connecting verified drivers with genuine passengers, YaVij-Express helps reduce travel stress, save costs, and make better use of existing vehicles — all while keeping safety at the center.
            </p>
            <p>
             We believe technology should serve people, not complicate their lives. That's why YaVij-Express is built using modern, secure, and scalable technologies, ensuring smooth performance, strong data protection, and a user-friendly experience across all devices.
            </p>
            <p>
                Today, YaVij-Express is more than just an app — it is a growing travel community driven by trust, transparency, and innovation. As we continue to evolve, our mission remains the same: to redefine the way people move, connect, and travel together.
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

      {/* Technology Stack Section */}
      <motion.section
        className="about-tech"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="section-header">
          <h2>Our Technology</h2>
          <p>Built with modern technologies for maximum performance and reliability</p>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              className="tech-card"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
            >
              <div className="tech-icon">
                {tech.icon}
              </div>
              <h3>{tech.name}</h3>
              <p className="tech-desc">{tech.description}</p>
            </motion.div>
          ))}
        </div>
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

      {/* Team Section - SIRF 2 NEW CEOS */}
      <motion.section
        className="about-team"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="section-header">
          <h2>Meet Our Founders</h2>
          <p>The visionary leaders behind YaVij Express</p>
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
                {member.isRealPhoto && member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="avatar-photo"
                    loading="lazy"
                    onError={(e) => {
                      // If photo fails to load, show emoji
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="avatar-emoji">${member.image}</span>`;
                    }}
                  />
                ) : (
                  <span className="avatar-emoji">{member.image}</span>
                )}
                <div className="avatar-badge">
                  {member.role.split(' ')[0]}
                </div>
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
                  {member.whatsapp && (
                    <a href={member.whatsapp} className="social-link" aria-label={`${member.name} WhatsApp`}>
                      <FaWhatsapp />
                    </a>
                  )}
                  {member.instagram && (
                    <a href={member.instagram} className="social-link" aria-label={`${member.name} Instagram`}>
                      <FaInstagram />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} className="social-link" aria-label={`${member.name} GitHub`}>
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
              Our mission at YaVij-Express is to make transportation simple, safe, affordable, and accessible for everyone. We aim to connect verified drivers and passengers through a trusted digital platform that reduces travel difficulties, lowers transportation costs, and promotes efficient use of available vehicles. By focusing on safety, transparency, and community trust, we strive to deliver a reliable ride-sharing experience for daily commuters, students, professionals, and long-distance travelers.
            </p>
          </motion.div>
          <motion.div className="vision-card" variants={fadeInUp}>
            <div className="mission-header">
              <div className="mission-icon">🚀</div>
              <h3>Our Vision</h3>
            </div>
            <p>
              Our vision is to become a leading community-driven mobility platform that transforms how people travel together. We aspire to create a future where transportation is not only convenient but also eco-friendly, secure, and socially responsible. By continuously innovating and adopting modern technologies, YaVij-Express envisions a connected travel ecosystem that minimizes empty seats, reduces traffic congestion, and builds a strong network of responsible drivers and passengers across cities and regions.
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
              <FaRocket /> Start Riding
            </a>
            <a href="/contact" className="cta-btn secondary">
              <FaHandshake /> Partner With Us
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;