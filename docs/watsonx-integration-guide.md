# Watsonx AI Integration Guide

## Overview

The `scripts/watsonx_chat.py` script integrates IBM Watsonx AI to power the intelligent chat feature in the Heirloom project. It replaces hardcoded responses with real AI-powered conversations about Flask framework decisions and institutional memory.

## Features

✅ **Environment-based Configuration**: Loads credentials from `.env` file  
✅ **Context-Aware AI**: Reads Flask decision history from `repo_story.json`  
✅ **Institutional Memory Assistant**: AI acts as expert on project decisions  
✅ **CLI Interface**: Test queries from command line  
✅ **Importable Module**: Use in Python applications and APIs  
✅ **Error Handling**: Comprehensive validation and error messages  
✅ **Multiple Modes**: Single query, interactive chat, or JSON output  

## Installation

### 1. Install Dependencies

```bash
pip install -r requirements-watsonx.txt
```

This installs:
- `ibm-watson-machine-learning` (>=1.0.335) - IBM Watsonx SDK
- `python-dotenv` (>=1.0.0) - Environment variable management

### 2. Configure Credentials

Copy `.env.template` to `.env` and add your Watsonx credentials:

```bash
cp .env.template .env
```

Edit `.env` and set:

```env
WATSONX_API_KEY=your_actual_api_key_here
WATSONX_PROJECT_ID=your_actual_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**How to get credentials:**

1. Log in to [IBM Cloud](https://cloud.ibm.com)
2. Navigate to your Watsonx.ai project
3. Go to **Project Settings > Manage > Access & credentials**
4. Copy your API key from IBM Cloud API Keys section
5. Copy your Project ID from project details
6. Set URL based on your region:
   - US South: `https://us-south.ml.cloud.ibm.com`
   - EU Germany: `https://eu-de.ml.cloud.ibm.com`
   - Japan Tokyo: `https://jp-tok.ml.cloud.ibm.com`

### 3. Verify Installation

```bash
python scripts/watsonx_chat.py --help
```

## Usage

### CLI Mode

#### Single Query

Ask a question and get an AI response:

```bash
python scripts/watsonx_chat.py "Why did we choose Flask?"
```

```bash
python scripts/watsonx_chat.py "What are the async support decisions?"
```

```bash
python scripts/watsonx_chat.py "Tell me about the JSONEncoder deprecation"
```

#### Interactive Mode

Start a conversation with the AI:

```bash
python scripts/watsonx_chat.py --interactive
```

Type your questions and get responses. Type `exit`, `quit`, or `q` to end.

#### Context Information

View loaded context statistics:

```bash
python scripts/watsonx_chat.py --context-info
```

Output:
```
Context Information:
  Repository: pallets/flask
  Decisions: 5
  Contributors: 4
  Landmines: 3
  Generated: 2026-05-02T00:41:02.030950
  Context File: c:/path/to/src/data/repo_story.json
```

#### JSON Output

Get structured JSON response for API integration:

```bash
python scripts/watsonx_chat.py --json "Why Flask?"
```

Output:
```json
{
  "success": true,
  "response": "Flask was chosen because...",
  "error": null,
  "metadata": {
    "model": "ibm/granite-13b-chat-v2",
    "context_decisions": 5,
    "prompt_length": 2847
  }
}
```

### Python Module Usage

#### Basic Usage

```python
from scripts.watsonx_chat import chat_with_watsonx

# Ask a question
result = chat_with_watsonx("Why did we refactor the application context?")

if result['success']:
    print(result['response'])
else:
    print(f"Error: {result['error']}")
```

#### Advanced Usage

```python
from scripts.watsonx_chat import WatsonxChat

# Initialize with custom paths
chat = WatsonxChat(
    env_path=".env.production",
    context_path="custom/path/to/repo_story.json"
)

# Get context summary
info = chat.get_context_summary()
print(f"Loaded {info['total_decisions']} decisions")

# Send multiple queries
questions = [
    "Why did we add type hints?",
    "What are the async view support decisions?",
    "Tell me about template auto-escaping"
]

for question in questions:
    result = chat.chat(question)
    if result['success']:
        print(f"Q: {question}")
        print(f"A: {result['response']}\n")
```

#### API Integration Example

```python
from flask import Flask, request, jsonify
from scripts.watsonx_chat import initialize_chat

app = Flask(__name__)

# Initialize once at startup
chat = initialize_chat()

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    message = data.get('message', '')
    
    if not message:
        return jsonify({'error': 'Message required'}), 400
    
    result = chat.chat(message)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
```

## System Prompt Design

The AI is configured as an **Institutional Memory Assistant** with:

### Role & Expertise
- Expert on Flask framework decisions
- Deep knowledge of technical architecture
- Historical context of code changes
- Understanding of trade-offs and alternatives
- Awareness of key contributors and their expertise
- Knowledge of known issues and landmines

### Context Provided
- Repository information (name, description, stats)
- Key decisions with rationale and metadata
- Contributors and their expertise areas
- Known landmines and gotchas
- File changes and PR references

