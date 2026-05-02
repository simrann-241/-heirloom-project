# 🌳 Heirloom: The Institutional Memory Platform
**Built for the IBM Bob Dev Day Hackathon**

## 🎯 The Vision: Turn Idea into Impact Faster
In the modern software ecosystem, code is easy to find, but **reasoning** is easy to lose. When developers leave a project, their "tribal knowledge"—the context, the trade-offs, and the "why" behind architectural decisions—often vanishes with them. New developers spend weeks performing "repository archaeology" just to understand why a specific line of code exists.

**Heirloom** solves this by using **IBM Bob** to capture, preserve, and synthesize institutional memory.

## ✨ Key Features
- **🧠 Knowledge Extraction Engine**: A hybrid Python pipeline that traverses repository history to extract the "Why" behind major architectural shifts.
- **👻 Ghost Mentors**: AI-synthesized personas of previous developers (like Flask's creator, Armin Ronacher). Developers can "Consult the Ghost" to understand the original philosophy of the system.
- **🕸️ Knowledge Graph of Why**: An interactive visualization connecting Decisions, Files, and People, mapping the DNA of the codebase.
- **🚩 Live Landmines**: Proactive warnings about fragile code areas where previous developers faced significant challenges or regressions.
- **📊 Live Bobalytics**: Real-time integration with the IBM Bob platform to track team productivity and the "Bob Factor."

## 🤖 Powered by IBM Bob & Enterprise-Grade AI
Heirloom was built as a deep collaboration with **IBM Bob**, utilizing his advanced reasoning capabilities across multiple modes:
- **Plan Mode**: To architect the multi-node knowledge graph.
- **Code Mode**: To build the Python extraction engine.
- **Ask Mode**: To analyze and audit the reasoning extraction logic.
- **Orchestrator Mode**: To synthesize complex developer personas and manage security integrations.
### 🏢 Enterprise AI Integration
Heirloom leverages **IBM Watsonx.ai Granite-13B-Chat-v2**, an enterprise-grade foundation model, for intelligent reasoning:
- **Real IBM Cloud Integration**: Authenticated via IBM Cloud IAM tokens for production-grade security
- **Granite-13B Model**: 13 billion parameter model optimized for technical reasoning and code understanding
- **Secure & Scalable**: Enterprise-level authentication, rate limiting, and error handling
- **Context-Aware Intelligence**: AI trained on institutional memory from repository history


## 🚀 Impact
Heirloom reduces onboarding time from months to minutes. By making institutional knowledge conversational and visual, we empower teams to build on their heritage rather than repeating its mistakes.

## 🧪 Testing & Quality Assurance

Heirloom includes a comprehensive test suite ensuring reliability and maintainability:

### Frontend Tests (Vitest + React Testing Library)
- ✅ 13+ component tests for [`WhyChat.jsx`](src/components/WhyChat.jsx)
- ✅ User interaction testing
- ✅ API integration testing
- ✅ Fallback behavior validation
- ✅ 80%+ code coverage target

### Backend Tests (Pytest)
- ✅ 25+ unit tests for [`watsonx_chat.py`](scripts/watsonx_chat.py)
- ✅ Smart fallback logic testing
- ✅ IBM Cloud IAM authentication testing
- ✅ Flask endpoint testing
- ✅ 85%+ code coverage target

### Running Tests

```bash
# Frontend tests
npm test                    # Run all tests
npm run test:coverage       # Generate coverage report

# Backend tests
pytest                      # Run all Python tests
pytest --cov=scripts        # Run with coverage
```

## 🚀 CI/CD Pipeline

Automated testing and deployment via GitHub Actions:

- **Continuous Integration**: Runs on every push and PR
- **Automated Testing**: Frontend (Vitest) + Backend (Pytest)
- **Security Scanning**: npm audit + Python safety checks
- **Automatic Deployment**: Deploys to Vercel on successful tests
- **Preview Deployments**: Creates preview URLs for pull requests

### Deployment

```bash
# Manual deployment
vercel --prod

# Automatic deployment
# Push to main branch → Auto-deploys to production
# Create PR → Auto-creates preview deployment
```

## 📚 Documentation

- [Testing & Deployment Guide](docs/testing-and-deployment-guide.md) - Complete setup and troubleshooting
- [Test Suite Documentation](tests/README.md) - Detailed test coverage and patterns
- [Watsonx Integration Guide](docs/watsonx-integration-guide.md) - AI integration details
- [Performance & Accessibility Audit](docs/performance-accessibility-audit.md) - Quality metrics

## 🛠️ Quick Start

```bash
# Install dependencies
npm install
pip install -r requirements-test.txt

# Run development server
npm run dev

# Run tests
npm test
pytest

# Build for production
npm run build
```

---
**Turn your heritage into your edge with Heirloom.** 🛡️
