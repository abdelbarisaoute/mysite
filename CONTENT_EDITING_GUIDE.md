# Content Editing Guide

This website now supports persistent content editing through GitHub integration. When properly configured, any content changes made through the admin interface will be automatically committed to your GitHub repository and trigger a redeployment of your website.

## Features

### Editable Content
- **Home Page**: Title and description can be edited
- **Resume**: Full markdown content is editable with live preview
- **Articles**: Create new articles and edit existing ones (title, summary, and content)
  - **NEW**: Full LaTeX support for text formatting and mathematical expressions
  - **NEW**: Live preview in edit mode - see your rendered content as you type

### LaTeX Support
Articles now support comprehensive LaTeX commands:
- Text formatting: `\textbf{bold}`, `\textit{italic}`, `\emph{emphasized}`
- Document structure: `\section{Title}`, `\subsection{Subtitle}`
- Lists: `\begin{itemize}...\end{itemize}`, `\begin{enumerate}...\end{enumerate}`
- Math expressions: Inline `$E=mc^2$` and display `$$...$$`
- Special environments: `\begin{remarque}...\end{remarque}`

See the [LaTeX Support Documentation](../LATEX_SUPPORT.md) for complete details.

### Live Preview
When editing articles or resume content, enable "Show Live Preview" to see:
- Real-time rendering of your LaTeX and markdown
- Side-by-side comparison of source and output
- Immediate feedback on formatting and syntax

### Storage Options
The website supports two storage modes:

1. **Local Storage Only** (Default)
   - Changes are saved in your browser's localStorage
   - Edits only visible on your current browser
   - Useful for testing or personal drafts

2. **GitHub Integration** (Recommended)
   - Changes are committed directly to your GitHub repository
   - Triggers automatic website redeployment
   - Changes are permanent and visible to everyone
   - Requires one-time setup

## Setup Instructions

### Prerequisites
- Admin access to the website (password: `admin`)
- A GitHub Personal Access Token with `repo` scope

### Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** (classic)
3. Give it a descriptive name (e.g., "MyWebsite Content Editor")
4. Set an expiration date (or choose "No expiration" if you prefer)
5. Select the **`repo`** scope (this gives full control of private repositories)
6. Click **"Generate token"**
7. **Important**: Copy the token immediately - you won't be able to see it again!

### Step 2: Configure GitHub Integration

1. Log in to the website admin panel
2. Navigate to **Settings** from the navigation menu
3. Fill in the following information:
   - **Repository Owner**: Your GitHub username (e.g., `abdelbarisaoute`)
   - **Repository Name**: The repository name (e.g., `mysite`)
   - **Branch**: The branch to commit to (usually `main`)
   - **Personal Access Token**: Paste the token you created in Step 1
4. Click **"Save Configuration"**

### Step 3: Edit Content

Once configured, you can edit content:

1. **Home Page**
   - Click the "Edit" button on the home page hero section
   - Modify the title and description
   - Click "Save"

2. **Resume**
   - Navigate to the Resume page
   - Click "Edit"
   - Modify the markdown content
   - Click "Save"

3. **Articles**
   - To create a new article: Go to Contents → New Article
   - To edit an existing article: Open the article → Click "Edit"
   - Modify title, summary, and/or content
   - Click "Save"

### Step 4: Verify Changes

After saving:
- You'll see a confirmation message indicating whether the change was committed to GitHub
- Check your GitHub repository to see the new commit
- The GitHub Actions workflow will automatically rebuild and redeploy your site
- Changes will be live in a few minutes

## Status Indicators

The Settings page shows the current integration status:
- **✓ Configured**: Changes will be committed to GitHub
- **✗ Not configured**: Changes will only be saved locally

After each save operation, you'll receive a message indicating:
- Success: "Changes saved and committed to GitHub!"
- Local only: "Changes saved locally only. Configure GitHub in Settings..."
- Error: "Changes saved locally, but failed to commit to GitHub..."

## Security Notes

- Your Personal Access Token is stored in your browser's localStorage
- Never share your token with others
- If compromised, immediately revoke the token on GitHub and generate a new one
- The token is only used for committing content changes to your repository

## Troubleshooting

### "Failed to commit to GitHub"
- Verify your token is valid and has the `repo` scope
- Check that the repository owner and name are correct
- Ensure the branch name matches your actual branch
- Verify the token hasn't expired

### Changes not appearing on the live site
- Check the Actions tab on GitHub to see if the deployment workflow ran
- The deployment typically takes 2-5 minutes
- If the workflow failed, check the logs for errors

### Cannot access Settings page
- Make sure you're logged in as admin
- Navigate directly to `#/settings` if the link is not visible

## File Structure

When you edit content through the interface, the following files are updated in your repository:

- Home page content: `data/content.ts`
- Resume content: `data/resume.ts`
- Article content: `data/articles/[article-id].ts`

These files are TypeScript modules that are compiled into your website during the build process.
