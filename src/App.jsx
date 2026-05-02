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
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="logo-section">
        <div className="logo-tree" role="img" aria-label="Heirloom tree logo">🌳</div>
        <h1 className="heading-serif">Heirloom</h1>
      </div>
      
      <nav className="nav-group" aria-label="Primary navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={`Navigate to ${item.label}`}
            aria-current={activeTab === item.id ? 'page' : undefined}
            role="tab"
            aria-selected={activeTab === item.id}
          >
            <item.icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="bob-status" role="status" aria-live="polite" aria-label="Bob AI engine status">
          <div className="pulse" aria-hidden="true"></div>
          <span>Bob Engine Active</span>
        </div>
        <button className="nav-item" aria-label="Open settings">
          <Settings size={20} aria-hidden="true" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
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
    <div className="app-container" role="main">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content" role="main" aria-label="Main content area">
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
              role="status"
              aria-live="polite"
              aria-label="Loading content"
            >
              <h2 className="heading-serif">{activeTab.replace('-', ' ')}</h2>
              <p>The Bob-powered engine is traversing the knowledge graph.</p>
              <div className="loading-spinner" role="progressbar" aria-label="Loading" aria-busy="true"></div>
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
