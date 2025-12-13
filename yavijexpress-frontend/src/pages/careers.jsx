import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRocket,
  FaUsers,
  FaGraduationCap,
  FaHeart,
  FaArrowRight,
  FaJava,
  FaReact,
  FaMobileAlt,
  FaPalette,
  FaBug,
  FaLaptopCode,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaUpload,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaCode,
  FaServer,
  FaDatabase,
  FaCloud,
  FaShieldAlt,
  FaCheckCircle,
  FaHandshake,
  FaLightbulb,
  FaChartLine,
  FaAward
} from "react-icons/fa";

const Careers = () => {
  const [activeRole, setActiveRole] = useState("backend");
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "backend",
    experience: "",
    resume: null,
    coverLetter: ""
  });
  const [applicationStep, setApplicationStep] = useState(1);

  const jobRoles = [
    {
      id: "backend",
      title: "Backend Developer",
      type: "Full-time",
      location: "Remote / Bengaluru",
      experience: "2+ years",
      icon: <FaJava />,
      color: "#3A36E0",
      tags: ["Java", "Spring Boot", "MySQL", "APIs", "Security"]
    },
    {
      id: "frontend",
      title: "Frontend Developer",
      type: "Full-time",
      location: "Remote / Delhi",
      experience: "1+ years",
      icon: <FaReact />,
      color: "#10B981",
      tags: ["React", "TypeScript", "GSAP", "UI/UX", "Animations"]
    },
    {
      id: "mobile",
      title: "Mobile App Developer",
      type: "Full-time",
      location: "Remote / Mumbai",
      experience: "Intern / 1+ years",
      icon: <FaMobileAlt />,
      color: "#8B5CF6",
      tags: ["Flutter", "React Native", "Android", "iOS", "APIs"]
    },
    {
      id: "designer",
      title: "UI/UX Designer",
      type: "Full-time",
      location: "Remote / Hyderabad",
      experience: "1+ years",
      icon: <FaPalette />,
      color: "#F59E0B",
      tags: ["Figma", "Adobe XD", "Prototyping", "Wireframes", "Research"]
    },
    {
      id: "qa",
      title: "QA / Tester",
      type: "Full-time",
      location: "Remote / Chennai",
      experience: "Fresher / 1+ years",
      icon: <FaBug />,
      color: "#EC4899",
      tags: ["Manual Testing", "Automation", "Bug Tracking", "Security", "QA"]
    }
  ];

  const roleDetails = {
    backend: {
      title: "Backend Developer (Java / Spring Boot)",
      responsibilities: [
        "Develop secure and scalable REST APIs",
        "Implement authentication, authorization, and payment logic",
        "Work with MySQL and performance optimization",
        "Design microservices architecture",
        "Ensure system security and data protection"
      ],
      skills: [
        "Java, Spring Boot, Spring Security",
        "REST APIs, JWT, MySQL, PostgreSQL",
        "Microservices, Docker, Kubernetes",
        "AWS / Cloud deployment experience",
        "Performance optimization and caching"
      ],
      perks: [
        "Work on core platform architecture",
        "Hands-on with high-traffic systems",
        "Learn from senior architects",
        "Competitive salary + ESOPs"
      ]
    },
    frontend: {
      title: "Frontend Developer (React / TypeScript)",
      responsibilities: [
        "Build responsive and animated user interfaces",
        "Integrate APIs with backend services",
        "Improve user experience using smooth animations",
        "Optimize application performance",
        "Collaborate with UI/UX designers"
      ],
      skills: [
        "React, TypeScript, HTML, CSS",
        "GSAP / animation libraries",
        "UI/UX understanding",
        "Redux / State management",
        "Responsive design principles"
      ],
      perks: [
        "Creative freedom for animations",
        "Latest tech stack exposure",
        "Build pixel-perfect UIs",
        "Performance bonus for optimizations"
      ]
    },
    mobile: {
      title: "Mobile App Developer (Future Scope)",
      responsibilities: [
        "Develop Android or cross-platform apps",
        "Integrate real-time tracking and notifications",
        "Build offline capabilities",
        "Optimize app performance",
        "Implement security features"
      ],
      skills: [
        "Flutter / React Native / Android",
        "API integration",
        "Native mobile development",
        "Push notifications",
        "App store deployment"
      ],
      perks: [
        "Pioneer mobile development team",
        "Build from ground up",
        "Influence product direction",
        "Stock options for early team"
      ]
    },
    designer: {
      title: "UI/UX Designer",
      responsibilities: [
        "Design clean, user-friendly dashboards",
        "Create wireframes and interactive prototypes",
        "Conduct user research and testing",
        "Design system creation",
        "Collaborate with development team"
      ],
      skills: [
        "Figma / Adobe XD",
        "Understanding of user behavior",
        "Prototyping tools",
        "Design systems",
        "User research methodologies"
      ],
      perks: [
        "Own complete design system",
        "Direct user interaction",
        "Latest design tools access",
        "Conference and workshop budget"
      ]
    },
    qa: {
      title: "QA / Tester",
      responsibilities: [
        "Test application features and workflows",
        "Identify bugs and security issues",
        "Create test plans and cases",
        "Automation testing development",
        "Performance and load testing"
      ],
      skills: [
        "Manual testing expertise",
        "Basic automation knowledge",
        "Bug tracking tools",
        "Security testing basics",
        "API testing"
      ],
      perks: [
        "Comprehensive testing exposure",
        "Automation training",
        "Security certification support",
        "Performance bonus for bug finds"
      ]
    }
  };

  const benefits = [
    {
      icon: <FaRocket />,
      title: "Fast-Paced Growth",
      description: "Learn and grow in a fast-paced startup environment"
    },
    {
      icon: <FaChartLine />,
      title: "Real Impact",
      description: "Work on real-world transportation and safety challenges"
    },
    {
      icon: <FaHeart />,
      title: "Social Impact",
      description: "Contribute to meaningful social change"
    },
    {
      icon: <FaLaptopCode />,
      title: "Modern Tech",
      description: "Exposure to modern technologies and scalable systems"
    },
    {
      icon: <FaUsers />,
      title: "Great Culture",
      description: "Friendly, collaborative, and growth-oriented culture"
    },
    {
      icon: <FaGraduationCap />,
      title: "Learning",
      description: "Continuous learning with mentorship and training"
    }
  ];

  const cultureValues = [
    { icon: <FaHandshake />, title: "Transparency & Trust", color: "#3A36E0" },
    { icon: <FaGraduationCap />, title: "Continuous Learning", color: "#10B981" },
    { icon: <FaUsers />, title: "Respect & Accountability", color: "#8B5CF6" },
    { icon: <FaLightbulb />, title: "Innovation-Driven", color: "#F59E0B" }
  ];

  const internshipBenefits = [
    "Hands-on real project experience",
    "Mentorship from senior developers",
    "Internship certificate & recommendation",
    "Stipend based on performance",
    "Potential full-time offer",
    "Flexible working hours"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setApplicationData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleSubmitApplication = () => {
    // Here you would integrate with backend
    console.log("Application submitted:", applicationData);
    setShowApplication(false);
    setApplicationStep(1);
    setApplicationData({
      name: "",
      email: "",
      phone: "",
      role: "backend",
      experience: "",
      resume: null,
      coverLetter: ""
    });
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
    <div className="careers-page">
      {/* Hero Section */}
      <motion.section
        className="careers-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <div className="careers-badge">
            <FaRocket className="badge-icon" />
            <span>We're Hiring</span>
          </div>
          <h1 className="careers-title">
            Careers at <span className="gradient-text">YaVij Express</span>
          </h1>
          <p className="careers-subtitle">
            We're building more than just a ride-sharing platform — we're creating a safer,
            smarter, and more connected travel community. Join our journey.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <FaUsers className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">5+</div>
                <div className="stat-label">Open Roles</div>
              </div>
            </div>
            <div className="stat">
              <FaMapMarkerAlt className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">Remote</div>
                <div className="stat-label">Work Options</div>
              </div>
            </div>
            <div className="stat">
              <FaGraduationCap className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">Internships</div>
                <div className="stat-label">For Students</div>
              </div>
            </div>
            <div className="stat">
              <FaHandshake className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">Impact</div>
                <div className="stat-label">Real World</div>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <button
              className="cta-btn primary"
              onClick={() => setShowApplication(true)}
            >
              <FaUpload /> Apply Now
            </button>
            <a href="#roles" className="cta-btn outline">
              <FaBriefcase /> View Roles
            </a>
          </div>
        </div>
      </motion.section>

      <div className="careers-container">
        {/* Why Work With Us */}
        <motion.section
          className="benefits-section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="section-header">
            <h2>Why Work With Us?</h2>
            <p>We believe in innovation, responsibility, and teamwork</p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-card"
                variants={fadeIn}
                whileHover={{ y: -10 }}
              >
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Open Roles */}
        <motion.section
          id="roles"
          className="roles-section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="section-header">
            <h2>Open Roles</h2>
            <p>Find your perfect role and join our mission</p>
          </div>

          {/* Role Categories */}
          <div className="role-categories">
            {jobRoles.map((role) => (
              <button
                key={role.id}
                className={`role-category ${activeRole === role.id ? 'active' : ''}`}
                onClick={() => setActiveRole(role.id)}
                style={{ borderColor: role.color }}
              >
                <div className="category-icon" style={{ color: role.color }}>
                  {role.icon}
                </div>
                <div className="category-content">
                  <h4>{role.title}</h4>
                  <div className="category-meta">
                    <span className="meta-item">
                      <FaMapMarkerAlt /> {role.location}
                    </span>
                    <span className="meta-item">
                      <FaClock /> {role.type}
                    </span>
                    <span className="meta-item">
                      <FaBriefcase /> {role.experience}
                    </span>
                  </div>
                </div>
                {activeRole === role.id && (
                  <div className="active-indicator" style={{ background: role.color }}></div>
                )}
              </button>
            ))}
          </div>

          {/* Role Details */}
          <motion.div
            className="role-details"
            key={activeRole}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="details-header">
              <div className="role-title-section">
                <div className="role-icon" style={{ background: jobRoles.find(r => r.id === activeRole)?.color }}>
                  {jobRoles.find(r => r.id === activeRole)?.icon}
                </div>
                <div>
                  <h3>{roleDetails[activeRole].title}</h3>
                  <div className="role-tags">
                    {jobRoles.find(r => r.id === activeRole)?.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="apply-role-btn"
                onClick={() => setShowApplication(true)}
                style={{ background: jobRoles.find(r => r.id === activeRole)?.color }}
              >
                <FaArrowRight /> Apply for this Role
              </button>
            </div>

            <div className="details-content">
              <div className="details-column">
                <h4>Responsibilities</h4>
                <ul className="responsibilities-list">
                  {roleDetails[activeRole].responsibilities.map((item, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className="list-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="details-column">
                <h4>Skills Required</h4>
                <ul className="skills-list">
                  {roleDetails[activeRole].skills.map((skill, idx) => (
                    <li key={idx}>
                      <FaCode className="list-icon" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="details-column">
                <h4>Role Perks</h4>
                <ul className="perks-list">
                  {roleDetails[activeRole].perks.map((perk, idx) => (
                    <li key={idx}>
                      <FaAward className="list-icon" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Internship Section */}
        <motion.section
          className="internship-section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="section-header">
            <h2>Internship Opportunities</h2>
            <p>Perfect for students and freshers looking to kickstart their career</p>
          </div>

          <div className="internship-card">
            <div className="internship-header">
              <FaGraduationCap className="internship-icon" />
              <div className="internship-title">
                <h3>Developer & Designer Internships</h3>
                <p>3-6 months • Stipend Available • Remote/On-site</p>
              </div>
            </div>

            <div className="internship-benefits">
              <h4>Interns Get:</h4>
              <div className="benefits-grid">
                {internshipBenefits.map((benefit, idx) => (
                  <div key={idx} className="intern-benefit">
                    <FaCheckCircle className="benefit-icon" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="internship-actions">
              <button
                className="internship-btn"
                onClick={() => {
                  setApplicationData(prev => ({ ...prev, role: "backend" }));
                  setShowApplication(true);
                }}
              >
                <FaUpload /> Apply for Internship
              </button>
              <a href="mailto:internships@yavijexpress.com" className="internship-link">
                <FaEnvelope /> Email for Internship Queries
              </a>
            </div>
          </div>
        </motion.section>

        {/* Culture Section */}
        <motion.section
          className="culture-section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="section-header">
            <h2>Our Culture</h2>
            <p>The values that drive everything we do</p>
          </div>

          <div className="culture-grid">
            {cultureValues.map((value, idx) => (
              <motion.div
                key={idx}
                className="culture-card"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
              >
                <div className="culture-icon" style={{ color: value.color }}>
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>Core principle that guides our team interactions and decisions</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How to Apply */}
        <motion.section
          className="apply-section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="apply-card">
            <div className="apply-content">
              <h2>Ready to Join Our Journey?</h2>
              <p>Send your resume or portfolio to careers@yavijexpress.com or apply through the form below.</p>

              <div className="apply-methods">
                <div className="method">
                  <FaEnvelope className="method-icon" />
                  <div>
                    <h4>Email Application</h4>
                    <p>careers@yavijexpress.com</p>
                  </div>
                </div>
                <div className="method">
                  <FaLinkedin className="method-icon" />
                  <div>
                    <h4>LinkedIn</h4>
                    <p>Connect with our hiring team</p>
                  </div>
                </div>
                <div className="method">
                  <FaGithub className="method-icon" />
                  <div>
                    <h4>GitHub Profile</h4>
                    <p>Share your projects and code</p>
                  </div>
                </div>
              </div>

              <div className="final-cta">
                <button
                  className="cta-btn primary large"
                  onClick={() => setShowApplication(true)}
                >
                  <FaUpload /> Submit Your Application
                </button>
                <p className="cta-note">
                  Whether you're a student, fresher, or experienced professional —
                  if you want to build something impactful, YaVij Express is the place for you.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplication && (
          <motion.div
            className="application-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowApplication(false)}
          >
            <motion.div
              className="application-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <FaRocket className="modal-icon" />
                <h2>Apply to YaVij Express</h2>
                <p>Join our mission to revolutionize urban mobility</p>
              </div>

              <div className="modal-steps">
                <div className={`step ${applicationStep === 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <span>Personal Info</span>
                </div>
                <div className={`step ${applicationStep === 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <span>Role & Experience</span>
                </div>
                <div className={`step ${applicationStep === 3 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <span>Documents</span>
                </div>
              </div>

              <div className="modal-body">
                {applicationStep === 1 && (
                  <motion.div
                    className="application-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={applicationData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={applicationData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={applicationData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {applicationStep === 2 && (
                  <motion.div
                    className="application-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="form-group">
                      <label>Applying for Role *</label>
                      <select
                        name="role"
                        value={applicationData.role}
                        onChange={handleInputChange}
                      >
                        {jobRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Years of Experience *</label>
                      <select
                        name="experience"
                        value={applicationData.experience}
                        onChange={handleInputChange}
                      >
                        <option value="">Select experience</option>
                        <option value="fresher">Fresher (0-1 years)</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cover Letter (Optional)</label>
                      <textarea
                        name="coverLetter"
                        value={applicationData.coverLetter}
                        onChange={handleInputChange}
                        placeholder="Tell us why you want to join YaVij Express..."
                        rows="4"
                      />
                    </div>
                  </motion.div>
                )}

                {applicationStep === 3 && (
                  <motion.div
                    className="application-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="form-group">
                      <label>Upload Resume *</label>
                      <div className="file-upload">
                        <input
                          type="file"
                          id="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="file-input"
                        />
                        <label htmlFor="resume" className="file-label">
                          <FaUpload className="upload-icon" />
                          <span>
                            {applicationData.resume
                              ? applicationData.resume.name
                              : "Choose file (PDF, DOC, DOCX)"}
                          </span>
                        </label>
                        {applicationData.resume && (
                          <div className="file-preview">
                            <FaCheckCircle className="check-icon" />
                            <span>File selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Portfolio / GitHub Link (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/yourusername or portfolio link"
                      />
                    </div>
                    <div className="application-note">
                      <FaShieldAlt className="note-icon" />
                      <p>Your application data is secure and will only be used for recruitment purposes.</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="modal-actions">
                {applicationStep > 1 && (
                  <button
                    className="modal-btn secondary"
                    onClick={() => setApplicationStep(applicationStep - 1)}
                  >
                    ← Back
                  </button>
                )}

                <div className="progress-indicator">
                  Step {applicationStep} of 3
                </div>

                {applicationStep < 3 ? (
                  <button
                    className="modal-btn primary"
                    onClick={() => setApplicationStep(applicationStep + 1)}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    className="modal-btn primary"
                    onClick={handleSubmitApplication}
                    disabled={!applicationData.name || !applicationData.email || !applicationData.resume}
                  >
                    <FaRocket /> Submit Application
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;