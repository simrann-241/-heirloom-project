import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  Terminal,
  TrendingUp,
  Coins,
  Code,
  Clock,
  CheckCircle,
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';
import { getRepoMetadata, getRepository, getDecisions, getLandmines } from '../utils/dataLoader';
import { 
  fetchBobalyticsData, 
  formatBobFactor, 
  formatNumber, 
  formatDuration,
  getBobFactorStatus 
} from '../services/bobService';
import './Dashboard.css';

const Sparkles = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
  </svg>
);

const Dashboard = ({ onStartTour }) => {
  const meta = getRepoMetadata();
  const repo = getRepository();
  const decisions = getDecisions();
  const landmines = getLandmines();

  // Bobalytics state
  const [bobalyticsData, setBobalyticsData] = useState(null);
  const [isLoadingBobalytics, setIsLoadingBobalytics] = useState(true);
  const [bobalyticsError, setBobalyticsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch Bobalytics data
  const loadBobalyticsData = async () => {
    setIsLoadingBobalytics(true);
    setBobalyticsError(null);
    
    try {
      const data = await fetchBobalyticsData();
      setBobalyticsData(data.data);
      setLastUpdated(new Date());
    } catch (error) {
      setBobalyticsError(error.message);
    } finally {
      setIsLoadingBobalytics(false);
    }
  };

  useEffect(() => {
    loadBobalyticsData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadBobalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const bobFactorStatus = bobalyticsData ? getBobFactorStatus(bobalyticsData.bob_factor) : 'good';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-content"
    >
      <header className="content-header" id="dashboard-header">
        <div>
          <div className="repo-badge">
            <GitBranch size={12} />
            <span>{repo.name}</span>
          </div>
          <h2 className="heading-serif">Repository Intelligence</h2>
        </div>
        <div className="header-actions">
          <button className="text-btn" onClick={onStartTour}>
            <Sparkles size={14} /> Start Guided Tour
          </button>
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search institutional memory..." />
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Decisions Inherited</p>
          <h3>{meta.totalDecisions}</h3>
        </div>
        <div className="stat-card">
          <p>Active Landmines</p>
          <h3>{meta.totalLandmines}</h3>
        </div>
        <div className="stat-card">
          <p>Files Indexed</p>
          <h3>{meta.totalFiles}</h3>
        </div>
      </div>

      {/* Live Bobalytics Section */}
      <div className="bobalytics-section">
        <div className="card bobalytics-card">
          <div className="card-header">
            <div className="bobalytics-title">
              <Activity size={20} className="bobalytics-icon" />
              <h3 className="heading-serif">Live Bobalytics</h3>
              <span className="live-indicator">
                <span className="pulse-dot"></span>
                LIVE
              </span>
            </div>
            <button 
              className="refresh-btn" 
              onClick={loadBobalyticsData}
              disabled={isLoadingBobalytics}
              title="Refresh Bobalytics data"
            >
              <RefreshCw size={16} className={isLoadingBobalytics ? 'spinning' : ''} />
            </button>
          </div>

          {isLoadingBobalytics && !bobalyticsData ? (
            <div className="bobalytics-loading">
              <div className="loading-spinner"></div>
              <p>Fetching Bob Platform metrics...</p>
            </div>
          ) : bobalyticsError ? (
            <div className="bobalytics-error">
              <ShieldAlert size={24} />
              <p>Failed to load Bobalytics data</p>
              <button className="btn-secondary" onClick={loadBobalyticsData}>
                Try Again
              </button>
            </div>
          ) : bobalyticsData ? (
            <>
              {/* Bob Factor - Primary Metric */}
              <div className="bob-factor-display">
                <div className="bob-factor-main">
                  <div className="bob-factor-label">
                    <Zap size={16} />
                    <span>Bob Factor</span>
                    <div className="tooltip">
                      <span className="tooltip-icon">?</span>
                      <div className="tooltip-content">
                        Your productivity score based on code quality, velocity, and engagement. Range: 0-100%
                      </div>
                    </div>
                  </div>
                  <div className={`bob-factor-value ${bobFactorStatus}`}>
                    {formatBobFactor(bobalyticsData.bob_factor)}
                  </div>
                  <div className="bob-factor-bar">
                    <div 
                      className={`bob-factor-fill ${bobFactorStatus}`}
                      style={{ width: `${bobalyticsData.bob_factor * 100}%` }}
                    ></div>
                  </div>
                  <div className="bob-factor-status">
                    <span className={`status-badge ${bobFactorStatus}`}>
                      {bobFactorStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="bobalytics-metrics">
                <div className="metric-card">
                  <div className="metric-icon coins">
                    <Coins size={20} />
                  </div>
                  <div className="metric-info">
                    <p className="metric-label">Coins Spent</p>
                    <h4 className="metric-value">{formatNumber(bobalyticsData.coins_spent)}</h4>
                    <div className="tooltip">
                      <span className="tooltip-icon">?</span>
                      <div className="tooltip-content">
                        Bob Coins spent on AI assistance and productivity tools
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon code">
                    <Code size={20} />
                  </div>
                  <div className="metric-info">
                    <p className="metric-label">Lines of Code</p>
                    <h4 className="metric-value">{formatNumber(bobalyticsData.lines_of_code)}</h4>
                    <div className="tooltip">
                      <span className="tooltip-icon">?</span>
                      <div className="tooltip-content">
                        Total lines of code written in this session
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon duration">
                    <Clock size={20} />
                  </div>
                  <div className="metric-info">
                    <p className="metric-label">Session Duration</p>
                    <h4 className="metric-value">{formatDuration(bobalyticsData.session_duration_minutes)}</h4>
                    <div className="tooltip">
                      <span className="tooltip-icon">?</span>
                      <div className="tooltip-content">
                        Total active coding time in current session
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon tasks">
                    <CheckCircle size={20} />
                  </div>
                  <div className="metric-info">
                    <p className="metric-label">Tasks Completed</p>
                    <h4 className="metric-value">{bobalyticsData.tasks_completed}</h4>
                    <div className="tooltip">
                      <span className="tooltip-icon">?</span>
                      <div className="tooltip-content">
                        Number of tasks completed in this session
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {lastUpdated && (
                <div className="bobalytics-footer">
                  <p className="last-updated">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                  <a href="#" className="view-details-link">
                    <TrendingUp size={14} />
                    View detailed analytics
                  </a>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className="main-grid">
        <div className="card span-2">
          <div className="card-header">
            <h3 className="heading-serif">Recent Decision Lineage</h3>
            <button className="text-btn">Explore Graph <ArrowRight size={14} /></button>
          </div>
          <div className="activity-list">
            {decisions.slice(0, 3).map((d) => (
              <div key={d.id} className="activity-item">
                <div className="activity-icon">💡</div>
                <div className="activity-info">
                  <h4>{d.title}</h4>
                  <p>{d.why.primaryReason}</p>
                  <div className="activity-tags">
                    <span className="tag">{d.type}</span>
                    <span className="tag-outline">{d.evidence.sourceId}</span>
                  </div>
                </div>
                <span className="activity-time">Feb 2026</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="heading-serif">Live Landmines</h3>
          </div>
          <div className="landmine-list">
            {landmines.map((l) => (
              <div key={l.id} className="landmine-item warning">
                <ShieldAlert size={18} />
                <div>
                  <h4>{l.location.file}</h4>
                  <p>{l.warning.description.slice(0, 60)}...</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer-action">
            <button className="btn-secondary">
              <Terminal size={14} />
              Scan for new threats
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

// Made with Bob
