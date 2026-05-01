import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Quote, User } from 'lucide-react';
import './GhostMentor.css';

const MentorCard = ({ name, role, era, avatar, bio, sample }) => (
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
    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
      <MessageSquare size={18} />
      Consult {name.split(' ')[0]}
    </button>
  </div>
);

const GhostMentor = () => {
  const mentors = [
    {
      name: "Sarah Chen",
      role: "Lead Architect",
      era: "2021 - 2023",
      avatar: "👩🏻‍💻",
      bio: "Authored the core microservices layer. Known for aggressive performance optimization and strict type safety.",
      sample: "If you're looking at the billing service, don't use a float for currency. We learned that the hard way in the Q3 incident."
    },
    {
      name: "Marcus Vane",
      role: "Senior Backend",
      era: "2019 - 2022",
      avatar: "👨🏼‍💻",
      bio: "Designed the original data pipeline. Advocate for simple, readable code over clever abstractions.",
      sample: "The database schema is denormalized for a reason. Don't try to join the events table on the fly."
    }
  ];

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
          <MentorCard key={i} {...m} />
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
    </motion.div>
  );
};

export default GhostMentor;
