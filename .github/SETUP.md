# GitHub Actions & Vercel Setup Guide

Quick reference for configuring CI/CD pipeline.

## 🔐 Required GitHub Secrets

Navigate to: `Repository Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 1. VERCEL_TOKEN

**How to get:**
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it (e.g., "GitHub Actions")
4. Copy the token
5. Add to GitHub as `VERCEL_TOKEN`

### 2. VERCEL_ORG_ID

**How to get:**
```bash
# Method 1: From Vercel CLI
vercel link
# Check .vercel/project.json

# Method 2: From Vercel Dashboard
# Go to Settings → General → Organization ID
```

Add to GitHub as `VERCEL_ORG_ID`

### 3. VERCEL_PROJECT_ID

**How to get:**
```bash
# Method 1: From Vercel CLI
vercel link
# Check .vercel/project.json

# Method 2: From Vercel Dashboard
# Go to Project Settings → General → Project ID
```

Add to GitHub as `VERCEL_PROJECT_ID`

## 🚀 Quick Setup Commands

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project
vercel link

# 4. Get project info
cat .vercel/project.json
```

## ✅ Verification

After adding secrets, push to main branch:

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

Check GitHub Actions tab to see workflow running.

## 📋 Checklist

- [ ] Vercel account created
- [ ] Project deployed to Vercel (at least once manually)
- [ ] `VERCEL_TOKEN` added to GitHub secrets
- [ ] `VERCEL_ORG_ID` added to GitHub secrets
- [ ] `VERCEL_PROJECT_ID` added to GitHub secrets
- [ ] Workflow file exists at `.github/workflows/deploy.yml`
- [ ] First push triggers workflow successfully

## 🔧 Troubleshooting

**Workflow not running?**
- Check branch protection rules
- Verify workflow file syntax
- Check Actions are enabled in repository settings

**Deployment failing?**
- Verify all three secrets are correct
- Check Vercel project exists
- Ensure build succeeds locally (`npm run build`)

**Tests failing?**
- Run tests locally first
- Check test dependencies are installed
- Review test output in Actions logs

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Full Testing Guide](../docs/testing-and-deployment-guide.md)