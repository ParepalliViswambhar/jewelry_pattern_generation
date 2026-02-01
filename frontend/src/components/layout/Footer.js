import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FontAwesomeIcon icon={faGem} />
              <span>Lustre</span>
            </Link>
            <p className="footer-tagline">
              Transform your jewelry sketches into stunning designs with AI-powered generation.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/create-account">Get Started</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/#contact">Help Center</a></li>
              <li><a href="/#contact">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>lustrejewelry@gmail.com</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} />
                <span>+91 9059717805</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>KMIT, Narayanaguda</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
