import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, FileText, GitPullRequest, ExternalLink } from 'lucide-react';
import { getDecisions } from '../utils/dataLoader';
import './WhyChat.css';

const Message = ({ text, sender, citations }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`message ${sender}`}
  >
    <div className="message-bubble shadow-sm">
      <p>{text}</p>
      {citations && citations.length > 0 && (
        <div className="citations-group">
          {citations.map((c, i) => (
            <a key={i} href={c.url} target="_blank" rel="noreferrer" className="citation-tag clickable">
              {c.type === 'pr' ? <GitPullRequest size={12} /> : <FileText size={12} />}
              <span>{c.label}</span>
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const WhyChat = () => {
  const decisions = getDecisions();
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am Heirloom. I've analyzed the pallets/flask repository lineage. I can explain the 'Why' behind major architectural shifts. What are you working on?",
      sender: "ai"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.toLowerCase();
    setMessages(prev => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      // 🚀 Try calling the Reasoning Engine
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      // 🔗 DYNAMIC CITATION EXTRACTOR
      let citations = [];
      const prMatch = data.reply.match(/PR #(\d+)/);
      if (prMatch) {
        const prNum = prMatch[1];
        citations.push({ 
          type: 'pr', 
          label: `PR #${prNum}`, 
          url: `https://github.com/pallets/flask/pull/${prNum}` 
        });
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { text: data.reply, sender: "ai", citations }]);
    } catch (error) {
      console.log("Using Local Heirloom Context...");
      setTimeout(() => {
        let responseText = "I see you're asking about the lineage. While I traverse the full PR history, I can tell you that our architectural philosophy favors pragmatism and stability. Try asking about 'async' or 'landmines'!";
        let citations = [];
        
        if (userMsg.includes('async') || userMsg.includes('factor')) {
          responseText = "The reason for our async refactor in 'ctx.py' was to improve concurrency and modern library support. It was a major tradeoff regarding thread-local storage complexity.";
          citations = [{ type: 'pr', label: 'PR #3928', url: 'https://github.com/pallets/flask/pull/3928' }];
        } else if (userMsg.includes('landmine') || userMsg.includes('danger')) {
          responseText = "⚠️ Warning: The ctx.py file contains landmines. It uses complex thread-local storage that can be fragile. Recommended mitigation: Use the provided context managers.";
          citations = [{ type: 'file', label: 'src/flask/ctx.py', url: '#' }];
        } else if (userMsg.includes('hi') || userMsg.includes('hello')) {
          responseText = "Hello! I am Heirloom. I've analyzed your repo's lineage. Ask me about our 'async refactor' or 'active landmines' to see the reasoning behind the code.";
        }

        setIsTyping(false);
        setMessages(prev => [...prev, { text: responseText, sender: "ai", citations }]);
      }, 1000);
    }
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
          {isTyping && (
            <div className="message ai typing">
              <div className="message-bubble">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            </div>
          )}
        </div>
        
        <div className="input-area">
          <input 
            type="text" 
            placeholder="Ask why a decision was made (e.g., 'Why did we refactor context?')..." 
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
