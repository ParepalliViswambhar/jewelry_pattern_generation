import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGem, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout, onSectionChange, activeSection, userProfile, transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  const publicLinks = [
    { path: '/', label: 'Home' },
  ];

  const dashboardSections = [
    { id: 'home', label: 'Home' },
    { id: 'upload', label: 'Create' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSectionClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    setIsMenuOpen(false);
  };

  const getInitial = () => {
    if (userProfile?.fullName) return userProfile.fullName.charAt(0).toUpperCase();
    if (userProfile?.email) return userProfile.email.charAt(0).toUpperCase();
    return 'U';
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
              <div className="profile-menu" ref={profileRef}>
                <button 
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="profile-avatar">{getInitial()}</span>
                  <span className="profile-name">{userProfile?.fullName?.split(' ')[0] || 'Account'}</span>
                </button>
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <span className="profile-avatar-lg">{getInitial()}</span>
                      <div className="profile-details">
                        <span className="profile-fullname">{userProfile?.fullName || 'User'}</span>
                        <span className="profile-email">{userProfile?.email || ''}</span>
                      </div>
                    </div>
                    <div className="profile-divider"></div>
                    <button className="profile-action logout" onClick={onLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
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
