import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWandMagicSparkles, 
  faUpload, 
  faPalette, 
  faDownload,
  faArrowRight,
  faGem
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      icon: faUpload,
      title: 'Upload Sketch',
      description: 'Simply upload your hand-drawn jewelry sketch in any common format.'
    },
    {
      icon: faWandMagicSparkles,
      title: 'AI Generation',
      description: 'Our GAN-powered AI transforms your sketch into a realistic design.'
    },
    {
      icon: faPalette,
      title: 'Refine Design',
      description: 'Fine-tune colors, materials, and details to match your vision.'
    },
    {
      icon: faDownload,
      title: 'Export & Share',
      description: 'Download high-quality renders ready for production or sharing.'
    }
  ];

  return (
    <div className="home-page">
      <Navbar transparent />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <video autoPlay muted loop playsInline className="hero-video">
            <source src="/1.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <FontAwesomeIcon icon={faGem} />
            <span>AI-Powered Design</span>
          </div>
          
          <h1 className="hero-title">
            Transform Your <span className="gradient-text">Jewelry Sketches</span> Into Reality
          </h1>
          
          <p className="hero-subtitle">
            Harness the power of generative AI to convert hand-drawn jewelry designs 
            into stunning, photorealistic renders in seconds.
          </p>
          
          <div className="hero-actions">
            <Link to="/create-account" className="btn-hero-primary">
              Start Creating
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Sign In
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Designs Created</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">500+</span>
              <span className="stat-label">Happy Designers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">99%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card visual-sketch">
            <img src="/assets/sketch/1.jpg" alt="Jewelry Sketch" />
            <span className="visual-label">Your Sketch</span>
          </div>
          <div className="visual-arrow">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
          <div className="visual-card visual-result">
            <img src="/assets/original/1.jpg" alt="Generated Design" />
            <span className="visual-label">AI Result</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">From Sketch to Masterpiece</h2>
            <p className="section-subtitle">
              Our streamlined process makes jewelry design accessible to everyone
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="feature-icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Gallery</span>
            <h2 className="section-title">Recent Transformations</h2>
          </div>

          <div className="showcase-grid">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="showcase-item">
                <div className="showcase-before">
                  <img src={'/assets/sketch/' + num + '.jpg'} alt={'Sketch ' + num} />
                </div>
                <div className="showcase-after">
                  <img src={'/assets/original/' + num + '.jpg'} alt={'Design ' + num} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Transform Your Designs?</h2>
            <p>Join thousands of designers using Lustre to bring their jewelry visions to life.</p>
            <Link to="/create-account" className="btn-cta">
              Get Started Free
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
