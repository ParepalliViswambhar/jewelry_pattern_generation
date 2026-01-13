import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/layout/Navbar';
import ConfirmModal from '../components/ui/ConfirmModal';
import {
  DashboardSidebar,
  HomeSection,
  UploadSection,
  GallerySection,
  FAQSection,
  ProfileSection,
  ContactSection
} from '../components/dashboard';
import './DashboardPage.css';

const DashboardPage = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      jwtDecode(token);
      fetchUserProfile(token);
    } catch (err) {
      sessionStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

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
    sessionStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
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
      case 'about':
        return <FAQSection />;
      case 'profile':
        return <ProfileSection userProfile={userProfile} />;
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
      />
      
      <div className="dashboard-layout">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="dashboard-main">
          {renderSection()}
        </main>
      </div>

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
