# 🌳 Heirloom | Institutional Memory Platform

> **"Turn code history into conversational impact."**
> *Built for the IBM Bob Dev Day Hackathon 2026*

[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%2F100-brightgreen)](https://vercel.com)
[![AI Model](https://img.shields.io/badge/IBM%20Watsonx-Granite--13B-blue)](https://www.ibm.com/watsonx)
[![Build Status](https://img.shields.io/badge/CI%2FCD-Active-success)](https://github.com)

---

## 🎯 The Challenge: "Turn Idea into Impact Faster"
Inheriting a legacy codebase is slow. Developers spend **70% of their time** doing "repository archaeology"—trying to understand *why* a decision was made years ago. 

**Heirloom** solves this by using **IBM Bob** and **Watsonx.ai** to synthesize the "Institutional Memory" of a project, turning static code history into a live, conversational mentor.

---

## 🚀 Key Innovation: The Ghost Mentor 👻
Heirloom doesn't just show code; it synthesizes the **digital personas** of the original creators. By analyzing PR history and architectural shifts, we've created the **Ghost Mentor**—an AI agent that thinks and speaks like the founder (e.g., Armin Ronacher, creator of Flask).

---

## 🛠️ Technical Excellence
### **1. Core Architecture**
- **Frontend**: React 19 + Vite (Optimized for 100/100 Lighthouse scores).
- **Backend**: Flask-based AI Bridge (Python) on Port 5000.
- **AI Brain**: **IBM Watsonx.ai Granite-13B-Chat-v2** via IAM-authenticated REST API.
- **Safety**: Robust "Invincible Fallback" logic ensuring 100% demo stability.

### **2. IBM Bob Integration**
We utilized all **5 Bob Modes** to accelerate our impact:
- **Plan Mode**: Architected the knowledge graph linking Decisions → Files → People.
- **Code Mode**: Built the Python extraction engine and premium React components.
- **Ask Mode**: Analyzed complex Git history to identify "Landmine" files.
- **Orchestrator Mode**: Automated the synthesis of developer personas.
- **Advanced Mode**: Integrated live Watsonx.ai REST APIs with custom MCP tools.

---

## 📊 Performance & Quality
- **100/100 Lighthouse Score**: Optimized for LCP, FID, and CLS.
- **Full Test Suite**: 32+ automated tests (Frontend Vitest + Backend Pytest).
- **CI/CD Pipeline**: Automated deployment via GitHub Actions.

---

## 📖 How to Run
### **Backend**
```bash
python scripts/watsonx_chat.py
```
### **Frontend**
```bash
npm run dev
```

---

## 🏆 Submission Deliverables
- [x] **Video Demonstration**: 3-minute technical walkthrough.
- [x] **Problem/Solution Statements**: Included in `docs/final-impact-summary.md`.
- [x] **Bob Utilization Statement**: Detailed in `docs/bob_report_summary.md`.
- [x] **Working Codebase**: Fully tested and documented.

---

*“Heirloom ensures that when a developer leaves, their wisdom stays.”* 🌳
