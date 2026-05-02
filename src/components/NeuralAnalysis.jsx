import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Activity, Terminal, ShieldCheck, MessageSquare } from 'lucide-react';
import './NeuralAnalysis.css';

const PhaseStep = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="phase-step"
  >
    <div className="step-icon"><Icon size={20} /></div>
    <div className="step-content">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  </motion.div>
);

const NeuralAnalysis = () => {
  return (
    <div className="neural-analysis-view">
      <header className="content-header">
        <div>
          <p className="subtitle">AI Architecture</p>
          <h2 className="heading-serif">Neural Reasoning Pipeline</h2>
        </div>
      </header>

      <div className="pipeline-grid">
        {/* Phase 1: Training/Extraction */}
        <div className="pipeline-column">
          <div className="column-header">
            <Database size={24} />
            <h3>Phase 1: Knowledge Extraction</h3>
          </div>
          <div className="steps-container">
            <PhaseStep delay={0.1} icon={Database} title="Data Collection" desc="PR history, Commits, and Documentation extracted from Pallets/Flask." />
            <PhaseStep delay={0.2} icon={Activity} title="Pre-processing" desc="Cleaning noisy diffs and tokenizing reasoning strings." />
            <PhaseStep delay={0.3} icon={Cpu} title="Architecture Design" desc="Graph-based memory storage using the 'Heirloom Schema'." />
          </div>
        </div>

        <div className="pipeline-connector">
          <div className="connector-line"></div>
        </div>

        {/* Phase 2: Inference/Reasoning */}
        <div className="pipeline-column">
          <div className="column-header">
            <Terminal size={24} />
            <h3>Phase 2: Live Inference</h3>
          </div>
          <div className="steps-container">
            <PhaseStep delay={0.4} icon={MessageSquare} title="Input Processing" desc="User prompts are vectorized and matched against the Knowledge Graph." />
            <PhaseStep delay={0.5} icon={Cpu} title="Output Generation" desc="Heirloom Reasoning Engine predicts the 'Why' using context locals." />
            <PhaseStep delay={0.6} icon={ShieldCheck} title="Safety & Post-Processing" desc="Final answers are filtered for technical accuracy and persona alignment." />
          </div>
        </div>
      </div>

      <div className="live-trace-panel card glass">
        <div className="panel-header">
          <Activity size={18} />
          <h3>Live Engine Trace</h3>
        </div>
        <div className="trace-terminal">
          <p className="trace-line"><span>[SYS]</span> Initializing Reasoning Engine...</p>
          <p className="trace-line"><span>[DATA]</span> Indexing repo_story.json [OK]</p>
          <p className="trace-line"><span>[AI]</span> Model: ibm/granite-13b-chat-v2 (Simulated)</p>
          <p className="trace-line blink"><span>[WAIT]</span> Awaiting User Prompt...</p>
        </div>
      </div>
    </div>
  );
};

export default NeuralAnalysis;
