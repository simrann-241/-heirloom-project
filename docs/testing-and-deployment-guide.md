# Testing & Deployment Guide

Complete guide for running tests and deploying the Heirloom Project.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing Setup](#local-testing-setup)
3. [Running Tests](#running-tests)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Deployment to Vercel](#deployment-to-vercel)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v20 or higher
- **Python**: 3.11 or higher
- **npm**: v10 or higher
- **Git**: Latest version

### Required Accounts

- GitHub account (for CI/CD)
- Vercel account (for deployment)

---

## Local Testing Setup

### 1. Install Frontend Dependencies

```bash
# Install all npm packages including test dependencies
npm install
```

This installs:
- `vitest` - Fast unit test framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/user-event` - User interaction simulation
- `@testing-library/jest-dom` - Custom Jest matchers
- `jsdom` - DOM implementation for Node.js

### 2. Install Backend Dependencies

```bash
# Install Python test dependencies
pip install -r requirements-test.txt
```

This installs:
- `pytest` - Python testing framework
- `pytest-cov` - Coverage plugin
- `pytest-mock` - Mocking utilities
- `Flask` and `flask-cors` - Web framework
- `requests-mock` - HTTP request mocking

---

## Running Tests

### Frontend Tests (Vitest)

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/components/WhyChat.test.jsx
```

**Expected Output:**
```
✓ tests/components/WhyChat.test.jsx (13)
  ✓ WhyChat Component (13)
    ✓ renders the component with initial greeting message
    ✓ displays the Why-Chat header
    ✓ allows user to type in the input field
    ... (10 more tests)

Test Files  1 passed (1)
Tests  13 passed (13)
```

### Backend Tests (Pytest)

```bash
# Run all Python tests
pytest

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=scripts --cov-report=html

# Run specific test file
pytest tests/test_watsonx_chat.py

# Run specific test class
pytest tests/test_watsonx_chat.py::TestSmartFallback

# Run specific test method
pytest tests/test_watsonx_chat.py::TestSmartFallback::test_async_query_returns_async_response
```

**Expected Output:**
```
tests/test_watsonx_chat.py::TestSmartFallback::test_async_query_returns_async_response PASSED
tests/test_watsonx_chat.py::TestSmartFallback::test_landmine_query_returns_warning PASSED
... (more tests)

========== 25 passed in 2.34s ==========
```

### View Coverage Reports

**Frontend Coverage:**
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

**Backend Coverage:**
```bash
pytest --cov=scripts --cov-report=html
# Open htmlcov/index.html in browser
```

---

## CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment.

### Workflow Overview

The pipeline runs on:
- Every push to `main` or `develop` branches
- Every pull request to `main` or `develop` branches

### Pipeline Jobs

#### 1. Frontend Test Job
- Installs Node.js dependencies
- Runs ESLint
- Executes Vitest tests
- Generates coverage report
- Uploads coverage to Codecov
- Builds production bundle
- Uploads build artifacts

#### 2. Backend Test Job
- Installs Python dependencies
- Runs Pytest tests
- Generates coverage report
- Uploads coverage to Codecov
- Uploads test results

#### 3. Security Scan Job
- Runs `npm audit` for frontend vulnerabilities
- Runs `safety check` for Python vulnerabilities

#### 4. Deploy Job (Main Branch Only)
- Downloads build artifacts
- Deploys to Vercel production
- Comments deployment URL on commit

#### 5. Deploy Preview Job (Pull Requests)
- Builds fresh bundle
- Deploys to Vercel preview environment
- Comments preview URL on PR

### Workflow File

Location: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

---

## Deployment to Vercel

### Initial Setup

#### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

#### 2. Link Project to Vercel

```bash
vercel link
```

Follow the prompts to:
- Select your Vercel account
- Link to existing project or create new one
- Confirm project settings

#### 3. Get Vercel Credentials

```bash
# Get your Vercel token
vercel whoami

# Get project details
vercel project ls
```

### Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Add the following secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | [Vercel Account Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Run `vercel project ls` or check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Run `vercel project ls` or check `.vercel/project.json` |

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Automatic Deployment

Once GitHub secrets are configured:

1. **Push to main branch** → Automatic production deployment
2. **Create pull request** → Automatic preview deployment
3. **Merge PR** → Automatic production deployment

### Deployment Configuration

The [`vercel.json`](../vercel.json) file configures:
- Build command: `npm run build`
- Output directory: `dist`
- Security headers
- Cache policies
- SPA routing

---

## Troubleshooting

### Frontend Test Issues

**Problem: Tests fail with "Cannot find module"**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: Tests timeout**
```bash
# Solution: Increase timeout in test
it('test name', async () => {
  // ...
}, { timeout: 10000 }); // 10 seconds
```

**Problem: Mock not working**
```bash
# Solution: Ensure mock is defined before import
vi.mock('../../src/utils/dataLoader', () => ({
  getDecisions: vi.fn(() => [])
}));
```

### Backend Test Issues

**Problem: Import errors**
```bash
# Solution: Ensure PYTHONPATH includes project root
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest
```

**Problem: Flask app not found**
```bash
# Solution: Check sys.path in test file
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))
```

### CI/CD Issues

**Problem: GitHub Actions failing**
- Check workflow logs in GitHub Actions tab
- Verify all secrets are configured correctly
- Ensure branch protection rules allow workflow runs

**Problem: Vercel deployment failing**
- Verify `VERCEL_TOKEN` is valid
- Check `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
- Ensure build command succeeds locally

**Problem: Coverage upload failing**
- This is non-critical (set to `fail_ci_if_error: false`)
- Check Codecov token if needed
- Verify coverage files are generated

### Common Solutions

```bash
# Clear all caches
npm run clean  # If script exists
rm -rf node_modules dist coverage .pytest_cache htmlcov
npm install

# Reset Git state
git clean -fdx
git reset --hard

# Verify environment
node --version  # Should be v20+
python --version  # Should be 3.11+
npm --version  # Should be v10+
```

---

## Best Practices

### Before Committing

```bash
# Run all checks locally
npm run lint
npm test
pytest
npm run build
```

### Writing Tests

1. **Test user behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests isolated and independent**
4. **Mock external dependencies**
5. **Test edge cases and error scenarios**

### Deployment Checklist

- [ ] All tests pass locally
- [ ] Coverage meets thresholds (80%+ frontend, 85%+ backend)
- [ ] No linting errors
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] GitHub secrets set up
- [ ] Vercel project linked

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Pytest Documentation](https://docs.pytest.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Test Suite README](../tests/README.md)

---

## Support

For issues or questions:
1. Check this guide and the [Test Suite README](../tests/README.md)
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Review test output for specific errors

---

**Made with Bob** 🛡️