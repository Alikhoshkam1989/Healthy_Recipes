import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="container footer-content">
        <p>&copy; 2026 <span className="gradient-text">Ali Khoshkam</span> | Healthy Recipes App</p>
        <div className="footer-links">
          <span>Powered by Spoonacular & NOVI APIs</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
