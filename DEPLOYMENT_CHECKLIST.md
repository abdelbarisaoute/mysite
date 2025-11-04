# Deployment Checklist

Use this checklist to ensure your personal academic website is properly deployed and secured.

## Initial Setup ✅

### GitHub Repository Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] Repository is public (required for GitHub Pages on free tier)

### GitHub Pages Configuration
- [ ] Go to repository **Settings** → **Pages**
- [ ] Set **Source** to "GitHub Actions"
- [ ] Note your site URL: `https://[username].github.io/[repo-name]/`

### Base Path Configuration
- [ ] Open `vite.config.ts`
- [ ] Verify `base` is set to `'/[your-repo-name]/'`
- [ ] Commit and push if changed

## Security Configuration 🔒

### Change Default Admin Password (CRITICAL!)
- [ ] Go to repository **Settings** → **Secrets and variables** → **Actions**
- [ ] Click **"New repository secret"**
- [ ] Name: `VITE_ADMIN_PASSWORD`
- [ ] Value: Your secure password (at least 12 characters)
- [ ] Click **"Add secret"**

### Set Up GitHub Token for Auto-Save (Optional but Recommended)
- [ ] Go to [GitHub Settings → Tokens (classic)](https://github.com/settings/tokens)
- [ ] Click **"Generate new token (classic)"**
- [ ] Name: "Article Auto-Save for [your-site]"
- [ ] Expiration: 90 days (recommended)
- [ ] Check the `repo` scope
- [ ] Click **"Generate token"**
- [ ] **COPY THE TOKEN** (you won't see it again!)
- [ ] Go to repository **Settings** → **Secrets and variables** → **Actions**
- [ ] Add new secret:
  - Name: `VITE_GITHUB_TOKEN`
  - Value: Your token
- [ ] Click **"Add secret"**

### Verify Workflow Configuration
- [ ] Open `.github/workflows/deploy.yml`
- [ ] Verify the build step includes:
  ```yaml
  env:
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
    VITE_ADMIN_PASSWORD: ${{ secrets.VITE_ADMIN_PASSWORD }}
    VITE_GITHUB_OWNER: ${{ github.repository_owner }}
    VITE_GITHUB_REPO: ${{ github.event.repository.name }}
  ```
- [ ] Commit and push if modified

## First Deployment 🚀

### Trigger Deployment
- [ ] Push a commit to the `main` branch
- [ ] Go to **Actions** tab in your repository
- [ ] Watch "Deploy to GitHub Pages" workflow
- [ ] Wait for workflow to complete (2-3 minutes)
- [ ] Check for any errors (red ❌) or success (green ✅)

### Verify Deployment
- [ ] Visit your site: `https://[username].github.io/[repo-name]/`
- [ ] Check that home page loads
- [ ] Navigate to "Contents" page
- [ ] Check "Resume" page
- [ ] Test dark mode toggle
- [ ] Try search functionality

### Test Admin Access
- [ ] Visit: `https://[username].github.io/[repo-name]/#/admin`
- [ ] Log in with your password
- [ ] Verify dashboard loads
- [ ] Click "New Article" button
- [ ] Create a test article (use any content)
- [ ] Submit the article
- [ ] Check for success message
- [ ] Go to repository and verify article was committed
- [ ] Wait 2-3 minutes for redeployment
- [ ] Refresh site and check article appears

## Post-Deployment 🎉

### Personalize Your Site
- [ ] Update `pages/HomePage.tsx` with your information
- [ ] Update `pages/ResumePage.tsx` with your resume
- [ ] Update site title in `index.html`
- [ ] Update header in `components/Header.tsx`
- [ ] Update footer in `App.tsx`
- [ ] Commit and push changes

### Add Content
- [ ] Create your first real article via admin dashboard
- [ ] Add profile picture to `public/` folder
- [ ] Update metadata.json with your information
- [ ] Test all pages and links

### Share Your Site
- [ ] Add site URL to repository description
- [ ] Share link on social media
- [ ] Add to LinkedIn profile
- [ ] Add to email signature

## Maintenance 🛠️

### Regular Tasks
- [ ] **Every 90 days**: Regenerate GitHub token (if it expires)
- [ ] **Monthly**: Update npm dependencies (`npm update`)
- [ ] **Monthly**: Check GitHub Actions logs for issues
- [ ] **As needed**: Review and respond to security alerts
- [ ] **As needed**: Update articles and content

### Security Review
- [ ] Change admin password every 3-6 months
- [ ] Review repository access and collaborators
- [ ] Check GitHub Actions usage (Settings → Billing)
- [ ] Review commit history for unauthorized changes
- [ ] Enable 2FA on GitHub account (if not already)

## Troubleshooting 🔧

### Deployment Failed
- [ ] Check Actions tab for error messages
- [ ] Verify `npm run build` works locally
- [ ] Check all dependencies are in `package.json`
- [ ] Ensure `package-lock.json` is committed
- [ ] Review workflow file for syntax errors

### Can't Access Admin
- [ ] Verify URL uses hash router: `/#/admin`
- [ ] Clear browser cache and try again
- [ ] Check browser console for errors (F12)
- [ ] Verify password was set correctly in secrets
- [ ] Try resetting: `localStorage.removeItem('isAdminAuthenticated')`

### Articles Not Saving to GitHub
- [ ] Verify `VITE_GITHUB_TOKEN` secret is set
- [ ] Check token hasn't expired
- [ ] Verify token has `repo` scope
- [ ] Check workflow includes token in env
- [ ] Review browser console for API errors
- [ ] Try manual download as fallback

### Site Not Loading
- [ ] Wait 10 minutes for DNS propagation
- [ ] Check GitHub Pages is enabled
- [ ] Verify deployment workflow succeeded
- [ ] Check base path in `vite.config.ts`
- [ ] Verify `.nojekyll` file exists in dist

## Resources 📚

For detailed instructions on any of these steps, see:
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Complete admin dashboard guide
- **[README.md](README.md)** - Project overview and setup
- **GitHub Actions Logs** - Detailed deployment logs
- **Browser Console (F12)** - Client-side error messages

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check git status
git status

# Commit changes
git add .
git commit -m "Your message"
git push origin main
```

---

**🎉 Congratulations!** Once you've completed this checklist, your personal academic website should be fully deployed and ready to use!

**📝 Keep this checklist** for future reference and maintenance tasks.
