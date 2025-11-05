# Complete Syntax Guide for Personal Academic Website

This comprehensive guide covers all syntax and features available for creating content on this website.

## Table of Contents

1. [Article Structure](#article-structure)
2. [Text Formatting](#text-formatting)
3. [Document Structure](#document-structure)
4. [Mathematics](#mathematics)
5. [Special Boxes](#special-boxes)
6. [Lists](#lists)
7. [Tables](#tables)
8. [Images](#images)

---

## Article Structure

### Creating a New Article

Articles are TypeScript files located in `data/articles/`. Each article must export an `Article` object:

```typescript
import { Article } from '../../types';

export const myArticle: Article = {
  id: 'unique-article-id',
  title: 'Article Title',
  date: 'YYYY-MM-DD',
  summary: 'Brief summary of the article',
  content: `
    Your article content here...
  `
};
```

**Fields:**
- `id` (string, required): Unique identifier for the article (used in URLs)
- `title` (string, required): The article title displayed on the page
- `date` (string, required): Publication date in ISO format (YYYY-MM-DD)
- `summary` (string, required): Brief description shown in article previews
- `content` (string, required): Main article content with LaTeX and markdown support

---

## Text Formatting

### Basic Text Commands

| Syntax | Result | Description |
|--------|--------|-------------|
| `\textbf{text}` | **text** | Bold text |
| `\textit{text}` | *text* | Italic text |
| `\emph{text}` | *text* | Emphasized text (italic) |
| `\underline{text}` | <u>text</u> | Underlined text |

**Example:**
```latex
This is \textbf{bold}, \textit{italic}, and \underline{underlined} text.
```

### Paragraphs

Paragraphs are automatically created from text separated by blank lines:

```latex
This is the first paragraph.

This is the second paragraph.
```

---

## Document Structure

### Sections and Headings

Articles support hierarchical section structure with automatic Table of Contents generation:

| Syntax | Level | Example |
|--------|-------|---------|
| `\section{Title}` | H2 | Main sections |
| `\subsection{Title}` | H3 | Subsections |
| `\subsubsection{Title}` | H4 | Sub-subsections |

**Example:**
```latex
\section{Introduction}
This is the introduction section.

\subsection{Background}
Background information goes here.

\subsubsection{Historical Context}
More detailed historical information.
```

**Features:**
- Automatic anchor IDs generated from section titles
- Automatic Table of Contents on desktop (≥1024px)
- Active section highlighting while scrolling
- Smooth scrolling to sections when clicked

---

## Mathematics

### Inline Math

Use `$...$` or `\(...\)` for inline mathematics:

```latex
The equation $E = mc^2$ is famous.
Or use \(a^2 + b^2 = c^2\) for the Pythagorean theorem.
```

### Display Math

Use `$$...$$` or `\[...\]` for centered display equations:

```latex
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

Or:

\[
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
\]
```

### Complex Expressions

KaTeX supports a wide range of mathematical notation:

**Common Symbols:**
- Greek letters: `\alpha`, `\beta`, `\gamma`, `\omega`, `\Omega`
- Operators: `\sum`, `\int`, `\prod`, `\lim`
- Relations: `\leq`, `\geq`, `\approx`, `\equiv`, `\propto`
- Arrows: `\rightarrow`, `\leftarrow`, `\Rightarrow`, `\Leftrightarrow`

**Fractions and Roots:**
```latex
$\frac{a}{b}$ for fractions
$\sqrt{x}$ for square roots
$\sqrt[n]{x}$ for nth roots
```

**Subscripts and Superscripts:**
```latex
$x^2$, $x_i$, $x_i^2$, $x^{2n+1}$
```

**Example:**
```latex
The solution to the differential equation is:
$$
x(t) = A \cos(\omega_0 t - \phi) \quad \text{where} \quad \omega_0 = \sqrt{\frac{k}{m}}
$$
```

### Aligned Equations

Use `\begin{aligned}...\end{aligned}` inside display math mode to align multiple equations at specific points:

**Basic Syntax:**
```latex
$$
\begin{aligned}
x &= a + b \\
y &= c + d
\end{aligned}
$$
```

**Key Features:**
- `&` marks the alignment point (usually before `=`, `<`, `>`, etc.)
- `\\` creates a line break for the next equation
- Must be used inside display math mode (`$$...$$` or `\[...\]`)
- Equations are aligned vertically at the `&` symbol

**Multi-step Derivation:**
```latex
$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
     &= (x+1)^2 \\
     &= (x+1)(x+1)
\end{aligned}
$$
```

**System of Equations:**
```latex
$$
\begin{aligned}
2x + 3y &= 7 \\
x - y &= 1
\end{aligned}
$$
```

**With Text Annotations:**
```latex
$$
\begin{aligned}
E &= mc^2 & \text{(Einstein's equation)} \\
F &= ma   & \text{(Newton's second law)}
\end{aligned}
$$
```

**Tips:**
- Use double backslashes (`\\`) in TypeScript strings: `\\begin{aligned}...\\end{aligned}`
- Remember to escape backslashes: `\\\\` for line breaks
- Align at the relation symbol for best visual results
- Can be combined with other LaTeX commands like `\text{}`, `\frac{}`, etc.

---

## Special Boxes

### Remark Boxes

**Color:** Green border and background  
**Syntax:** `\begin{remark}...\end{remark}` or `\begin{remarque}...\end{remarque}`

```latex
\begin{remark}
This is an important note or observation. You can include math $x^2$ 
and formatting \textbf{bold text} inside remarks.
\end{remark}
```

**Features:**
- Green color scheme (border-green-500, bg-green-50)
- Dark mode support (dark:bg-green-900/20)
- Full LaTeX math and formatting support
- No title support

### Example Boxes

**Color:** Blue border and background  
**Syntax:** `\begin{example}...\end{example}`

**Basic Example (no title):**
```latex
\begin{example}
This demonstrates a concept with a concrete case.
Can include math $f(x) = x^2$ and \textit{formatting}.
\end{example}
```

**Example with Title:**
```latex
\begin{example}[title = {Simple Harmonic Oscillator}]
Consider a mass $m$ attached to a spring with constant $k$.
The position is $x(t) = A \cos(\omega_0 t - \phi)$.
\end{example}
```

**Features:**
- Blue color scheme (border-blue-500, bg-blue-50)
- Dark mode support (dark:bg-blue-900/20)
- Optional custom titles
- Full LaTeX math and formatting support

---

## Lists

### Unordered Lists (Itemize)

```latex
\begin{itemize}
\item First item with \textbf{bold text}
\item Second item with math $x = 5$
\item Third item
\end{itemize}
```

### Ordered Lists (Enumerate)

```latex
\begin{enumerate}
\item First step
\item Second step with $y = 2x$
\item Third step
\end{enumerate}
```

**Features:**
- Full LaTeX formatting and math support in list items
- Nested lists supported
- Automatic styling with proper spacing

---

## Tables

### Markdown Tables

Tables use standard Markdown syntax:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

**Features:**
- Automatic borders and styling
- Dark mode support
- Responsive design
- Header row with distinct styling

**Example with Content:**
```markdown
| Property | Value | Unit |
|----------|-------|------|
| Mass | 10 | kg |
| Velocity | 5 | m/s |
| Energy | 125 | J |
```

---

## Images

### Adding Images to Articles

Images are added using standard HTML `<img>` tags with Tailwind CSS classes for styling.

**Basic Image:**
```html
<img src="/mysite/image-name.png" alt="Description" class="max-w-full h-auto" />
```

**Styled Image:**
```html
<img src="/mysite/photo.jpg" 
     alt="Descriptive text" 
     class="max-w-full h-auto rounded-lg shadow-md my-4" />
```

### Image Storage

- Store images in the `public/` directory
- Reference with `/mysite/image-name.ext` path
- Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP

### Styling Options

**Common Tailwind Classes:**
- `max-w-full` - Responsive width
- `h-auto` - Maintain aspect ratio
- `rounded-lg` - Rounded corners
- `shadow-md` - Drop shadow
- `my-4` - Vertical margin
- `mx-auto` - Center horizontally
- `block` - Display as block element

**Centered Image:**
```html
<img src="/mysite/diagram.png" 
     alt="System diagram" 
     class="max-w-full h-auto mx-auto block my-6" />
```

**Image with Caption:**
```html
<div class="my-6">
  <img src="/mysite/figure.png" 
       alt="Figure description" 
       class="max-w-full h-auto mx-auto block rounded-lg shadow-md" />
  <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
    Figure 1: Caption text here
  </p>
</div>
```

**Side-by-Side Images:**
```html
<div class="flex gap-4 my-4 flex-wrap items-start">
  <div class="flex-1 min-w-[200px]">
    <img src="/mysite/image1.png" 
         alt="First image" 
         class="w-full h-64 object-cover rounded-lg shadow-md" />
  </div>
  <div class="flex-1 min-w-[200px]">
    <img src="/mysite/image2.png" 
         alt="Second image" 
         class="w-full h-64 object-cover rounded-lg shadow-md" />
  </div>
</div>
```

**Key Classes for Equal Heights:**
- `h-64` - Sets a fixed height (16rem/256px) ensuring both images have the same height
- `object-cover` - Ensures images fill the container while maintaining aspect ratio without distortion
- `items-start` - Aligns flex items to the top
- You can use different height classes: `h-48` (12rem), `h-64` (16rem), `h-80` (20rem), or `h-96` (24rem)

**Important Notes:**
- Always include descriptive `alt` text for accessibility
- Use the `/mysite/` prefix in paths (required for GitHub Pages deployment)
- Test images locally before committing
- Consider image file sizes for performance

For more detailed image guidance, see [IMAGE_GUIDE.md](IMAGE_GUIDE.md).

---

## Complete Example Article

Here's a complete example demonstrating multiple features:

```typescript
import { Article } from '../../types';

export const exampleSyntax: Article = {
  id: 'syntax-example',
  title: 'Complete Syntax Example',
  date: '2025-11-05',
  summary: 'Demonstrating all available syntax features',
  content: `
\\section{Introduction}

This article demonstrates the \textbf{complete syntax} available for writing 
articles on this website. We'll cover text formatting, mathematics, and special environments.

\\subsection{Basic Mathematics}

Inline math like $E = mc^2$ is easy. Display equations are centered:

$$
\\int_0^\\infty x^2 e^{-x} dx = 2
$$

Multi-step derivations can use aligned equations:

$$
\\begin{aligned}
x^2 + 2x + 1 &= x^2 + x + x + 1 \\\\
             &= x(x+1) + (x+1) \\\\
             &= (x+1)(x+1) \\\\
             &= (x+1)^2
\\end{aligned}
$$

\\begin{remark}
The integral converges for all positive values of $x$.
\\end{remark}

\\subsection{Examples}

\\begin{example}[title = {Harmonic Oscillator}]
A spring-mass system oscillates with position $x(t) = A \\cos(\\omega t)$ 
where $\\omega = \\sqrt{k/m}$.
\\end{example}

\\subsection{Lists and Tables}

Here's an itemized list:

\\begin{itemize}
\\item First property: $\\alpha = 1$
\\item Second property: $\\beta = 2$  
\\item Third property: $\\gamma = 3$
\\end{itemize}

And a comparison table:

| Parameter | Symbol | Value |
|-----------|--------|-------|
| Frequency | $\\omega$ | 2π rad/s |
| Amplitude | $A$ | 10 cm |
| Phase | $\\phi$ | 0 rad |

\\subsection{Images}

<img src="/mysite/diagram.png" 
     alt="System diagram" 
     class="max-w-full h-auto mx-auto block rounded-lg shadow-md my-4" />

\\section{Conclusion}

This example demonstrates the rich feature set available for creating 
academic content with \textit{mathematical notation}, \textbf{formatted text}, 
and structured layouts.
  `
};
```

---

## Tips and Best Practices

### Writing Tips

1. **Use blank lines** to separate paragraphs for better readability
2. **Escape backslashes** properly in TypeScript strings (use `\\` for `\`)
3. **Test math locally** before committing articles
4. **Use descriptive section titles** for better Table of Contents
5. **Add alt text** to all images for accessibility

### Common Mistakes

1. **Missing double backslashes:** Remember `\\section` not `\section` in strings
2. **Unclosed environments:** Always match `\begin{...}` with `\end{...}`
3. **Math syntax errors:** Test complex equations carefully
4. **Wrong image paths:** Use `/mysite/` prefix for GitHub Pages

### Performance Considerations

1. **Optimize images** before uploading (compress JPG/PNG files)
2. **Avoid extremely long articles** without sections
3. **Test on mobile devices** to ensure responsive layout
4. **Use appropriate math notation** (inline vs display)

---

## Additional Resources

- [README.md](README.md) - Main project documentation
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) - Admin panel usage
- [IMAGE_GUIDE.md](IMAGE_GUIDE.md) - Detailed image usage guide
- [EXAMPLE_BOX_USAGE.md](docs/EXAMPLE_BOX_USAGE.md) - Example box reference
- [KaTeX Documentation](https://katex.org/docs/supported.html) - Supported math functions

---

## Troubleshooting

### Math Not Rendering

- Check for unescaped special characters
- Verify brackets and braces are balanced
- Test the expression in a KaTeX editor first

### Images Not Showing

- Verify file exists in `public/` directory
- Check path includes `/mysite/` prefix
- Ensure proper file extensions (.png, .jpg, etc.)
- Clear browser cache and hard refresh

### Sections Not in Table of Contents

- Ensure sections use `\section`, `\subsection`, or `\subsubsection`
- Check that section titles are properly formatted
- Verify no syntax errors before the section

### Boxes Not Displaying Correctly

- Verify `\begin{...}` matches `\end{...}`
- Check for typos in environment names
- Ensure content is inside the environment

---

## Version Information

This syntax guide is current as of November 2025. Features and syntax may be updated over time. Check the repository for the latest documentation.

**Last Updated:** 2025-11-05
