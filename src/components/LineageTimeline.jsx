import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Calendar, User, ArrowDown } from 'lucide-react';
import { getDecisions } from '../utils/dataLoader';
import './LineageTimeline.css';

const TimelineItem = ({ decision, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="timeline-item"
  >
    <div className="timeline-marker">
      <div className="marker-dot"></div>
      <div className="marker-line"></div>
    </div>
    
    <div className="timeline-content card">
      <div className="timeline-date">
        <Calendar size={12} />
        <span>{new Date(decision.timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
      </div>
      <h3 className="heading-serif">{decision.title}</h3>
      <p className="timeline-reason">{decision.why.primaryReason}</p>
      
      <div className="timeline-footer">
        <div className="author-tag">
          <User size={12} />
          <span>{decision.metadata.authors[0]}</span>
        </div>
        <div className="pr-tag">
          <GitCommit size={12} />
          <span>{decision.evidence.sourceId}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const LineageTimeline = () => {
  const decisions = getDecisions().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="lineage-view"
    >
      <header className="content-header">
        <div>
          <p className="subtitle">Chronological Record</p>
          <h2 className="heading-serif">Codebase Lineage</h2>
        </div>
      </header>

      <div className="timeline-container">
        {decisions.map((d, i) => (
          <TimelineItem key={d.id} decision={d} index={i} />
        ))}
        
        <div className="timeline-end">
          <div className="marker-dot end"></div>
          <p>Repository Initialized</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LineageTimeline;