### Response Style
- Direct and technical
- Specific examples from decision history
- References to PR numbers, files, contributors
- Explains both "what" and "why"
- Focused and actionable
- Uses bullet points for clarity
- Admits when lacking information

## Model Configuration

**Model**: `ibm/granite-13b-chat-v2`

**Parameters**:
- Decoding Method: Greedy
- Max New Tokens: 500
- Min New Tokens: 50
- Temperature: 0.7
- Top K: 50
- Top P: 0.9
- Repetition Penalty: 1.1

These parameters are optimized for:
- Consistent, deterministic responses
- Technical accuracy
- Appropriate response length
- Natural conversation flow

## Error Handling

The script handles various error scenarios:

### Missing Credentials
```
Error: WATSONX_API_KEY not found or not configured in .env file.
Please set a valid API key.
```

**Solution**: Configure `.env` with valid credentials

### Missing SDK
```
Warning: ibm-watson-machine-learning not installed.
Install with: pip install ibm-watson-machine-learning
```

**Solution**: Run `pip install -r requirements-watsonx.txt`

### Missing Context File
```
Error: Context file not found: src/data/repo_story.json.
Please ensure repo_story.json exists.
```

**Solution**: Ensure `src/data/repo_story.json` exists or specify custom path

### API Failures
```json
{
  "success": false,
  "response": null,
  "error": "Watsonx API error: Connection timeout",
  "metadata": {
    "error_type": "ConnectionError"
  }
}
```

**Solution**: Check network connection, API key validity, and service status

## Integration with WhyChat Component

To integrate with the React frontend:

### 1. Create Backend API Endpoint

```python
# backend/api.py
from flask import Flask, request, jsonify
from scripts.watsonx_chat import initialize_chat

app = Flask(__name__)
chat = initialize_chat()

@app.route('/api/why-chat', methods=['POST'])
def why_chat():
    data = request.json
    message = data.get('message', '')
    
    result = chat.chat(message)
    return jsonify(result)
```

### 2. Update WhyChat.jsx

```javascript
// src/components/WhyChat.jsx
const sendMessage = async (message) => {
  try {
    const response = await fetch('/api/why-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const result = await response.json();
    
    if (result.success) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: result.response,
        timestamp: new Date()
      }]);
    } else {
      console.error('AI Error:', result.error);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};
```

## Testing

### Unit Tests

```python
# tests/test_watsonx_chat.py
import pytest
from scripts.watsonx_chat import WatsonxChat, WatsonxChatError

def test_missing_credentials():
    with pytest.raises(WatsonxChatError):
        chat = WatsonxChat(env_path=".env.test.empty")

def test_context_loading():
    chat = WatsonxChat()
    info = chat.get_context_summary()
    assert info['total_decisions'] > 0
    assert info['repository'] == 'pallets/flask'
```

### Manual Testing

```bash
# Test help
python scripts/watsonx_chat.py --help

# Test context info
python scripts/watsonx_chat.py --context-info

# Test single query
python scripts/watsonx_chat.py "Why Flask?"

# Test interactive mode
python scripts/watsonx_chat.py --interactive

# Test JSON output
python scripts/watsonx_chat.py --json "Why Flask?"
```

## Troubleshooting

### Issue: "Import could not be resolved"

**Cause**: SDK not installed  
**Solution**: `pip install ibm-watson-machine-learning`

### Issue: "WATSONX_API_KEY not found"

**Cause**: `.env` file missing or not configured  
**Solution**: Copy `.env.template` to `.env` and add credentials

### Issue: "Context file not found"

**Cause**: `repo_story.json` missing  
**Solution**: Ensure file exists at `src/data/repo_story.json`

### Issue: API timeout or connection errors

**Cause**: Network issues or invalid credentials  
**Solution**: 
- Check internet connection
- Verify API key is valid
- Check IBM Cloud service status
- Verify project ID is correct

## Best Practices

1. **Security**: Never commit `.env` file with real credentials
2. **Error Handling**: Always check `result['success']` before using response
3. **Rate Limiting**: Implement rate limiting for production APIs
4. **Caching**: Consider caching common queries to reduce API calls
5. **Monitoring**: Log API usage and errors for debugging
6. **Context Updates**: Regenerate `repo_story.json` when decisions change

## Performance Considerations

- **Token Limits**: System prompt uses ~2000 tokens, leaving ~500 for response
- **Context Size**: Limited to 10 decisions to avoid token overflow
- **Response Time**: Typical response time is 2-5 seconds
- **Concurrent Requests**: Model supports concurrent requests but may have rate limits

## Future Enhancements

- [ ] Add conversation history/memory
- [ ] Support multiple AI models
- [ ] Implement response streaming
- [ ] Add semantic search over decisions
- [ ] Cache frequent queries
- [ ] Add user feedback mechanism
- [ ] Support multi-turn conversations
- [ ] Add decision recommendation engine

## Support

For issues or questions:
- Check this documentation
- Review error messages carefully
- Verify credentials and configuration
- Check IBM Cloud service status
- Review Watsonx API documentation

## License

MIT License - See project LICENSE file for details.