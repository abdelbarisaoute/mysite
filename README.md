<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Personal Blog & Portfolio

A modern, responsive personal blog and portfolio website built with React, TypeScript, and Vite. This website features a clean blog design with project showcase capabilities, article management, and an intuitive admin panel for content management.

> **📚 New to the admin dashboard?** Check out the comprehensive [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for step-by-step instructions on accessing the admin panel, managing articles and projects, setting up GitHub automation, and deploying your site.

## Features

### Blog & Content
- 📝 **Article management** - Create, read, update, and delete blog posts with ease
- 📑 **Table of Contents** - Automatically generated from article sections with smooth scrolling
- 🖼️ **Image Support** - Comprehensive guide for adding images to articles (see [IMAGE_GUIDE.md](IMAGE_GUIDE.md))
- 📊 **LaTeX/KaTeX support** - Write mathematical equations and formatted content

### Projects Showcase
- 💻 **Project management** - Upload and showcase your projects with code samples
- 🔗 **GitHub & Demo links** - Link to source code and live demos
- 🏷️ **Technology tags** - Display technologies used in each project
- 📝 **Code snippets** - Include formatted code examples in project descriptions

### User Experience
- 🌓 **Dark mode** - Theme persistence across sessions
- 🔍 **Search functionality** - Live suggestions as you type
- 📱 **Fully responsive** - Optimized for mobile, tablet, and desktop
- 🎨 **Modern UI** - Clean blog-focused design with Tailwind CSS
- 🚀 **Fast performance** - Built with Vite for lightning-fast builds

### Admin & Deployment
- 🔐 **Simple authentication** - Password-protected admin panel
- ⚡ **Easy content management** - User-friendly interface for articles and projects
- 🚀 **Automatic deployment** - GitHub Pages integration

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
├── context/           # React context providers (ArticleContext, ProjectContext, ThemeContext, AuthContext)
├── data/              # Static data (articles, resume, annex)
├── pages/             # Page components
│   ├── HomePage.tsx           # Blog-focused landing page
│   ├── ContentsPage.tsx       # Blog/articles listing
│   ├── ProjectsPage.tsx       # Projects showcase
│   ├── ProjectDetailPage.tsx  # Individual project view
│   ├── ArticlePage.tsx        # Article view
│   └── AdminDashboardPage.tsx # Admin panel with tabs for articles, projects, about, settings
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
2. **Blog Posts**: Use the admin panel at `#/admin` to create and manage articles
3. **Projects**: Use the admin panel's Projects tab to showcase your work with code samples
4. **Site Title**: Change the title in `index.html` and `components/Header.tsx`
5. **Navigation**: Modify `components/Header.tsx` to customize menu items
6. **Colors/Styling**: Modify Tailwind classes or the Tailwind config in `index.html`

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

### Managing Projects:

The easiest way to add projects is through the admin panel:

1. Navigate to `#/admin` and log in
2. Click on the **Projects** tab
3. Click **New Project** and fill in the details:
   - **Title**: Your project name
   - **Description**: Short summary (shown on the projects page)
   - **Technologies**: Comma-separated list (e.g., React, TypeScript, Node.js)
   - **Full Description**: Detailed explanation (supports LaTeX syntax)
   - **Code Snippet**: Optional code sample to showcase
   - **GitHub URL**: Link to the repository (optional)
   - **Demo URL**: Link to live demo (optional)
4. Click **Create Project** to save

Projects are stored in localStorage and display on the `/projects` page with:
- Technology tags
- Links to GitHub and live demos
- Detailed project pages with code samples
- LaTeX rendering for technical descriptions

### Article Syntax Reference:

For comprehensive documentation on all available syntax and features for writing articles, see the [SYNTAX_GUIDE.md](SYNTAX_GUIDE.md).

Quick reference:
- Text formatting: `\textbf{bold}`, `\textit{italic}`, `\underline{underlined}`
- Sections: `\section{Title}`, `\subsection{Title}`, `\subsubsection{Title}`
- Math: Inline `$...$` or display `$$...$$`
- **Remark boxes (green):** `\begin{remark}...\end{remark}` or `\begin{remarque}...\end{remarque}`
- **Example boxes (blue):** `\begin{example}...\end{example}` or `\begin{example}[title = {Title}]...\end{example}`
- Lists: `\begin{itemize}...\end{itemize}` or `\begin{enumerate}...\end{enumerate}`
- Tables: Standard Markdown table syntax
- Images: HTML `<img>` tags with Tailwind classes (see [IMAGE_GUIDE.md](IMAGE_GUIDE.md))

### LaTeX and Math Support:

The website includes comprehensive LaTeX rendering capabilities powered by KaTeX:

**Mathematical Expressions:**
- Inline math: `$E = mc^2$` renders as $E = mc^2$
- Display math: `$$ \int_0^1 x^2 dx $$` renders centered
- Alternative notations: `\(...\)` for inline, `\[...\]` for display

**LaTeX Text Commands:**
- `\textbf{bold text}` for **bold text**
- `\textit{italic text}` for *italic text*
- `\emph{emphasized text}` for *emphasized text*
- `\underline{underlined text}` for underlined text

**Document Structure:**
- `\section{Section Title}` for main sections
- `\subsection{Subsection Title}` for subsections
- `\subsubsection{Subsubsection Title}` for sub-subsections

**✨ Automatic Table of Contents:**
- Articles with sections automatically display a navigable table of contents in the left sidebar
- TOC includes all sections, subsections, and sub-subsections
- Active section highlighting as you scroll
- Smooth scrolling to sections when clicked
- Hidden on mobile, visible on desktop (≥1024px screens)

**Remark Blocks:**
```latex
\begin{remark}
This is a highlighted remark block with green styling that supports both math $x^2$ and formatting.
\end{remark}
```

**Example Blocks:**
```latex
\begin{example}
This is an example block with blue styling. Can include math and formatting.
\end{example}

\begin{example}[title = {Custom Title}]
Example with a custom title.
\end{example}
```

**Example Article with LaTeX:**
```typescript
export const exampleArticle: Article = {
  id: 'example',
  title: 'LaTeX Example',
  date: '2024-11-04',
  summary: 'Demonstrating LaTeX features',
  content: `
\\section{Introduction}

This article uses \\textbf{bold} and \\textit{italic} text.

\\subsection{Mathematics}

Inline math: $E = mc^2$

Display equation:
$$ \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} $$

