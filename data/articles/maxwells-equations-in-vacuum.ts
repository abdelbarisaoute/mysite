import { Article } from '../../types';

export const maxwellsEquationsInVacuum: Article = {
  id: 'maxwells-equations-in-vacuum',
  title: "Maxwell's Equations and Electromagnetic Waves",
  date: '2024-06-20',
  summary: 'Exploring how Maxwell\'s equations in a vacuum lead to the prediction of electromagnetic waves traveling at the speed of light.',
  content: `Maxwell's equations are a set of four fundamental equations that form the foundation of classical electromagnetism. In a vacuum, where there are no charges or currents, they are:
1. Gauss's Law for Magnetism: $$\\nabla \\cdot \\mathbf{B} = 0$$
2. Faraday's Law of Induction: $$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$
3. Gauss's Law for Electricity: $$\\nabla \\cdot \\mathbf{E} = 0$$
4. Ampère-Maxwell Law: $$\\nabla \\times \\mathbf{B} = \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}$$
By taking the curl of Faraday's Law (2), we get $\\nabla \\times (\\nabla \\times \\mathbf{E}) = -\\frac{\\partial}{\\partial t}(\\nabla \\times \\mathbf{B})$.
Using the vector identity $\\nabla \\times (\\nabla \\times \\mathbf{A}) = \\nabla(\\nabla \\cdot \\mathbf{A}) - \\nabla^2 \\mathbf{A}$ and substituting equations (3) and (4), we arrive at the wave equation for the electric field:
$$ \\nabla^2 \\mathbf{E} = \\mu_0 \\varepsilon_0 \\frac{\\partial^2 \\mathbf{E}}{\\partial t^2} $$
This shows that electromagnetic fields can propagate as waves. The speed of these waves, $c$, is given by $c = 1 / \\sqrt{\\mu_0 \\varepsilon_0}$, which is the speed of light in a vacuum.`
};
