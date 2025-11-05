import { Article } from '../../types';

export const testAlignedEquations: Article = {
  id: 'test-aligned-equations',
  title: 'Testing Aligned Equations',
  date: '2025-11-05',
  summary: 'A test article demonstrating the aligned environment for aligning equations',
  content: `
\\section{Introduction to Aligned Equations}

The \\textbf{aligned} environment allows you to align multiple equations at specific points, making it ideal for multi-step derivations and systems of equations.

\\section{Basic Example}

Here's a simple example aligning two equations at the equals sign:

$$
\\begin{aligned}
x &= a + b \\\\
y &= c + d
\\end{aligned}
$$

\\section{Multi-step Derivation}

When solving or simplifying expressions, aligned equations help show the progression:

$$
\\begin{aligned}
f(x) &= x^2 + 2x + 1 \\\\
     &= x^2 + x + x + 1 \\\\
     &= x(x + 1) + (x + 1) \\\\
     &= (x + 1)(x + 1) \\\\
     &= (x + 1)^2
\\end{aligned}
$$

\\begin{remark}
Notice how the equals signs are perfectly aligned, making the derivation easy to follow.
\\end{remark}

\\section{System of Equations}

Systems of equations look cleaner when aligned:

$$
\\begin{aligned}
2x + 3y - z &= 7 \\\\
x - y + 2z &= 1 \\\\
3x + 2y + z &= 10
\\end{aligned}
$$

\\section{With Text Annotations}

You can also add text annotations to each equation:

$$
\\begin{aligned}
E &= mc^2 & \\text{(Energy-mass equivalence)} \\\\
F &= ma   & \\text{(Newton's second law)} \\\\
p &= mv   & \\text{(Linear momentum)}
\\end{aligned}
$$

\\section{Complex Mathematical Expressions}

The aligned environment works with all LaTeX mathematical notation:

$$
\\begin{aligned}
\\frac{d}{dx}\\left(\\int_0^x f(t)\\,dt\\right) &= f(x) & \\text{(Fundamental theorem)} \\\\
\\int_a^b f'(x)\\,dx &= f(b) - f(a) & \\text{(First part)} \\\\
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} &= \\frac{\\pi^2}{6} & \\text{(Basel problem)}
\\end{aligned}
$$

\\section{Conclusion}

The \\textbf{aligned} environment is a powerful tool for presenting mathematical derivations and systems of equations in a clear, organized manner. It's fully supported in this website through KaTeX rendering.
  `
};
