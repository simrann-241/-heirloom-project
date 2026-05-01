import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, FileText, GitPullRequest, ExternalLink } from 'lucide-react';
import './WhyChat.css';

const Message = ({ text, sender, citations }) => (
  <div className={`message ${sender}`}>
    <div className="message-bubble">
      <p>{text}</p>
      {citations && (
        <div className="citations">
          {citations.map((c, i) => (
            <div key={i} className="citation-tag">
              {c.type === 'pr' ? <GitPullRequest size={12} /> : <FileText size={12} />}
              <span>{c.label}</span>
              <ExternalLink size={10} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const WhyChat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am Heirloom. I've analyzed the repository's history and decision logs. What would you like to know about the architecture?",
      sender: "ai"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Based on PR #215 and the discussion between @sarah and @marcus, we chose Postgres because we needed ACID compliance for the transaction ledger. We initially considered MongoDB, but abandoned it after the consistency issues in the Q1 prototype.",
        sender: "ai",
        citations: [
          { type: 'pr', label: 'PR #215: Add transaction layer' },
          { type: 'file', label: 'architecture_decisions.md' }
        ]
      }]);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="why-chat-view"
    >
      <header className="content-header">
        <div>
          <p className="subtitle">Contextual Intelligence</p>
          <h2 className="heading-serif">Why-Chat</h2>
        </div>
      </header>

      <div className="chat-container card">
        <div className="messages-area">
          {messages.map((m, i) => (
            <Message key={i} {...m} />
          ))}
        </div>
        
        <div className="input-area">
          <input 
            type="text" 
            placeholder="Ask about a decision, a trade-off, or a landmine..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn-primary" onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WhyChat;
