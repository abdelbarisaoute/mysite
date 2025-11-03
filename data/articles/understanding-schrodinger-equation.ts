import { Article } from '../../types';

export const understandingSchrodingerEquation: Article = {
  id: 'understanding-schrodinger-equation',
  title: "A Deep Dive into the Schrödinger Equation",
  date: '2024-07-15',
  summary: 'An introductory post explaining the fundamentals of the time-dependent Schrödinger equation and its significance in quantum mechanics.',
  content: `The Schrödinger equation is a cornerstone of quantum mechanics. The time-dependent version is given by:
$$ i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t) \\right] \\Psi(\\mathbf{r},t) $$
This equation describes how the quantum state of a physical system changes over time. The term $\\Psi(\\mathbf{r},t)$ is the wave function, which contains all the information about the system. 
An important concept is the probability density, given by $|\Psi|^2$. The probability of finding a particle in a volume $V$ is $\\int_V |\\Psi|^2 d^3\\mathbf{r}$.
For a particle in a constant potential (a free particle), $V(\\mathbf{r}, t) = 0$, and the equation simplifies. The solutions are plane waves of the form $\\Psi(\\mathbf{r}, t) = A e^{i(\\mathbf{k} \\cdot \\mathbf{r} - \\omega t)}$, where the wave vector $\mathbf{k}$ is related to momentum $p$ by $\mathbf{p} = \\hbar\\mathbf{k}$ and the angular frequency $\omega$ is related to energy $E$ by $E=\\hbar\\omega$. This leads to the famous energy-momentum relation for a non-relativistic free particle: $E = \\frac{p^2}{2m} = \\frac{\\hbar^2 k^2}{2m}$.`
};
