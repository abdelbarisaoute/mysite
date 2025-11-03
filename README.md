<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Personal Academic Website

A modern, responsive personal academic website built with React, TypeScript, and Vite. This website includes features for displaying articles, a resume, dark mode support, and an admin panel for content management.

## Features

- 📝 Article management system with create, read, update, and delete functionality
- 🌓 Dark mode support with theme persistence
- 🔍 Search functionality with live suggestions
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔐 Simple admin authentication
- ⚡ Fast build times with Vite
- 📊 KaTeX support for mathematical equations
- 🚀 Automatic deployment to GitHub Pages

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deploy to GitHub Pages

This repository is configured for automatic deployment to GitHub Pages. The deployment happens automatically when you push to the `main` branch.

### Setup Instructions:

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**, select:
   - **Source**: GitHub Actions
4. Push your changes to the `main` branch
5. The GitHub Actions workflow will automatically build and deploy your site
6. Your site will be available at: `https://[username].github.io/mysite/`

### Manual Deployment:

You can also trigger a manual deployment:
1. Go to the **Actions** tab in your GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" and select the branch to deploy

## Admin Access

The website includes an admin panel for managing articles:

- Navigate to `/admin` to log in
- Default password: `admin` (you can change this in `context/AuthContext.tsx`)
- Once logged in, you can create, edit, and delete articles
- **Automated article uploads to GitHub** (setup required - see below)

## GitHub Automation Setup

**Stop uploading articles manually!** This repository supports automated article uploads directly from the admin panel to your GitHub repository. Follow these steps to set it up:

### Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name (e.g., "Article Auto-Save for mysite")
4. Set an expiration date (recommended: 90 days or custom)
5. **Select the `repo` scope** (this gives full control of private repositories)
6. Scroll down and click **"Generate token"**
7. **Copy the token immediately** (you won't be able to see it again!)

### Step 2: Add Token as a Repository Secret

1. Go to your repository on GitHub: `https://github.com/[your-username]/mysite`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Set the name to: `VITE_GITHUB_TOKEN`
5. Paste your personal access token in the value field
6. Click **"Add secret"**

### Step 3: Verify the Deployment Workflow

The deployment workflow (`.github/workflows/deploy.yml`) should already be configured to use your secret. It should include:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

This passes your token to the build process, enabling the auto-save feature.

### Step 4: Test the Setup

1. Push a change to the `main` branch to trigger a deployment
2. Wait for the GitHub Actions workflow to complete
3. Navigate to your deployed site at `https://[username].github.io/mysite/`
4. Go to `/admin` and log in
5. Create a new article
6. The article should be automatically saved to your repository!
7. Check your repository - you should see a new commit with your article in `data/articles/`

### How It Works

Once configured, the admin panel will:
- ✅ Automatically commit new articles to `data/articles/[article-id].ts`
- ✅ Generate properly formatted TypeScript files
- ✅ Push changes directly to your GitHub repository
- ✅ Trigger automatic redeployment via GitHub Actions
- ✅ Show success/error status messages

### Local Development Setup (Optional)

If you want to test auto-save during local development:

1. Copy `.env.example` to `.env` in your project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your token:
   ```
   VITE_GITHUB_TOKEN=your_personal_access_token_here
   ```

3. **Important:** Never commit the `.env` file to version control (it's already in `.gitignore`)

4. Restart your development server:
   ```bash
   npm run dev
   ```

### Troubleshooting

**"GitHub not configured" message appears:**
- Verify you've added the `VITE_GITHUB_TOKEN` secret in repository settings
- Check that your GitHub Actions workflow includes the `env` section in the build step
- Ensure you've pushed changes and triggered a new deployment

**"Failed to save to repository" error:**
- Verify your personal access token has the `repo` scope
- Check if your token has expired (tokens can expire after 90 days)
- Ensure the token has permissions for your repository
- Check the browser console for detailed error messages

**Token expired:**
- Generate a new personal access token following Step 1
- Update the `VITE_GITHUB_TOKEN` secret in your repository settings

### Manual Save Option (Fallback)

If automatic saving is not configured or fails, you can still manage articles:
1. Click **"Download Article File"** after creating/editing an article
2. Save the downloaded `.ts` file to `data/articles/` in your local repository
3. Commit and push the changes manually:
   ```bash
   git add data/articles/your-article.ts
   git commit -m "Add new article"
   git push
   ```

## Project Structure

```
mysite/
├── components/         # Reusable React components
├── context/           # React context providers
├── data/              # Static data (articles, resume)
├── pages/             # Page components
├── public/            # Static assets
├── .github/workflows/ # GitHub Actions workflows
├── index.html         # HTML template
├── App.tsx            # Main application component
└── vite.config.ts     # Vite configuration
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **KaTeX** - Math equation rendering
- **GitHub Actions** - CI/CD for automatic deployment

## Customization

### Changing Site Content:

1. **Personal Information**: Edit the content in `pages/HomePage.tsx` and `pages/ResumePage.tsx`
2. **Articles**: Add/edit article files in `data/articles/`. New article files are automatically discovered - no need to manually update `index.ts`!
3. **Site Title**: Change the title in `index.html` and `components/Header.tsx`
4. **Colors/Styling**: Modify Tailwind classes or the Tailwind config in `index.html`

### Adding New Articles:

Articles are now automatically discovered! Simply:

1. Create a new TypeScript file in `data/articles/` (e.g., `my-new-article.ts`)
2. Export an Article object following this format:
   ```typescript
   import { Article } from '../../types';

   export const myNewArticle: Article = {
     id: 'my-new-article',
     title: 'My New Article',
     date: '2024-11-03',
     summary: 'A brief summary of the article',
     content: `Your article content here...`
   };
   ```
3. Commit and push - the article will be automatically included!

The build system uses Vite's `import.meta.glob` to automatically discover all article files in the `data/articles/` directory.

### Changing the Base Path:

If you want to deploy to a different repository name, update the `base` property in `vite.config.ts`:

```typescript
base: '/your-repo-name/',
```

## License

This project is open source and available under the MIT License.
