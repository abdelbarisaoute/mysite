import { Annex } from '../types';

export const annexData: Annex = {
  id: 'main-annex',
  title: 'Annex',
  content: `\\section{Mathematical Tables and Formulas}

This annex contains useful mathematical tables and formulas for reference.

\\subsection{Common Mathematical Constants}

| Constant | Symbol | Value |
|----------|--------|-------|
| Pi | $\\pi$ | 3.14159265359 |
| Euler's number | $e$ | 2.71828182846 |
| Golden ratio | $\\phi$ | 1.61803398875 |
| Square root of 2 | $\\sqrt{2}$ | 1.41421356237 |

\\subsection{Trigonometric Identities}

**Pythagorean Identity:**
$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$$

**Sum Formulas:**
$$\\sin(\\alpha + \\beta) = \\sin(\\alpha)\\cos(\\beta) + \\cos(\\alpha)\\sin(\\beta)$$
$$\\cos(\\alpha + \\beta) = \\cos(\\alpha)\\cos(\\beta) - \\sin(\\alpha)\\sin(\\beta)$$

\\subsection{Calculus Formulas}

**Derivative Rules:**

| Function | Derivative |
|----------|------------|
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
| $\\ln(x)$ | $\\frac{1}{x}$ |
| $\\sin(x)$ | $\\cos(x)$ |
| $\\cos(x)$ | $-\\sin(x)$ |

**Integration Rules:**
$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$$
$$\\int e^x dx = e^x + C$$
$$\\int \\frac{1}{x} dx = \\ln|x| + C$$

\\begin{remarque}
This annex can be edited from the admin dashboard to add your own tables and formulas.
\\end{remarque}`
};
