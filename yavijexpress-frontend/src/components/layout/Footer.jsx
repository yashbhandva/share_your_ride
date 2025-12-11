const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div>© {year} YaVij Express</div>
      <div className="app-footer-links">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Support</span>
      </div>
    </footer>
  );
};

export default Footer;
