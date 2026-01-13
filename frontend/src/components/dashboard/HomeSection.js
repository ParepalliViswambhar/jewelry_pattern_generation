import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import Card, { CardBody } from '../ui/Card';
import './HomeSection.css';

const slides = [
  { sketch: '/assets/sketch/1.jpg', result: '/assets/original/1.jpg' },
  { sketch: '/assets/sketch/2.jpg', result: '/assets/original/2.jpg' },
  { sketch: '/assets/sketch/3.jpg', result: '/assets/original/3.jpg' },
  { sketch: '/assets/sketch/4.jpg', result: '/assets/original/4.jpg' },
  { sketch: '/assets/sketch/5.jpg', result: '/assets/original/5.jpg' },
];

const steps = ['Upload your sketch', 'AI processes design', 'Download result'];

const HomeSection = ({ userName }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const prevSlide = () => setSlideIndex((i) => (i - 1 + slides.length) % slides.length);
  const nextSlide = () => setSlideIndex((i) => (i + 1) % slides.length);

  return (
    <section className="section-home">
      <div className="section-header">
        <h1>Welcome back{userName ? ', ' + userName : ''}!</h1>
        <p>Explore our gallery of transformations</p>
      </div>

      <div className="showcase-slider">
        <button className="slider-btn prev" onClick={prevSlide}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        
        <div className="slider-content">
          <div className="slider-card">
            <img src={slides[slideIndex].sketch} alt="Sketch" />
            <span className="slider-label">Sketch</span>
          </div>
          <div className="slider-arrow">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
          <div className="slider-card">
            <img src={slides[slideIndex].result} alt="Result" />
            <span className="slider-label">AI Result</span>
          </div>
        </div>

        <button className="slider-btn next" onClick={nextSlide}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={'dot ' + (i === slideIndex ? 'active' : '')}
            onClick={() => setSlideIndex(i)}
          />
        ))}
      </div>

      <div className="quick-steps">
        <h2>How It Works</h2>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <Card key={i} hover className="step-card">
              <CardBody>
                <span className="step-number">{i + 1}</span>
                <p>{step}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
