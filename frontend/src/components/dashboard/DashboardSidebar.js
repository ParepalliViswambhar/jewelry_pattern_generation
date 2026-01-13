import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faUpload, faImages, faQuestionCircle, faUser, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import './DashboardSidebar.css';

const navItems = [
  { id: 'home', label: 'Home', icon: faHome },
  { id: 'upload', label: 'Create', icon: faUpload },
  { id: 'gallery', label: 'Gallery', icon: faImages },
  { id: 'about', label: 'FAQ', icon: faQuestionCircle },
  { id: 'profile', label: 'Profile', icon: faUser },
  { id: 'contact', label: 'Contact', icon: faEnvelope },
];

const DashboardSidebar = ({ activeSection, onSectionChange }) => {
  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={'sidebar-item ' + (activeSection === item.id ? 'active' : '')}
            onClick={() => onSectionChange(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
