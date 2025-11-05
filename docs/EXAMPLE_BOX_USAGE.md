# Example Box Usage

This document explains how to use the example box feature in articles.

## Basic Usage

### Example without title
```latex
\begin{example}
Your example content here. You can use math: $x = 5$, and text formatting like \textbf{bold}.
\end{example}
```

This will render as a green box with:
> **Example:** Your example content here. You can use math: x = 5, and text formatting like **bold**.

### Example with title
```latex
\begin{example}[title = {Your Custom Title}]
Your example content here with a custom title.
\end{example}
```

This will render as a green box with:
> **Example: Your Custom Title** Your example content here with a custom title.

## Features

- **Green color scheme**: Example boxes use green borders and background (border-green-500, bg-green-50) to distinguish them from blue remark boxes
- **Math support**: Full KaTeX math rendering inside examples
- **Text formatting**: All LaTeX text commands (\textbf, \textit, \emph, etc.) work inside examples
- **Dark mode**: Automatically adjusts styling for dark mode (dark:bg-green-900/20)

## Examples

### Example 1: Simple Harmonic Oscillator
```latex
\begin{example}[title = {Simple Harmonic Oscillator}]
Consider a mass $m$ attached to a spring with constant $k$. The position can be written as $x(t) = A \cos(\omega_0 t - \phi)$ where $\omega_0 = \sqrt{k/m}$. This is a monochromatic vibration with fixed amplitude $A$.
\end{example}
```

### Example 2: Real-world Application
```latex
\begin{example}
A tuning fork produces a quasi-monochromatic vibration that is very close to a pure sinusoid, but the amplitude slowly decays over time due to energy dissipation.
\end{example}
```

## Comparison with Remark Boxes

| Feature | Remark Box | Example Box |
|---------|-----------|-------------|
| Syntax | `\begin{remark}...\end{remark}` | `\begin{example}...\end{example}` |
| Color | Blue (border-blue-500) | Green (border-green-500) |
| Title Support | No | Yes (optional) |
| Use Case | Notes, observations | Concrete examples, applications |
