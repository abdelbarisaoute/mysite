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
2. **Articles**: Add/edit article files in `data/articles/`
3. **Site Title**: Change the title in `index.html` and `components/Header.tsx`
4. **Colors/Styling**: Modify Tailwind classes or the Tailwind config in `index.html`

### Changing the Base Path:

If you want to deploy to a different repository name, update the `base` property in `vite.config.ts`:

```typescript
base: '/your-repo-name/',
```

## License

This project is open source and available under the MIT License.
