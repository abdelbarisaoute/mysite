import { Article } from '../../types';

export const latexTest: Article = {
  id: 'latex-test',
  title: 'LaTeX Rendering Test',
  date: '2024-11-04',
  summary: 'A comprehensive test of LaTeX rendering capabilities including sections, formatting, math, and remark blocks.',
  content: `\\section{Introduction}

This article demonstrates the LaTeX rendering capabilities.

\\subsection{Basic Text Formatting}

This is \\textbf{bold text}, \\textit{italic text}, \\emph{emphasized text}, and \\underline{underlined text}.

\\subsubsection{Mathematical Expressions}

Inline math: \$E = mc^2\$ and \$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\$

Display math:
\$\$ \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} \$\$

Using \\( \\) notation: \\(a^2 + b^2 = c^2\\)

Using \\[ \\] notation:
\\[ \\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t} \\]

\\section{Advanced Features}

\\subsection{Remark Blocks}

\\begin{remarque}
This is a remark with inline math \$x^2 + y^2 = z^2\$ and display math:
\$\$ \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e \$\$
The remark also supports \\textbf{bold} and \\textit{italic} text.
\\end{remarque}

\\subsection{Complex Equations}

The Schrödinger equation:
\$\$ i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\vec{r},t) = \\hat{H}\\Psi(\\vec{r},t) \$\$

Maxwell\'s equations:
\$\$
\\begin{aligned}
\\nabla \\cdot \\vec{E} &= \\frac{\\rho}{\\epsilon_0} \\\\
\\nabla \\cdot \\vec{B} &= 0 \\\\
\\nabla \\times \\vec{E} &= -\\frac{\\partial \\vec{B}}{\\partial t} \\\\
\\nabla \\times \\vec{B} &= \\mu_0\\vec{J} + \\mu_0\\epsilon_0\\frac{\\partial \\vec{E}}{\\partial t}
\\end{aligned}
\$\$

\\section{Conclusion}

This test demonstrates all the LaTeX rendering features including sections, text formatting, inline and display math, and remark blocks.`
};
