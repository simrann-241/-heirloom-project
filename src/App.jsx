import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Zap, 
  Settings, 
  Search,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Ghost
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GhostMentor from './components/GhostMentor';
import WhyChat from './components/WhyChat';
import './App.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'why-chat', icon: MessageSquare, label: 'Why-Chat' },
    { id: 'ghost-mentor', icon: Ghost, label: 'Ghost Mentor' },
    { id: 'knowledge', icon: BookOpen, label: 'Knowledge Graph' },
    { id: 'history', icon: History, label: 'Lineage' },
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
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-content"
    >
      <header className="content-header">
        <div>
          <p className="subtitle">Welcome back, Developer</p>
          <h2 className="heading-serif">Repository Overview</h2>
        </div>
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search knowledge..." />
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Decisions Extracted</p>
          <h3>142</h3>
        </div>
        <div className="stat-card">
          <p>Ghost Mentors</p>
          <h3>4</h3>
        </div>
        <div className="stat-card">
          <p>Landmines Detected</p>
          <h3>12</h3>
        </div>
      </div>

      <div className="main-grid">
        <div className="card span-2">
          <div className="card-header">
            <h3 className="heading-serif">Recent Knowledge Activity</h3>
            <button className="text-btn">View all <ArrowRight size={14} /></button>
          </div>
          <div className="activity-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon">💡</div>
                <div className="activity-info">
                  <h4>New Decision Extracted: PR #402</h4>
                  <p>Migration from REST to GraphQL for User Service. Reason: Bandwidth optimization.</p>
                </div>
                <span className="activity-time">2h ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="heading-serif">Active Landmines</h3>
          </div>
          <div className="landmine-list">
            <div className="landmine-item warning">
              <ShieldAlert size={18} />
              <div>
                <h4>auth_middleware.js</h4>
                <p>High incident rate. Last failed March 12.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
          {activeTab === 'ghost-mentor' && <GhostMentor key="ghost-mentor" />}
          {activeTab === 'why-chat' && <WhyChat key="why-chat" />}
          {activeTab !== 'dashboard' && activeTab !== 'ghost-mentor' && activeTab !== 'why-chat' && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="placeholder-view"
            >
              <h2 className="heading-serif">{activeTab.replace('-', ' ')}</h2>
              <p>The Bob-powered engine is analyzing your repository lineage.</p>
              <div className="loading-spinner"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
