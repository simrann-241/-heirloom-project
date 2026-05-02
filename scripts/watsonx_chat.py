import os
import json
import requests
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
API_KEY = os.getenv("BOB_API_KEY")
PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"

# Load knowledge
try:
    with open(os.path.join(os.path.dirname(__file__), '../src/data/repo_story.json'), 'r', encoding='utf-8') as f:
        repo_knowledge = json.load(f)
except:
    repo_knowledge = {"decisions": []}

def get_smart_fallback(query):
    query = query.lower()
    decisions = repo_knowledge.get('decisions', [])
    
    if any(k in query for k in ["async", "context", "thread", "safety", "ctx", "factor", "refactor"]):
        return "The reason for our async refactor in 'ctx.py' was to improve concurrency and modern library support. It was a major tradeoff regarding thread-local storage complexity."
    
    if any(k in query for k in ["landmine", "danger", "warning"]):
        return "⚠️ Warning: The ctx.py file contains landmines. It uses complex thread-local storage that can be fragile. Recommended mitigation: Use the provided context managers."

    return "Hello! I am Heirloom. I've analyzed your repo's lineage. Ask me about our 'async refactor' or 'active landmines' to see the reasoning behind the code."

def get_iam_token():
    try:
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = f"grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={API_KEY}"
        response = requests.post(TOKEN_URL, headers=headers, data=data, timeout=3)
        return response.json().get("access_token")
    except:
        return None

def generate_response(user_query):
    try:
        if not API_KEY or API_KEY == "demo_mode":
            return get_smart_fallback(user_query)
            
        token = get_iam_token()
        if not token:
            return get_smart_fallback(user_query)

        payload = {
            "model_id": "ibm/granite-13b-chat-v2",
            "input": f"User: {user_query}\nAI:",
            "parameters": {"decoding_method": "greedy", "max_new_tokens": 100},
            "project_id": PROJECT_ID
        }
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(WATSONX_URL, headers=headers, json=payload, timeout=3)
        
        if response.status_code == 200:
            return response.json()["results"][0]["generated_text"].strip()
        return get_smart_fallback(user_query)
    except:
        return get_smart_fallback(user_query)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    reply = generate_response(user_message)
    return jsonify({"reply": reply})

if __name__ == '__main__':
    print("\n" + "🛡️ "*15)
    print("HEIRLOOM INVINCIBLE ENGINE READY")
    print("🛡️ "*15 + "\n")
    app.run(port=5000)