\\begin{remarque}
Important: The equation $a^2 + b^2 = c^2$ is the Pythagorean theorem.
\\end{remarque}
  `
};
```

### Adding Images to Articles:

Images can be added to your articles using standard HTML `<img>` tags. For complete instructions and examples, see the comprehensive [IMAGE_GUIDE.md](IMAGE_GUIDE.md).

**Quick Example:**
```html
<img src="/mysite/my-image.png" alt="Description" class="max-w-full h-auto rounded-lg shadow-md my-4" />
```

**Key Points:**
- Store images in the `public/` directory
- Reference with `/mysite/image-name.png` path
- Use Tailwind CSS classes for styling
- Always include descriptive `alt` text for accessibility

For advanced layouts (centered images, side-by-side, with captions) and troubleshooting, consult the [IMAGE_GUIDE.md](IMAGE_GUIDE.md).

## Troubleshooting

### Articles Not Appearing After Deployment

If you've added an article through the admin panel but don't see it on the live site:

1. **Wait for deployment**: Automatic deployment takes 1-2 minutes after committing an article
2. **Check deployment status**: Go to the **Actions** tab in your repository to verify the deployment succeeded
3. **Clear browser cache**: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to force refresh
4. **Verify article file**: Check that the article file exists in `data/articles/` in your repository

The site includes cache control headers to prevent HTML caching, but JavaScript bundles use hashed filenames for optimal performance.

### Changing the Base Path:

If you want to deploy to a different repository name, update the `base` property in `vite.config.ts`:

```typescript
base: '/your-repo-name/',
```

## License

This project is open source and available under the MIT License.
