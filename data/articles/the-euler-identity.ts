import { Article } from '../../types';

export const theEulerIdentity: Article = {
  id: 'the-euler-identity',
  title: 'The Beauty of Euler\'s Identity',
  date: '2024-05-01',
  summary: 'A short article celebrating what is often called the most beautiful equation in mathematics, connecting five fundamental mathematical constants.',
  content: `Euler's identity is a remarkable equation in mathematics:
$$ e^{i\\pi} + 1 = 0 $$
This identity links five fundamental mathematical constants:
- $e$, Euler's number, the base of natural logarithms.
- $i$, the imaginary unit, which satisfies $i^2 = -1$.
- $\\pi$, the ratio of a circle's circumference to its diameter.
- $1$, the multiplicative identity.
- $0$, the additive identity.

It is a special case of Euler's formula, which states that for any real number $x$:
$$ e^{ix} = \\cos x + i \\sin x $$
When we set $x = \\pi$, we know that $\\cos \\pi = -1$ and $\\sin \\pi = 0$.
Substituting these values gives:
$e^{i\\pi} = -1 + i(0)$
$e^{i\\pi} = -1$
And rearranging this gives the elegant identity $e^{i\\pi} + 1 = 0$. Its beauty lies in its simplicity and the profound connection it reveals between different branches of mathematics.`
};
