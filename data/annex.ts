import { Annex } from '../types';

export const annexData: Annex = {
  id: 'main-annex',
  title: 'Annex',
  parts: [
    {
      id: 'mathematical-constants',
      title: 'Mathematical Constants',
      content: `\\section{Mathematical Constants}\n\nThis section contains common mathematical constants used in various calculations.\n\n| Constant | Symbol | Value |\n|----------|--------|-------|\n| Pi | \$\\pi\$ | 3.14159265359 |\n| Euler's number | \$e\$ | 2.71828182846 |\n| Golden ratio | \$\\phi\$ | 1.61803398875 |\n| Square root of 2 | \$\\sqrt{2}\$ | 1.41421356237 |\n\n\\begin{remarque}\nThese constants are fundamental in mathematics and appear in many formulas.\n\\end{remarque}`
    },
    {
      id: 'trigonometric-identities',
      title: 'Trigonometric Identities',
      content: `\\section{Trigonometric Identities}\n\nEssential trigonometric identities for solving equations.\n\n**Pythagorean Identity:**\n\$\$\\sin^2(\\theta) + \\cos^2(\\theta) = 1\$\$\n\n**Sum Formulas:**\n\$\$\\sin(\\alpha + \\beta) = \\sin(\\alpha)\\cos(\\beta) + \\cos(\\alpha)\\sin(\\beta)\$\$\n\$\$\\cos(\\alpha + \\beta) = \\cos(\\alpha)\\cos(\\beta) - \\sin(\\alpha)\\sin(\\beta)\$\$\n\n**Double Angle Formulas:**\n\$\$\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)\$\$\n\$\$\\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)\$\$`
    },
    {
      id: 'calculus-formulas',
      title: 'Calculus Formulas',
      content: `\\section{Calculus Formulas}\n\nEssential calculus formulas for derivatives and integrals.\n\nDerivative Rules:\n\n| Function | Derivative |\n|----------|------------|\n| \$x^n\$ | \$nx^{n-1}\$ |\n| \$e^x\$ | \$e^x\$ |\n| \$\\ln(x)\$ | \$\\frac{1}{x}\$ |\n| \$\\sin(x)\$ | \$\\cos(x)\$ |\n| \$\\cos(x)\$ | \$-\\sin(x)\$ |\n\nIntegration Rules:\n\$\$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)\$\$\n\$\$\\int e^x dx = e^x + C\$\$\n\$\$\\int \\frac{1}{x} dx = \\ln|x| + C\$\$\n\n\\begin{remarque}\nRemember to add the constant of integration \$C\$ for indefinite integrals.\n\\end{remarque}`
    }
  ]
};
