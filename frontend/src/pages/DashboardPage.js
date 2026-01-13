import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import ConfirmModal from '../components/ui/ConfirmModal';
import {
  HomeSection,
  UploadSection,
  GallerySection,
  FAQSection,
  ContactSection
} from '../components/dashboard';
import './DashboardPage.css';

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  // Use context user as fallback
  useEffect(() => {
    if (user && !userProfile) {
      setUserProfile(user);
    }
  }, [user, userProfile]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/api/user/profile', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const handleSignOutConfirm = () => {
    logout();
    navigate('/login');
  };

  const getUserName = () => {
    if (userProfile && userProfile.fullName) {
      return userProfile.fullName.split(' ')[0];
    }
    return null;
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection userName={getUserName()} />;
      case 'upload':
        return <UploadSection />;
      case 'gallery':
        return <GallerySection />;
      case 'faq':
        return <FAQSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HomeSection userName={getUserName()} />;
    }
  };

  return (
    <div className="dashboard">
      <Navbar 
        isLoggedIn 
        onLogout={handleSignOutClick} 
        onSectionChange={setActiveSection}
        activeSection={activeSection}
        userProfile={userProfile}
      />
      
      <main className="dashboard-main">
        {renderSection()}
      </main>

      <ConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};

export default DashboardPage;
