# Admin Dashboard - Step-by-Step Guide

This guide provides detailed instructions for accessing and using the admin dashboard to manage your personal academic website.

## Table of Contents
1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [First-Time Setup](#first-time-setup)
3. [Managing Articles](#managing-articles)
4. [GitHub Automation Setup](#github-automation-setup)
5. [Security Best Practices](#security-best-practices)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## Accessing the Admin Dashboard

### Step 1: Navigate to the Admin Login Page

Once your site is deployed, you can access the admin panel in two ways:

**For GitHub Pages Deployment:**
- Visit: `https://[your-username].github.io/[repository-name]/#/admin`
- Example: `https://abdelbarisaoute.github.io/mysite/#/admin`

**For Local Development:**
- Start the development server: `npm run dev`
- Visit: `http://localhost:3000/#/admin`

### Step 2: Log In

1. On the admin login page, you'll see a password input field
2. Enter the admin password
   - **Default password**: `admin` (if not configured)
   - **Custom password**: If you've set `VITE_ADMIN_PASSWORD` environment variable
3. Click the **"Login"** button
4. Upon successful authentication, you'll be redirected to the admin dashboard

### Step 3: Using the Dashboard

After logging in, you'll see:
- **Header**: Shows "Admin Dashboard" and a "Logout" button
- **Create/Edit Form**: Form for creating new articles or editing existing ones
- **Existing Articles List**: All your published articles with Edit/Delete options
- **Setup Instructions**: Quick reference for GitHub automation

---

## First-Time Setup

### Prerequisites
- Node.js v16 or higher installed
- Git installed
- A GitHub account
- Your repository cloned locally

### Local Development Setup

1. **Clone your repository**:
   ```bash
   git clone https://github.com/[your-username]/[repository-name].git
   cd [repository-name]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (edit `.env`):
   ```
   VITE_ADMIN_PASSWORD=your_secure_password_here
   VITE_GITHUB_TOKEN=your_github_token_here
   VITE_GITHUB_OWNER=your_github_username
   VITE_GITHUB_REPO=your_repository_name
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Access the site**:
   - Open your browser to `http://localhost:3000`
   - Navigate to `http://localhost:3000/#/admin` to access admin panel

---

## Managing Articles

### Creating a New Article

1. **Access the Dashboard**: Log in to the admin panel
2. **Click "New Article"** button in the dashboard
3. **Fill in the form**:
   - **Title** (required): Your article title
   - **Date** (optional): Publication date (defaults to today if empty)
   - **Summary** (required): Brief description of the article
   - **Content** (required): Full article content
     - Supports Markdown formatting
     - Supports LaTeX equations (use `$equation$` for inline, `$$equation$$` for block)
4. **Submit**:
   - Click **"Create Article"**
   - If GitHub automation is set up, the article will be automatically committed
   - If not configured, a file will be downloaded for manual upload

### Editing an Existing Article

1. **Find the article** in the "Existing Articles" section
2. **Click "Edit"** button next to the article
3. **Modify the fields** as needed
4. **Click "Update Article"** to save changes
5. **Click "Cancel"** to discard changes

### Deleting an Article

1. **Find the article** in the "Existing Articles" section
2. **Click "Delete"** button next to the article
3. **Confirm the deletion** in the popup dialog
4. The article will be removed from the repository (if GitHub automation is configured)

### Article Content Formatting

**Markdown Support:**
- Headings: `# H1`, `## H2`, `### H3`
- Bold: `**bold text**`
- Italic: `*italic text*`
- Links: `[text](url)`
- Lists: Use `-` or `1.` for bullets/numbers
- Code blocks: Use triple backticks \`\`\`

**LaTeX Math Support:**
- Inline equations: `$E = mc^2$`
- Block equations: 
  ```
  $$
  \frac{d}{dx}(x^2) = 2x
  $$
  ```

---

## GitHub Automation Setup

This section enables automatic article uploads directly from the admin panel to your GitHub repository.

### Why Set This Up?

- ✅ Automatically commit new/updated articles to GitHub
- ✅ No need to manually download and upload files
- ✅ Triggers automatic redeployment via GitHub Actions
- ✅ Streamlined content management workflow

### Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Configure the token:
   - **Name**: "Article Auto-Save for [your-site]"
   - **Expiration**: 90 days (recommended) or custom
   - **Scopes**: Check the `repo` scope (full control of repositories)
4. Click **"Generate token"**
5. **⚠️ IMPORTANT**: Copy the token immediately (you won't see it again!)

### Step 2: Add Token as a Repository Secret

1. Go to your repository on GitHub: `https://github.com/[username]/[repository-name]`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Configure the secret:
   - **Name**: `VITE_GITHUB_TOKEN`
   - **Value**: Paste your personal access token
5. Click **"Add secret"**

### Step 3: Verify Deployment Workflow

1. Open `.github/workflows/deploy.yml` in your repository
2. Verify the build step includes:
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
   ```
3. If not present, add the `env` section to the build step
4. Commit and push the changes

### Step 4: Test the Setup

1. Push any change to the `main` branch to trigger deployment
2. Wait for GitHub Actions workflow to complete (check the Actions tab)
3. Visit your deployed site
4. Log in to the admin dashboard
5. Create a test article
6. Check your repository - you should see a new commit with the article

### Optional: Configure for Local Development

1. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials:
   ```
   VITE_GITHUB_TOKEN=ghp_your_token_here
   VITE_ADMIN_PASSWORD=your_secure_password
   VITE_GITHUB_OWNER=your_github_username
   VITE_GITHUB_REPO=your_repo_name
   ```

3. **⚠️ NEVER commit `.env` to version control** (already in `.gitignore`)

---

## Security Best Practices

### Change the Default Admin Password

**For Production (GitHub Pages):**

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add a new secret:
   - **Name**: `VITE_ADMIN_PASSWORD`
   - **Value**: Your secure password (use a strong password!)
3. Update `.github/workflows/deploy.yml`:
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
       VITE_ADMIN_PASSWORD: ${{ secrets.VITE_ADMIN_PASSWORD }}
   ```
4. Push changes to trigger redeployment

**For Local Development:**

1. Edit `.env` file:
   ```
   VITE_ADMIN_PASSWORD=your_secure_password
   ```
2. Restart the development server

### Password Guidelines

- Use at least 12 characters
- Include uppercase, lowercase, numbers, and symbols
- Don't use common words or patterns
- Don't share your password
- Change it periodically (every 90 days recommended)

### Token Security

- **Never** commit tokens to your repository
- Set token expiration dates (90 days recommended)
- Use repository secrets for production
- Regenerate tokens if compromised
- Use minimal required scopes (`repo` only)

### Additional Security Measures

1. **Enable Two-Factor Authentication** on your GitHub account
2. **Review token usage** regularly in GitHub settings
3. **Revoke old tokens** that are no longer needed
4. **Monitor repository activity** for unauthorized changes
5. **Use branch protection rules** if working with a team

---

## Deployment Guide

### Initial Deployment to GitHub Pages

#### Prerequisites
- A GitHub account
- Your repository pushed to GitHub
- Admin access to your repository

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

#### Step 2: Configure Repository

1. Ensure your repository has the deployment workflow:
   - File: `.github/workflows/deploy.yml`
   - This should already exist in the repository

2. Update the base path in `vite.config.ts` (if needed):
   ```typescript
   base: '/your-repository-name/',
   ```

#### Step 3: Deploy

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Wait for it to complete (usually 2-3 minutes)

3. **Access your site**:
   - URL: `https://[your-username].github.io/[repository-name]/`
   - Example: `https://abdelbarisaoute.github.io/mysite/`

#### Step 4: Verify

1. Visit your deployed site
2. Navigate to all pages to ensure they work
3. Test the admin login at `/#/admin`
4. Create a test article to verify GitHub automation

### Updating Your Site

Every push to the `main` branch automatically triggers redeployment:

1. Make your changes locally
2. Test with `npm run dev`
3. Build and verify with `npm run build && npm run preview`
4. Commit and push:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
5. GitHub Actions will automatically rebuild and redeploy

### Manual Deployment Trigger

You can also manually trigger deployment:

1. Go to **Actions** tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click **"Run workflow"**
4. Select the branch to deploy (usually `main`)
5. Click **"Run workflow"** button

---

## Troubleshooting

### Cannot Access Admin Dashboard

**Problem**: 404 error when visiting `/admin`

**Solution**: 
- Ensure you're using the hash router URL: `/#/admin`
- For local development: `http://localhost:3000/#/admin`
- For GitHub Pages: `https://[username].github.io/[repo]/#/admin`

### Wrong Password

**Problem**: "Invalid password" error when logging in

**Solution**:
1. Check if you've set a custom password via `VITE_ADMIN_PASSWORD`
2. Default password is `admin` if not configured
3. For production, check repository secrets
4. For local development, check `.env` file

### GitHub Automation Not Working

**Problem**: "GitHub not configured" or "Failed to save to repository"

**Solutions**:
1. **Verify token is set**:
   - Check repository secrets for `VITE_GITHUB_TOKEN`
   - Ensure workflow includes token in build env

2. **Check token permissions**:
   - Token must have `repo` scope
   - Token must not be expired

3. **Verify repository info**:
   - Set `VITE_GITHUB_OWNER` and `VITE_GITHUB_REPO` if auto-detection fails

4. **Check browser console**:
   - Press F12 to open developer tools
   - Look for detailed error messages

### Articles Not Showing After Creation

**Problem**: Created article but it doesn't appear on the site

**Solution**:
1. **Wait for deployment**: Changes take 2-3 minutes to deploy
2. **Clear browser cache**: Hard refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. **Check repository**: Verify the article file was committed
4. **Check Actions tab**: Ensure deployment succeeded
5. **View build logs**: Look for errors in GitHub Actions

### Deployment Failures

**Problem**: GitHub Actions workflow fails

**Solutions**:
1. **Check workflow logs**:
   - Go to Actions tab
   - Click on the failed workflow
   - Review error messages

2. **Common issues**:
   - Missing dependencies: Run `npm install` and commit `package-lock.json`
   - Build errors: Test locally with `npm run build`
   - Permission issues: Check repository settings and token scopes

3. **Rebuild**:
   - Push a new commit to trigger redeployment
   - Or manually trigger workflow from Actions tab

### Site Not Loading After Deployment

**Problem**: Site shows 404 or blank page

**Solutions**:
1. **Check base path**: Ensure `vite.config.ts` has correct base path
2. **Wait for DNS**: Initial deployment may take up to 10 minutes
3. **Verify Pages settings**: Ensure GitHub Pages is enabled and using GitHub Actions
4. **Check .nojekyll file**: Workflow should create this (it should)

### Lost Admin Access

**Problem**: Can't remember password or locked out

**Solution**:
1. **For local development**:
   - Edit `.env` file and set new password
   - Restart development server

2. **For production**:
   - Update `VITE_ADMIN_PASSWORD` secret in repository settings
   - Push a change to trigger redeployment
   - Or update workflow and manually trigger deployment

3. **Reset authentication**:
   - Open browser developer tools (F12)
   - Go to Console tab
   - Run: `localStorage.removeItem('isAdminAuthenticated')`
   - Refresh the page

---

## Additional Resources

### Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for updates
npm outdated

# Update dependencies
npm update
```

### File Locations

- **Articles**: `data/articles/*.ts`
- **Configuration**: `vite.config.ts`, `.env`
- **Deployment**: `.github/workflows/deploy.yml`
- **Components**: `components/`, `pages/`
- **Authentication**: `context/AuthContext.tsx`

### Getting Help

1. **Check this guide**: Most common issues are covered here
2. **Review README.md**: Contains project overview and setup
3. **Check GitHub Issues**: Search for similar problems
4. **Browser Console**: Press F12 for detailed error messages
5. **GitHub Actions Logs**: Check workflow runs for deployment errors

### Best Practices

1. **Regular Backups**: Keep local copies of important articles
2. **Test Locally First**: Always test changes with `npm run dev` before deploying
3. **Use Version Control**: Commit frequently with descriptive messages
4. **Monitor Deployments**: Check Actions tab after pushing changes
5. **Update Dependencies**: Run `npm update` periodically for security patches
6. **Secure Your Tokens**: Never share or commit access tokens

---

## Quick Reference Card

| Task | Command/URL |
|------|-------------|
| Local admin access | `http://localhost:3000/#/admin` |
| Production admin access | `https://[user].github.io/[repo]/#/admin` |
| Default password | `admin` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Deploy to GitHub | Push to `main` branch |
| View deployment status | Actions tab on GitHub |
| Create GitHub token | [github.com/settings/tokens](https://github.com/settings/tokens) |
| Repository secrets | Settings → Secrets and variables → Actions |

---

**Need More Help?**

If you encounter issues not covered in this guide, please open an issue in the GitHub repository with:
- Detailed description of the problem
- Steps to reproduce
- Error messages (from console or logs)
- Your environment (browser, OS, Node.js version)
