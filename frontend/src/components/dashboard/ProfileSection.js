import Card, { CardBody } from '../ui/Card';
import './ProfileSection.css';

const ProfileSection = ({ userProfile }) => {
  const getInitial = () => {
    if (userProfile && userProfile.fullName) {
      return userProfile.fullName.charAt(0);
    }
    if (userProfile && userProfile.email) {
      return userProfile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <section className="section-profile">
      <div className="section-header">
        <h1>Your Profile</h1>
        <p>Manage your account details</p>
      </div>

      {userProfile ? (
        <Card className="profile-card">
          <CardBody>
            <div className="profile-avatar">
              {getInitial()}
            </div>
            <div className="profile-details">
              <div className="profile-field">
                <label>Full Name</label>
                <span>{userProfile.fullName || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <span>{userProfile.email || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>Phone</label>
                <span>{userProfile.phone || 'N/A'}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="loading-state">Loading profile...</div>
      )}
    </section>
  );
};

export default ProfileSection;
