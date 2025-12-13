import { useState, useEffect } from 'react';
import { FaHeart, FaShieldAlt, FaFileContract, FaHeadset, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`footer ${isVisible ? 'fade-in' : ''}`}>
      {/* Main Footer Content */}
      <div className="footer-container">
        
        {/* Company Info Section */}
        <div className="footer-section company-info">
          <div className="footer-logo">
            <h2 className="logo-text">YaVij<span className="logo-highlight">Express</span></h2>
            <p className="footer-tagline">Ride with Confidence, Arrive with Style</p>
          </div>
          <p className="footer-description">
            Your trusted ride-sharing partner, connecting cities with safety, 
            reliability, and exceptional service since {year - 5}.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/_y_a_s_h004/?next=%2F" className="social-icon" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/emergency">Emergency</a></li>
            <li><a href="/notifications">Notifications</a></li>
            <li><a href="/payment-history">Payment History</a></li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Our Services</h3>
          <ul className="footer-links">
            <li><a href="#">Ride Sharing</a></li>
            <li><a href="#">Corporate Travel</a></li>
            <li><a href="#">Airport Transfers</a></li>
            <li><a href="#">Event Transportation</a></li>
            <li><a href="#">VIP Services</a></li>
          </ul>
        </div>

        {/* Legal & Support Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Support & Legal</h3>
          <ul className="footer-links">
            <li>
              <FaShieldAlt className="link-icon" />
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <FaFileContract className="link-icon" />
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <FaHeadset className="link-icon" />
              <a href="#">24/7 Support</a>
            </li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          © {year} YaVij Express. All rights reserved.
          <span className="made-with">
            Made with <FaHeart className="heart-icon" /> in India
          </span>
        </div>
        
        <div className="footer-actions">
          <button 
            onClick={scrollToTop} 
            className="back-to-top"
            aria-label="Scroll to top"
          >
            ↑ Back to Top
          </button>
          
          <div className="app-version">
            <span className="version-badge">v2.1.4</span>
            <span className="status-dot online"></span>
            <span className="status-text">System Online</span>
          </div>
        </div>
      </div>

      {/* Contact Floating Button */}
      <button className="contact-float" aria-label="Contact Support">
        <FaHeadset />
        <span className="float-text">Need Help?</span>
      </button>
    </footer>
  );
};

export default Footer;