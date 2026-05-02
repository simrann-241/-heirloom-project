import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Quote, ExternalLink } from 'lucide-react';
import { loadPersona, getRelevantDecisions, generatePersonaResponse } from '../services/personaService';
import './GhostChat.css';

const GhostChat = ({ personaId, onClose }) => {
  const [persona, setPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const p = loadPersona(personaId);
    setPersona(p);
    
    // Create initial greeting message
    const greeting = p.voiceModel?.commonPhrases?.[0] || "Let me help you";
    setMessages([{
      role: 'assistant',
      content: `Hello. I am the digital legacy of ${p.name}. I've been synthesized from my repository history and design decisions. ${greeting}. How can I help you understand the architecture today?`
    }]);
  }, [personaId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const context = getRelevantDecisions(persona, input);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) throw new Error('Mentor offline');
      
      const data = await response.json();
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, context }]);
    } catch (error) {
      console.log("Using Local Persona Context...");
      const localResponse = await generatePersonaResponse(persona, input, context);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', content: localResponse, context }]);
      }, 1000);
    }
  };

  if (!persona) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="ghost-chat-overlay"
    >
      <div className="ghost-chat-container card glass">
        <header className="chat-header">
          <div className="mentor-info">
            <span className="mentor-avatar-small">{persona.avatar || '👤'}</span>
            <div>
              <h3>{persona.name}</h3>
              <p>{persona.role} • Digital Legacy</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="chat-messages" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="avatar-icon">
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
                {msg.context && msg.context.length > 0 && (
                  <div className="message-context">
                    <p className="context-label">Related Decisions:</p>
                    {msg.context.map((d, j) => (
                      <div key={j} className="context-card">
                        <Quote size={12} />
                        <span>{d.title}</span>
                        <ExternalLink size={10} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message assistant">
              <div className="avatar-icon"><Bot size={16} /></div>
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${persona.name.split(' ')[0]} about philosophy, tradeoffs...`}
          />
          <button className="send-btn btn-primary" onClick={handleSend} disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GhostChat;
