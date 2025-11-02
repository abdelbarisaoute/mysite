<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1GyDBaew28VreWKAJ7Ynx9libPxEjqJBf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Optional) Copy `.env.local.example` to `.env.local` and set your `GEMINI_API_KEY` if needed
3. Run the app:
   `npm run dev`

## Content Editing

This website supports editing content directly from the web interface! See the [Content Editing Guide](CONTENT_EDITING_GUIDE.md) for detailed instructions on:
- Setting up GitHub integration for persistent changes
- Editing home page content, resume, and articles
- Creating new articles through the web interface

**Quick Start:**
1. Log in at `/admin` (password: `admin`)
2. Go to Settings to configure GitHub integration (optional but recommended)
3. Start editing content on any page with the "Edit" button

## Deployment

This website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Setup GitHub Pages (One-time setup)

To enable GitHub Pages deployment:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**, select:
   - **Source**: GitHub Actions

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build the website when you push to `main` branch
- Deploy the built files to GitHub Pages

Your website will be available at: `https://<username>.github.io/<repository-name>/`

For this repository: `https://abdelbarisaoute.github.io/mysite/`

### Manual Deployment

You can also trigger a deployment manually:
1. Go to **Actions** tab in your GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click **Run workflow**
