<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Personal Academic Website

A modern, responsive personal academic website built with React, TypeScript, and Vite. This website includes features for displaying articles, a resume, dark mode support, and an admin panel for content management.

> **📚 New to the admin dashboard?** Check out the comprehensive [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for step-by-step instructions on accessing the admin panel, managing articles, setting up GitHub automation, and deploying your site.

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

**📚 For complete deployment instructions, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md#deployment-guide)**

**✅ Use the [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to ensure proper setup**

### Quick Setup:

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

The website includes a secure admin panel for managing articles:

- Navigate to `#/admin` to log in
- Default password: `admin` (change this by setting the `VITE_ADMIN_PASSWORD` environment variable)
- Once logged in, you can create, edit, and delete articles
- **Automated article uploads to GitHub** (setup required)

**📚 For detailed instructions, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md)**

The admin guide includes:
- Step-by-step login instructions
- Complete GitHub automation setup
- Security best practices
- Troubleshooting tips
- Deployment guide

## GitHub Automation Setup

**Stop uploading articles manually!** This repository supports automated article uploads directly from the admin panel to your GitHub repository.

**📚 For complete setup instructions, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md)**

### Quick Setup Summary

1. **Create a GitHub Personal Access Token** with `repo` scope
2. **Add it as a repository secret** named `VITE_GITHUB_TOKEN`
3. **Verify the deployment workflow** includes the token in the build step
4. **Test by creating an article** in the admin dashboard

Once configured, articles are automatically committed to your repository and trigger redeployment!

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
