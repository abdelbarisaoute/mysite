# How to Insert Images in Articles

This guide explains how to add images to your articles on the personal academic website.

## 🎯 Key Features

- **Clickable Images**: All images in articles are automatically clickable - click any image to view it in full size in a new tab
- **Automatic Formatting**: Images are styled with responsive classes for optimal display
- **Multiple Upload Methods**: Upload via admin dashboard or manually add to repository

## Quick Method: Using the Admin Dashboard (Recommended)

The easiest way to add images to your articles is through the built-in image upload feature in the admin dashboard with **direct GitHub upload**.

### Steps:

1. **Access the Admin Dashboard**
   - Navigate to `#/admin` and log in
   - Click "New Article" or "Edit" an existing article

2. **Click "📷 Upload Images"**
   - You'll see an upload modal with drag-and-drop support

3. **Upload Your Images**
   - Drag and drop images, or click "Browse Files"
   - Supports: PNG, JPG, GIF, SVG, WebP
   - Multiple images can be uploaded at once

4. **Add Captions and Labels**
   - Enter captions for each image (optional)
   - Add labels for cross-referencing (e.g., `fig:experiment`)

5. **Upload Directly to GitHub (Recommended)**
   - Click "🚀 Upload All to GitHub" to commit all images at once
   - Or click "Upload to GitHub" for individual images
   - Images are automatically uploaded to your repository's `public/` directory
   - The site will automatically rebuild and deploy (1-2 minutes)
   - **Note:** Requires GitHub token to be configured in dashboard settings

6. **Choose Layout and Insert**
   - Select images using checkboxes
   - Choose between:
     - **Single Image(s)**: Insert one or more images individually
     - **Two Images Side-by-Side**: Select exactly 2 images
       - Choose between **separate captions** (one per image) or a **single shared caption** (one caption below both images)
   - Click "Insert Selected Images" to add to your article
   - Or use individual "Insert" buttons for quick insertion

### Alternative: Manual Download Method

If GitHub token is not configured:
- Click "Download" button for each image
- Place the downloaded images in the `public/` directory of your repository
- Commit and push the images to GitHub manually

### Benefits:
- ✅ Direct upload to GitHub - no manual file management needed
- ✅ Automatic image markup generation
- ✅ Preview of uploaded images with upload status
- ✅ Proper styling classes pre-applied
- ✅ **Images are automatically centered** - `mx-auto block` classes included
- ✅ **Flexible caption options** - choose between single shared caption or separate captions for side-by-side images
- ✅ **User-friendly interface** - improved layout with collapsible sections and clear instructions
- ✅ Batch upload support
- ✅ Real-time upload feedback
- ✅ **Images are automatically clickable** - users can click to view full size in a new tab

## Manual Method: Direct Image Insertion

If you prefer to manually add images or are working directly with article files:

## Overview

Images can be embedded in article content using standard HTML `<img>` tags. The website's content renderer will:
- Display images properly within your articles
- **Automatically make images clickable** - clicking an image opens it in full size in a new tab
- Apply responsive styling for optimal viewing on all devices

## Step-by-Step Guide

### 1. Prepare Your Image

First, prepare the image you want to use:
- **Supported formats**: PNG, JPG, JPEG, GIF, SVG, WebP
- **Recommended size**: Optimize images for web (typically under 500KB)
- **Naming**: Use descriptive, URL-friendly names (e.g., `quantum-wave-function.png`)

### 2. Store the Image

Place your image file in the `public` directory of your repository:

```
mysite/
├── public/
│   ├── my-image.png          ← Place your image here
│   ├── diagrams/
│   │   └── schematic.jpg     ← Or organize in subdirectories
│   └── ...
```

### 3. Reference the Image in Your Article

In your article file (e.g., `data/articles/my-article.ts`), add an HTML `<img>` tag in the `content` field:

```typescript
import { Article } from '../../types';

export const myArticle: Article = {
  id: 'my-article',
  title: 'My Article with Images',
  date: '2024-11-04',
  summary: 'An article demonstrating image insertion',
  content: `
\\section{Introduction}

This article includes an image:

<img src="/mysite/my-image.png" alt="Description of the image" class="max-w-full h-auto rounded-lg shadow-md my-4" />

The image above shows...

\\section{More Content}

You can also add images in subdirectories:

<img src="/mysite/diagrams/schematic.jpg" alt="Schematic diagram" class="max-w-full h-auto rounded-lg shadow-md my-4" />
  `
};
```

### 4. Image Tag Attributes

#### Required Attributes:
- **`src`**: Path to the image (always start with `/mysite/` for proper deployment)
- **`alt`**: Alternative text describing the image (important for accessibility)

#### Recommended Styling Classes:
- **`max-w-full`**: Ensures image doesn't overflow container
- **`h-auto`**: Maintains aspect ratio
- **`rounded-lg`**: Adds rounded corners
- **`shadow-md`**: Adds subtle shadow
- **`my-4`**: Adds vertical margin (spacing)
- **`mx-auto block`**: Centers the image horizontally (automatically included in images uploaded via admin dashboard)

#### Additional Styling Options:
- **`w-1/2`** or **`w-3/4`**: Controls width (50% or 75% of container)

### 5. Examples

#### Basic Image
```html
<img src="/mysite/photo.jpg" alt="Laboratory setup" class="max-w-full h-auto" />
```

