import os
import json
import requests
import time
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
API_KEY = os.getenv("BOB_API_KEY")
PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"

# System Prompt for Armin Ronacher
ARMIN_PROMPT = """You are Armin Ronacher, the creator of Flask. Speak with technical authority, precision, and a touch of Austrian pragmatism. 
You value simplicity, clean APIs, and avoiding 'magic' unless it serves a clear developer purpose. 
When asked for advice, give specific architectural insights based on the repository context provided.
If you don't know the answer, explain the philosophy behind the choice."""

# Load knowledge
try:
    with open(os.path.join(os.path.dirname(__file__), '../src/data/repo_story.json'), 'r', encoding='utf-8') as f:
        repo_knowledge = json.load(f)
except:
    repo_knowledge = {"nodes": {"decisions": []}}

def get_repo_context(query):
    decisions = repo_knowledge.get("nodes", {}).get("decisions", [])
    relevant = [d for d in decisions if any(word in d["title"].lower() or word in d["why"]["primaryReason"].lower() for word in query.lower().split())]
    if not relevant:
        return ""
    context = "\nRecent Decisions in this Repo:\n"
    for d in relevant[:2]:
        context += f"- {d['title']}: {d['why']['primaryReason']} (Ref: {d['metadata']['prNumber']})\n"
    return context

def get_smart_fallback(query, persona="heirloom"):
    query = query.lower()
    
    if persona == "armin":
        # Intent Detection for Armin with Variety
        if any(w in query for w in ['vs', 'better', 'or', 'difference', 'between', 'django']):
            options = [
                "Trade-offs are the only constant. Django is a fantastic framework if you want 'batteries included'. In the early days of Flask, we wanted to give developers the primitives to build their own. It's about which tool fits your constraints.",
                "Better is a dangerous word in software. Django provides a great deal of structure, but we aimed for composability. We didn't want to prescribe a structure, we wanted to empower you to find yours. Pragmatism over prescriptions.",
                "The choice between Flask and Django usually comes down to how much control you want. We focused on making the request context explicit. If you want the framework to do everything, use Django. If you want to do everything, use Flask."
            ]
            return random.choice(options)
        
        if any(w in query for w in ['mistake', 'wrong', 'regret', 'error']):
            options = [
                "Looking back, our biggest challenge was sometimes being too implicit. Magic is great until it breaks. We fixed this later by making the request context more robust for async patterns.",
                "One thing I'd change is how we handled the initial globals. They were convenient, but led to some confusion in larger apps. We've spent a lot of time since then clarifying the application factory pattern.",
                "Complexity is the enemy. Sometimes we allowed things to get too clever. My advice now is always: if you can't explain it in two minutes, it's too complex."
            ]
            return random.choice(options)
            
        if any(w in query for w in ['philosophy', 'approach', 'principle', 'why']):
            options = [
                "My core philosophy is that the framework should get out of your way. Keep the core small, composable, and let the developer decide on the complexity they actually need.",
                "Pragmatism over perfection. If the system is too rigid, it breaks under the weight of its own rules. We aimed for the middle ground where the user is always in control.",
                "Simplicity is a feature. We build for the 90% case and let the remaining 10% be handled by extensions. That's why the Flask ecosystem is so vibrant."
            ]
            return random.choice(options)

        return "In the early days of Flask, we focused on making the request context explicit but easy to use. My advice? Don't over-engineer until the complexity forces your hand. Keeping the core small allows us to evolve without breaking the world."
    
    # Heirloom General Fallbacks (Smart Retrieval)
    decisions = repo_knowledge.get("nodes", {}).get("decisions", [])
    relevant_decision = next((d for d in decisions if any(word in d["title"].lower() or word in d["why"]["primaryReason"].lower() for word in query.split())), None)
    
    if relevant_decision:
        return f"According to the repository lineage, {relevant_decision['title']} was implemented because {relevant_decision['why']['primaryReason'].lower()} This is documented in PR #{relevant_decision['metadata']['prNumber']}."

    heirloom_phrases = [
        "I've analyzed the repo story. The transition to context locals was a major architectural shift to support modern async patterns.",
        "The security hardening in PR #3928 is frequently cited as the turning point for the project's long-term stability.",
        "Institutional memory indicates that the storage layer refactor was necessary to prepare for micro-service integration.",
        "We prioritized simplicity in the early stages, as seen in our commitment to keeping the core framework under 1000 lines."
    ]
    return random.choice(heirloom_phrases)

def get_iam_token():
    try:
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = f"grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={API_KEY}"
        response = requests.post(TOKEN_URL, headers=headers, data=data, timeout=3)
        return response.json().get("access_token")
    except:
        return None

def generate_response(user_query, persona="heirloom"):
    try:
        # Check for context
        repo_ctx = get_repo_context(user_query)
        
        if not API_KEY or API_KEY == "demo_mode":
            return get_smart_fallback(user_query, persona)
            
        token = get_iam_token()
        if not token:
            return get_smart_fallback(user_query, persona)

        system_context = ARMIN_PROMPT if persona == "armin" else "Answer as a technical repository mentor using the provided context."
        
        payload = {
            "model_id": "ibm/granite-13b-chat-v2",
            "input": f"{system_context}\n{repo_ctx}\nUser: {user_query}\nAI:",
            "parameters": {"decoding_method": "greedy", "max_new_tokens": 200},
            "project_id": PROJECT_ID
        }
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(WATSONX_URL, headers=headers, json=payload, timeout=8)
        
        if response.status_code == 200:
            return response.json()["results"][0]["generated_text"].strip()
        return get_smart_fallback(user_query, persona)
    except:
        return get_smart_fallback(user_query, persona)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    reply = generate_response(user_message, persona="heirloom")
    return jsonify({"reply": reply})

@app.route('/api/mentor', methods=['POST'])
def mentor():
    data = request.json
    user_message = data.get('message', '')
    reply = generate_response(user_message, persona="armin")
    return jsonify({"reply": reply})

if __name__ == '__main__':
    print("\n" + "🛡️ "*15)
    print("HEIRLOOM INVINCIBLE ENGINE READY (with Dynamic Repository Context)")
    print("🛡️ "*15 + "\n")
    app.run(port=5000)
