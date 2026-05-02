import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';
import './OnboardingTour.css';

const steps = [
  {
    title: "Welcome to Heirloom",
    content: "This is your project's institutional memory. Instead of just code, you've inherited the reasoning behind it.",
    target: "dashboard-header"
  },
  {
    title: "The Why-Chat",
    content: "Stuck on a weird architectural choice? Ask Why-Chat. It reasons across every PR and commit to find the answer.",
    target: "nav-why-chat"
  },
  {
    title: "Meet Your Ghost Mentors",
    content: "Consult with the digital personas of developers who built this system, even if they've left the company.",
    target: "nav-ghost-mentor"
  },
  {
    title: "Watch for Landmines",
    content: "Heirloom automatically flags fragile code areas where previous developers struggled. Proceed with caution!",
    target: "landmine-list"
  }
];

const OnboardingTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="tour-overlay">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="tour-card card glass"
      >
        <div className="tour-progress">
          {steps.map((_, i) => (
            <div key={i} className={`progress-dot ${i === currentStep ? 'active' : ''}`}></div>
          ))}
        </div>
        
        <header className="tour-header">
          <Sparkles size={20} className="sparkle-icon" />
          <h3 className="heading-serif">{steps[currentStep].title}</h3>
          <button className="close-tour" onClick={onComplete}><X size={18} /></button>
        </header>

        <p className="tour-content">{steps[currentStep].content}</p>

        <footer className="tour-footer">
          <button className="text-btn" onClick={prev} disabled={currentStep === 0}>
            <ChevronLeft size={16} /> Back
          </button>
          <button className="btn-primary" onClick={next}>
            {currentStep === steps.length - 1 ? 'Finish Tour' : 'Next Step'}
            <ChevronRight size={16} />
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default OnboardingTour;
