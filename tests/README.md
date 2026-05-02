# Test Suite Documentation

This directory contains comprehensive test coverage for the Heirloom Project, including both frontend (React) and backend (Python) tests.

## 📁 Structure

```
tests/
├── setup.js                      # Vitest test setup and global mocks
├── components/
│   └── WhyChat.test.jsx         # React component tests
├── test_watsonx_chat.py         # Python backend unit tests
└── README.md                     # This file
```

## 🧪 Frontend Tests (Vitest + React Testing Library)

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Frontend Test Coverage

The [`WhyChat.test.jsx`](components/WhyChat.test.jsx) file includes:

- ✅ Component rendering tests
- ✅ User interaction tests (typing, clicking, keyboard events)
- ✅ API integration tests (success and failure scenarios)
- ✅ Fallback behavior tests
- ✅ Citation display tests
- ✅ Loading state tests
- ✅ Input validation tests

### Key Testing Patterns

```javascript
// Example: Testing user interactions
it('sends message when Enter key is pressed', async () => {
  const user = userEvent.setup();
  render(<WhyChat />);
  
  const input = screen.getByPlaceholderText(/Ask why a decision was made/i);
  await user.type(input, 'Test message{Enter}');
  
  expect(screen.getByText('Test message')).toBeInTheDocument();
});
```

## 🐍 Backend Tests (Pytest)

### Running Backend Tests

```bash
# Install test dependencies
pip install -r requirements-test.txt

# Run all Python tests
pytest

# Run with coverage
pytest --cov=scripts --cov-report=html

# Run specific test file
pytest tests/test_watsonx_chat.py -v

# Run specific test class
pytest tests/test_watsonx_chat.py::TestSmartFallback -v
```

### Backend Test Coverage

The [`test_watsonx_chat.py`](test_watsonx_chat.py) file includes:

- ✅ Smart fallback logic tests
- ✅ IAM token retrieval tests
- ✅ WatsonX API integration tests
- ✅ Flask endpoint tests
- ✅ Error handling tests
- ✅ CORS configuration tests
- ✅ Knowledge base loading tests

### Test Classes

1. **TestSmartFallback**: Tests the intelligent fallback responses
2. **TestIAMToken**: Tests IBM Cloud authentication
3. **TestGenerateResponse**: Tests response generation logic
4. **TestFlaskEndpoints**: Tests REST API endpoints
5. **TestKnowledgeLoading**: Tests knowledge base initialization

## 🚀 CI/CD Integration

Tests are automatically run on every push and pull request via GitHub Actions:

### Workflow Jobs

1. **frontend-test**: Runs Vitest tests and generates coverage
2. **backend-test**: Runs Pytest tests and generates coverage
3. **security-scan**: Runs npm audit and Python safety checks
4. **deploy**: Deploys to Vercel on successful tests (main branch)
5. **deploy-preview**: Creates preview deployments for PRs

### Required Secrets

Configure these in your GitHub repository settings:

- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## 📊 Coverage Reports

### Frontend Coverage

After running `npm run test:coverage`, view the report:

```bash
# Open coverage report in browser
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

### Backend Coverage

After running `pytest --cov`, view the report:

```bash
# Open coverage report in browser
open htmlcov/index.html  # macOS
start htmlcov/index.html # Windows
xdg-open htmlcov/index.html # Linux
```

## 🎯 Coverage Goals

- **Frontend**: Target 80%+ coverage
- **Backend**: Target 85%+ coverage
- **Critical paths**: 100% coverage required

## 🔧 Writing New Tests

### Frontend Test Template

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from '../../src/components/YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Backend Test Template

```python
import unittest
from unittest.mock import patch, MagicMock

class TestYourFeature(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        pass
    
    def test_your_function(self):
        """Test description"""
        result = your_function()
        self.assertEqual(result, expected_value)
```

## 🐛 Debugging Tests

### Frontend Debugging

```javascript
// Add debug output
import { render, screen, debug } from '@testing-library/react';

it('debug test', () => {
  const { debug } = render(<Component />);
  debug(); // Prints DOM to console
});
```

### Backend Debugging

```bash
# Run with verbose output
pytest -vv

# Run with print statements visible
pytest -s

# Run specific test with debugging
pytest tests/test_watsonx_chat.py::TestClass::test_method -vv -s
```

## 📚 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Use descriptive test names
3. **Arrange-Act-Assert**: Follow AAA pattern
4. **Mock External Dependencies**: Don't make real API calls
5. **Test Edge Cases**: Include error scenarios
6. **Keep Tests Fast**: Mock slow operations
7. **Maintain Tests**: Update tests with code changes

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Pytest Documentation](https://docs.pytest.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure all tests pass locally
3. Maintain or improve coverage percentage
4. Update this README if adding new test patterns

---

**Made with Bob** 🛡️