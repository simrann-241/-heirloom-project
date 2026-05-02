import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Quote, User } from 'lucide-react';
import { getPersons } from '../utils/dataLoader';
import GhostChat from './GhostChat';
import './GhostMentor.css';

const MentorCard = ({ id, name, role, era, avatar, bio, sample, onConsult }) => (
  <div className="card mentor-card">
    <div className="mentor-header">
      <div className="mentor-avatar">{avatar}</div>
      <div className="mentor-meta">
        <h4 className="heading-serif">{name}</h4>
        <p>{role} • {era}</p>
      </div>
    </div>
    <p className="mentor-bio">{bio}</p>
    <div className="mentor-quote">
      <Quote size={14} />
      <p>{sample}</p>
    </div>
    <button 
      className="btn-primary" 
      style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
      onClick={() => onConsult(id)}
    >
      <MessageSquare size={18} />
      Consult {name.split(' ')[0]}
    </button>
  </div>
);

const GhostMentor = () => {
  const persons = getPersons();
  const [activePersona, setActivePersona] = useState(null);
  
  const mentors = persons.map(p => ({
    id: p.id,
    name: p.name,
    role: p.role,
    era: p.id === 'person-2' ? 'Founding Era' : 'Current Maintainer',
    avatar: p.id === 'person-2' ? '👨🏻‍💻' : '👩🏻‍💻',
    bio: `${p.name} has contributed ${p.contributions?.prCount || 0} PRs and has an impact score of ${p.contributions?.impactScore || 0}. Expertise: ${p.expertise?.join(', ') || 'Various'}.`,
    sample: p.id === 'person-2'
      ? "Flask is a micro-framework for a reason. Keep the core small, and let extensions do the rest."
      : "We need to ensure async support doesn't break the existing WSGI ecosystem."
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ghost-mentor-view"
    >
      <header className="content-header">
        <div>
          <p className="subtitle">Institutional Memory</p>
          <h2 className="heading-serif">Ghost Mentors</h2>
        </div>
      </header>

      <div className="mentor-grid">
        {mentors.map((m, i) => (
          <MentorCard 
            key={i} 
            {...m} 
            onConsult={(id) => setActivePersona(id)}
          />
        ))}
        
        <div className="card add-mentor-card">
          <div className="dashed-circle">
            <User size={32} />
          </div>
          <h4 className="heading-serif">Digitize a Developer</h4>
          <p>Import PR history to create a new persona.</p>
          <button className="text-btn">Get Started</button>
        </div>
      </div>

      <AnimatePresence>
        {activePersona && (
          <GhostChat 
            personaId={activePersona} 
            onClose={() => setActivePersona(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GhostMentor;
