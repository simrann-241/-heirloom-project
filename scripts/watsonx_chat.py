import os
import json
import requests
import time
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
When asked for advice, give specific architectural insights based on your experience building the Pallets ecosystem.
Keep your answers concise but visionary."""

# Load knowledge
try:
    with open(os.path.join(os.path.dirname(__file__), '../src/data/repo_story.json'), 'r', encoding='utf-8') as f:
        repo_knowledge = json.load(f)
except:
    repo_knowledge = {"decisions": []}

def get_smart_fallback(query, persona="heirloom"):
    query = query.lower()
    if persona == "armin":
        return "Pragmatism is key. In the early days of Flask, we focused on making the request context explicit but easy to use. My advice? Don't over-engineer until the complexity forces your hand."
    
    return "I've analyzed the repo. Ask me about our architectural shifts!"

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
        if not API_KEY or API_KEY == "demo_mode":
            return get_smart_fallback(user_query, persona)
            
        token = get_iam_token()
        if not token:
            return get_smart_fallback(user_query, persona)

        system_context = ARMIN_PROMPT if persona == "armin" else "Answer as a technical repository mentor."
        
        payload = {
            "model_id": "ibm/granite-13b-chat-v2",
            "input": f"{system_context}\n\nUser: {user_query}\nArmin:",
            "parameters": {"decoding_method": "greedy", "max_new_tokens": 150},
            "project_id": PROJECT_ID
        }
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(WATSONX_URL, headers=headers, json=payload, timeout=5)
        
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
    print("HEIRLOOM INVINCIBLE ENGINE READY (with Armin Persona)")
    print("🛡️ "*15 + "\n")
    app.run(port=5000)
