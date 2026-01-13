import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Card, { CardBody } from '../ui/Card';
import './ContactSection.css';

const contactInfo = [
  { icon: faEnvelope, title: 'Email', value: 'project2024rj@gmail.com' },
  { icon: faPhone, title: 'Phone', value: '+91 9059717805' },
  { icon: faMapMarkerAlt, title: 'Location', value: 'KMIT, Narayanaguda' },
];

const ContactSection = () => {
  return (
    <section className="section-contact">
      <div className="section-header">
        <h1>Contact Us</h1>
        <p>We would love to hear from you</p>
      </div>

      <div className="contact-cards">
        {contactInfo.map((info, i) => (
          <Card key={i} hover className="contact-card">
            <CardBody>
              <FontAwesomeIcon icon={info.icon} className="contact-icon" />
              <h3>{info.title}</h3>
              <p>{info.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ContactSection;
