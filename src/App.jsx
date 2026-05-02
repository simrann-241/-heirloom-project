import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Settings,
  Ghost,
  BookOpen,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import GhostMentor from './components/GhostMentor';
import WhyChat from './components/WhyChat';
import KnowledgeGraph from './components/KnowledgeGraph';
import LineageTimeline from './components/LineageTimeline';
import OnboardingTour from './components/OnboardingTour';
import NeuralAnalysis from './components/NeuralAnalysis';
import './App.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'why-chat', icon: MessageSquare, label: 'Why-Chat' },
    { id: 'ghost-mentor', icon: Ghost, label: 'Ghost Mentor' },
    { id: 'knowledge', icon: BookOpen, label: 'Knowledge Graph' },
    { id: 'history', icon: History, label: 'Lineage' },
    { id: 'neural', icon: Cpu, label: 'Neural Analysis' },
  ];

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo-tree">🌳</div>
        <h1 className="heading-serif">Heirloom</h1>
      </div>
      
      <nav className="nav-group">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="bob-status">
          <div className="pulse"></div>
          <span>Bob Engine Active</span>
        </div>
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Show tour on first visit
    const hasVisited = localStorage.getItem('heirloom_visited');
    if (!hasVisited) {
      setShowTour(true);
      localStorage.setItem('heirloom_visited', 'true');
    }
  }, []);

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" onStartTour={() => setShowTour(true)} />}
          {activeTab === 'ghost-mentor' && <GhostMentor key="ghost-mentor" id="nav-ghost-mentor" />}
          {activeTab === 'why-chat' && <WhyChat key="why-chat" id="nav-why-chat" />}
          {activeTab === 'knowledge' && <KnowledgeGraph key="knowledge" />}
          {activeTab === 'history' && <LineageTimeline key="history" />}
          {activeTab === 'neural' && <NeuralAnalysis key="neural" />}
          {activeTab !== 'dashboard' && activeTab !== 'ghost-mentor' && activeTab !== 'why-chat' && activeTab !== 'knowledge' && activeTab !== 'history' && activeTab !== 'neural' && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="placeholder-view"
            >
              <h2 className="heading-serif">{activeTab.replace('-', ' ')}</h2>
              <p>The Bob-powered engine is traversing the knowledge graph.</p>
              <div className="loading-spinner"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showTour && <OnboardingTour onComplete={() => setShowTour(false)} />}
      </AnimatePresence>
    </div>
  );
}
