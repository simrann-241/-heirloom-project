# 🤖 IBM Bob Usage Report: Heirloom
**Project**: Heirloom
**Team**: Simran Singh

Heirloom was built as a collaborative effort between the developer and **IBM Bob**, utilizing his full spectrum of capabilities to solve the problem of institutional knowledge loss.

## 1. Plan Mode: Architectural Foundation
- **Task**: Architecting the "Knowledge Graph of Why."
- **Bob's Contribution**: Bob designed the 8-node schema (Decision, Person, File, etc.) and the hybrid extraction strategy. He identified that combining pattern matching with LLM reasoning was the most efficient path for a hackathon MVP.

## 2. Code Mode: Knowledge Engine Implementation
- **Task**: Building the `knowledge_engine.py` script.
- **Bob's Contribution**: Bob wrote the complete Python extraction pipeline. He implemented the logic to parse PR text for "Decision Indicators" and simulated the LLM reasoning summaries that populate our `repo_story.json`.

## 3. Ask Mode: Logic Audit & Impact Analysis
- **Task**: Explaining the system architecture.
- **Bob's Contribution**: We used Ask mode to audit the connection between our Python backend and React frontend. Bob provided a deep-dive analysis (saved in `docs/bob_case_study.md`) that explained exactly how Heirloom accelerates onboarding.

## 4. Orchestrator Mode: Persona Synthesis & API Integration
- **Task**: Digitizing Armin Ronacher & Live Telemetry.
- **Bob's Contribution**: Bob orchestrated the multi-step synthesis of the "Ghost of Armin" persona, creating the voice model, technical philosophy, and example responses in a single workflow. He also orchestrated the security setup (`.env` templates) and the telemetry bridge for Live Bobalytics.

## 📊 Summary of Efficiency
- **Bobcoins Spent**: ~3.01 / 40.00
- **Time Saved**: Estimated 2 weeks of engineering work condensed into 6 hours.
- **Outcome**: A production-ready prototype with deep repository intelligence.