#### Centered Image with Shadow
```html
<img src="/mysite/graph.png" alt="Experimental results graph" class="block mx-auto max-w-full h-auto rounded-lg shadow-md my-4" />
```

#### Smaller Centered Image
```html
<img src="/mysite/icon.png" alt="Quantum state icon" class="block mx-auto w-1/2 h-auto my-4" />
```

#### Image with Caption (Admin Dashboard Format)
```html
<div class="my-4">
  <img src="/mysite/experiment.jpg" alt="Experimental setup" class="max-w-full h-auto rounded-lg shadow-md mx-auto block" />
  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">Figure 1: Experimental setup for measuring quantum entanglement</p>
</div>
```
**Note:** Images uploaded via the admin dashboard automatically include `mx-auto block` classes for centering.

#### Side-by-Side Images with Separate Captions
```html
<div class="flex gap-4 my-4 flex-wrap justify-center items-start">
  <div class="flex-1 min-w-[200px]" id="fig:before">
    <img src="/mysite/before.png" alt="Before" class="w-full h-64 object-cover rounded-lg shadow-md" />
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">Figure #: Before treatment</p>
  </div>
  <div class="flex-1 min-w-[200px]" id="fig:after">
    <img src="/mysite/after.png" alt="After" class="w-full h-64 object-cover rounded-lg shadow-md" />
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">Figure #: After treatment</p>
  </div>
</div>
```

#### Side-by-Side Images with Single Shared Caption
```html
<div class="my-4" id="fig:comparison">
  <div class="flex gap-4 flex-wrap justify-center items-start">
    <div class="flex-1 min-w-[200px]">
      <img src="/mysite/before.png" alt="Before" class="w-full h-64 object-cover rounded-lg shadow-md" />
    </div>
    <div class="flex-1 min-w-[200px]">
      <img src="/mysite/after.png" alt="After" class="w-full h-64 object-cover rounded-lg shadow-md" />
    </div>
  </div>
  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">Figure #: Comparison of before and after treatment</p>
</div>
```

**Note:** 
- The `h-64` class sets a fixed height (16rem/256px) and `object-cover` ensures images fill the container while maintaining their aspect ratio without distortion. This ensures both images have the same height. You can adjust the height class (`h-48`, `h-64`, `h-80`, etc.) based on your needs.
- The admin dashboard now offers both caption styles when inserting side-by-side images!

## Image Interaction

### Clickable Images (Automatic Feature)

**All images in articles are automatically clickable!** This feature:
- Opens the image in full size in a new browser tab when clicked
- Provides a better viewing experience for detailed images
- No additional configuration needed - works automatically for all images
- Visual indicator: cursor changes to pointer when hovering over images

Simply add your images normally, and they will automatically become clickable.

## Using External Images

You can also reference images from external URLs:

```html
<img src="https://example.com/image.png" alt="External image" class="max-w-full h-auto my-4" />
```

**Note**: External images require an internet connection and may break if the source is removed. It's recommended to host images locally in the `public` directory.

## Troubleshooting

### Image Not Displaying

1. **Check the path**: Ensure the path starts with `/mysite/` (or your repository name)
2. **Verify file exists**: Confirm the image file is in the `public` directory
3. **Case sensitivity**: File names are case-sensitive (e.g., `Image.png` ≠ `image.png`)
4. **Build and deploy**: After adding images, rebuild and redeploy:
   ```bash
   npm run build
   git add public/your-image.png
   git add data/articles/your-article.ts
   git commit -m "Add image to article"
   git push
   ```

### Image Too Large

If your image is too large:
1. Resize it before uploading (recommended max width: 1200px)
2. Compress it using tools like TinyPNG, ImageOptim, or similar
3. Use the `w-3/4` or `w-1/2` classes to control display size

### Image Not Responsive

Make sure to include:
- `max-w-full` class to prevent overflow
- `h-auto` class to maintain aspect ratio

## Best Practices

1. **Optimize images**: Compress images to reduce file size and improve load times
2. **Use descriptive alt text**: Help screen readers and improve SEO
3. **Consistent naming**: Use lowercase with hyphens (e.g., `wave-function-plot.png`)
4. **Organize by topic**: Create subdirectories in `public/` for different article topics
5. **Test locally**: Always test images with `npm run preview` before pushing
6. **Accessibility**: Ensure sufficient contrast and provide meaningful alt text

## LaTeX and Images Together

You can combine images with LaTeX mathematical content:

```typescript
content: `
\\section{Wave Functions}

The wave function is described by:
$$ \\Psi(x,t) = A e^{i(kx - \\omega t)} $$

Here is a visualization:

<img src="/mysite/wave-function.png" alt="Wave function plot" class="block mx-auto max-w-full h-auto rounded-lg shadow-md my-4" />

As shown in the figure above, the wave function oscillates...
`
```

## GitHub Deployment

When deploying to GitHub Pages, the images in the `public` directory are automatically included in the build. Just ensure:

1. Images are committed to the repository
2. The path includes `/mysite/` (or your repository name from `vite.config.ts`)
3. The GitHub Actions workflow completes successfully

After deployment, your images will be accessible at:
```
https://[username].github.io/mysite/your-image.png
```

## Summary

- Store images in the `public/` directory
- Reference with `/mysite/image-name.png` in article content
- Use Tailwind CSS classes for styling
- Always include `alt` text for accessibility
- Test locally before deploying
