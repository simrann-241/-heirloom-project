import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, FileText, User, Zap, Info } from 'lucide-react';
import { getDecisions, getFiles, getPersons, getRelationships } from '../utils/dataLoader';
import './KnowledgeGraph.css';

const KnowledgeGraph = () => {
  const decisions = getDecisions();
  const files = getFiles().slice(0, 8); // Keep it clean
  const persons = getPersons();
  const relationships = getRelationships();

  const [selectedNode, setSelectedNode] = useState(null);

  // Layout logic (simplified for hackathon)
  const nodes = [
    ...decisions.map((d, i) => ({ ...d, type: 'decision', x: 400, y: 150 + i * 100, icon: <Zap size={16} /> })),
    ...files.map((f, i) => ({ ...f, type: 'file', x: 150, y: 100 + i * 80, icon: <FileText size={16} /> })),
    ...persons.map((p, i) => ({ ...p, type: 'person', x: 650, y: 200 + i * 120, icon: <User size={16} /> }))
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="knowledge-graph-view"
    >
      <header className="content-header">
        <div>
          <p className="subtitle">Visual Lineage</p>
          <h2 className="heading-serif">Knowledge Graph of Why</h2>
        </div>
        <div className="graph-legend">
          <div className="legend-item"><span className="dot decision"></span> Decision</div>
          <div className="legend-item"><span className="dot file"></span> File</div>
          <div className="legend-item"><span className="dot person"></span> Person</div>
        </div>
      </header>

      <div className="graph-container card glass">
        <svg className="graph-svg" viewBox="0 0 800 600">
          {/* Connections (Lines) */}
          {relationships.map((rel, i) => {
            const fromNode = nodes.find(n => n.id === rel.from || n.path === rel.from);
            const toNode = nodes.find(n => n.id === rel.to || n.path === rel.to);
            
            if (!fromNode || !toNode) return null;

            return (
              <motion.line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={`graph-line ${selectedNode === fromNode.id || selectedNode === toNode.id ? 'active' : ''}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.g
              key={i}
              className={`node-group ${node.type} ${selectedNode === (node.id || node.path) ? 'selected' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: i * 0.05 }}
              onMouseEnter={() => setSelectedNode(node.id || node.path)}
              onMouseLeave={() => setSelectedNode(null)}
            >
              <circle cx={node.x} cy={node.y} r="22" className="node-bg" />
              <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20">
                <div className="node-icon">{node.icon}</div>
              </foreignObject>
              <text x={node.x} y={node.y + 35} textAnchor="middle" className="node-label">
                {node.title || node.path?.split('/').pop() || node.name}
              </text>
            </motion.g>
          ))}
        </svg>

        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="node-details-panel glass"
            >
              <div className="panel-header">
                <Info size={18} />
                <h3>Node Context</h3>
              </div>
              <div className="panel-body">
                <h4>{nodes.find(n => (n.id || n.path) === selectedNode)?.title || selectedNode}</h4>
                <p>This node is a critical part of the {nodes.find(n => (n.id || n.path) === selectedNode)?.type} lineage. Hover to see connections.</p>
                <div className="connection-count">
                  <span>3 Connections</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default KnowledgeGraph;
