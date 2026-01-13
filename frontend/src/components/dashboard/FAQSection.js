import { useState } from 'react';
import './FAQSection.css';

const faqs = [
  { 
    q: 'What is Jewelry Design Pattern Generation?', 
    a: 'It uses advanced GAN (Generative Adversarial Network) AI to transform your hand-drawn jewelry sketches into photorealistic designs.' 
  },
  { 
    q: 'Can I upload my own designs?', 
    a: 'Yes! Upload any jewelry sketch in JPEG, PNG, WEBP, or AVIF format.' 
  },
  { 
    q: 'Is this platform free to use?', 
    a: 'Yes, our platform is completely free for all users to explore and create designs.' 
  },
  { 
    q: 'How long does generation take?', 
    a: 'Most designs are generated within 10-30 seconds depending on complexity.' 
  },
  { 
    q: 'Are the designs copyright-free?', 
    a: 'Yes, all AI-generated designs are yours to use commercially.' 
  },
];

const FAQSection = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <section className="section-faq">
      <div className="section-header">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about Lustre</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className={'faq-item ' + (activeFAQ === i ? 'open' : '')}
            onClick={() => toggleFAQ(i)}
          >
            <div className="faq-question">
              <span>{faq.q}</span>
              <span className="faq-toggle">{activeFAQ === i ? '−' : '+'}</span>
            </div>
            {activeFAQ === i && (
              <div className="faq-answer">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
