import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGem } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout, onSectionChange, activeSection, transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { path: '/', label: 'Home' },
  ];

  const dashboardSections = [
    { id: 'home', label: 'Dashboard' },
    { id: 'upload', label: 'Create' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'profile', label: 'Profile' },
  ];

  const handleSectionClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={'navbar ' + (transparent ? 'navbar-transparent' : '')}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FontAwesomeIcon icon={faGem} className="brand-icon" />
          <span className="brand-text">Lustre</span>
        </Link>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        <div className={'navbar-menu ' + (isMenuOpen ? 'is-open' : '')}>
          <ul className="navbar-links">
            {isLoggedIn ? (
              dashboardSections.map((section) => (
                <li key={section.id}>
                  <button 
                    className={'navbar-link ' + (activeSection === section.id ? 'active' : '')}
                    onClick={() => handleSectionClick(section.id)}
                  >
                    {section.label}
                  </button>
                </li>
              ))
            ) : (
              publicLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className={'navbar-link ' + (location.pathname === link.path ? 'active' : '')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))
            )}
          </ul>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <button className="btn-logout" onClick={onLogout}>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-nav btn-nav-ghost">
                  Sign In
                </Link>
                <Link to="/create-account" className="btn-nav btn-nav-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
