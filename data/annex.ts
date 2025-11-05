import { Annex } from '../types';

export const annexData: Annex = {
  id: 'main-annex',
  title: 'Annex',
  parts: [
    {
      id: 'mathematical-constants',
      title: 'Mathematical Constants',
      content: `\\section{Mathematical Constants}

This section contains common mathematical constants used in various calculations.

| Constant | Symbol | Value |
|----------|--------|-------|
| Pi | $\\pi$ | 3.14159265359 |
| Euler's number | $e$ | 2.71828182846 |
| Golden ratio | $\\phi$ | 1.61803398875 |
| Square root of 2 | $\\sqrt{2}$ | 1.41421356237 |

\\begin{remarque}
These constants are fundamental in mathematics and appear in many formulas.
\\end{remarque}`
    },
    {
      id: 'trigonometric-identities',
      title: 'Trigonometric Identities',
      content: `\\section{Trigonometric Identities}

Essential trigonometric identities for solving equations.

**Pythagorean Identity:**
$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$$

**Sum Formulas:**
$$\\sin(\\alpha + \\beta) = \\sin(\\alpha)\\cos(\\beta) + \\cos(\\alpha)\\sin(\\beta)$$
$$\\cos(\\alpha + \\beta) = \\cos(\\alpha)\\cos(\\beta) - \\sin(\\alpha)\\sin(\\beta)$$

**Double Angle Formulas:**
$$\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)$$
$$\\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)$$`
    },
    {
      id: 'calculus-formulas',
      title: 'Calculus Formulas',
      content: `\\section{Calculus Formulas}

Essential calculus formulas for derivatives and integrals.

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
Remember to add the constant of integration $C$ for indefinite integrals.
\\end{remarque}`
    }
  ]
};
