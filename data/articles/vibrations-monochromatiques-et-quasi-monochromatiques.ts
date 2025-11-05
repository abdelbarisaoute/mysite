import { Article } from '../../types';

export const vibrationsMonochromatiquesEtQuasiMonochromatiques: Article = {
  id: 'vibrations-monochromatiques-et-quasi-monochromatiques',
  title: 'Vibrations monochromatiques et quasi monochromatiques',
  date: '2025-11-04',
  summary: 'Une exploration des vibrations monochromatiques et leur rôle fondamental en physique, incluant leurs propriétés mathématiques et leur importance dans la décomposition des signaux complexes.',
  content: `In physics, many phenomena can be explained by oscillations or by the vibration of their characteristic quantity. Sound and electromagnetic waves are modeled as vibrations; the former being mechanical vibrations in the air, while \\textbf{EM} waves are simultaneous vibrations of an electric and a magnetic field. Light is also an electromagnetic wave, exhibiting characteristics similar to those of a mechanical wave, but capable of propagating in a vacuum. In contrast, sound for example can only propagate through a material medium (as is the case for all mechanical vibrations).

\\textbf{Monochromatic vibrations} or \\textbf{harmonic vibrations} play a central role due to their mathematical simplicity and their ability to decompose any complex signal. This principle is based on \\textbf{Fourier’s theorem}, which states that any periodic signal or function can be expressed as a superposition of sinusoidal waves.

\\section{Monochromatic Vibrations}

\\subsection{Definition}

A monochromatic vibration can be expressed by a sinusoidal function. Let \$V(x)\$ be this sinusoidal function:

\$\$V(t) = A \\cos(\\omega t - \\phi) \\quad \\text{with} \\quad \\begin{cases}
A : & \\text{amplitude} \\\\
\\omega : & \\text{angular frequency} \\\\
\\phi : & \\text{phase delay}
\\end{cases}\$\$

We define the period as \$T = \\frac{2\\pi}{\\omega}\$ and the frequency as \$\\nu = \\frac{1}{T}\$, another common notation for frequency being \$f\$. The function \$V(t)\$ depends only on time, since it describes the vibration of a single point around its equilibrium position.

As mentioned in the introduction of this chapter, the interest of this type of vibration lies in its mathematical simplicity. In physics, relations are generally differential or integral, and these vibrations retain their sinusoidal form under differentiation or integration:

\$\$\\frac{dV(t)}{dt} = -A\\omega \\sin(\\omega t - \\phi) = A\\omega \\cos\\left(\\omega t - \\phi + \\frac{\\pi}{2}\\right)\$\$

\$\$\\int V(t)\\,dt = \\frac{A}{\\omega} \\sin(\\omega t - \\phi) = \\frac{A}{\\omega} \\cos\\left(\\omega t - \\phi - \\frac{\\pi}{2}\\right)\$\$

Thus, the differentiation and integration of a monochromatic vibration only modify its phase, which explains their fundamental role in the modeling of oscillatory and wave phenomena.

\\begin{remark}
The negative sign in \$(\\omega t - \\phi)\$ simply indicates that a larger phase means the vibration reaches its maximum later in time.
\\end{remark}

\\subsection{Complex Expression of the Vibration Function}

The function \$V(t)\$, as we have seen previously, is a function with three parameters, two of which—\$\\omega\$ and \$\\phi\$—always appear in a coupled form. It is therefore more convenient to represent \$V(t)\$ in complex form to simplify mathematical manipulations:

\$\$V(t) = \\mathrm{Re}\\{\\underbar{V}(t)\\} \\quad \\text{with} \\quad \\underbar{V}(t) = A \\exp[-i(\\omega t - \\phi)] = A \\exp(i\\phi)\\exp(-i\\omega t)\$\$

The coefficient \$A e^{i\\phi}\$ is the complex amplitude of the vibration; it combines the real amplitude and the initial phase into a single complex quantity. The factor \$e^{-i\\omega t}\$ represents the harmonic time evolution. This expression also makes the phase delay \$\\phi\$ appear as a positive contribution.

\\begin{remark}
The two conventions \$e^{-i\\omega t}\$ and \$e^{i\\omega t}\$ are mathematically equivalent, provided they are used consistently throughout the calculation. Physically, however, they correspond to two opposite sign conventions in the description of time and propagation. The choice of sign is therefore a mathematical convention without any effect on real physical quantities such as position, velocity, or energy.
\\end{remark}

\\subsection{Energy of a Monochromatic Vibration}

Consider a monochromatic vibration represented by:
\$\$V(t) = A \\cos(\\omega t - \\phi)\$\$
The energy associated with this vibration depends on the physical quantity represented by \$V(t)\$.

In the general case of a harmonic oscillator (mechanical or electrical), two forms of energy are distinguished:
\\begin{itemize}
    \\item The kinetic energy (or magnetic energy for an LC circuit) is proportional to the velocity or to the derivative of \$V(t)\$.
    \\item The potential energy (or electric energy in a capacitor) is proportional to \$V(t)^2\$.
\\end{itemize}

Let us consider a mechanical harmonic oscillator—\\autoref{fig:oscillateur}—composed of a spring with stiffness \$k\$, fixed at one end to an immovable wall and at the other end to a mass \$m\$. This mass slides without friction along a horizontal support, and its motion occurs along the \$(Ox)\$ axis. The mass oscillates around its equilibrium position \$x(t) = 0\$, and it is known that the natural frequency satisfies \$\\omega_0^2 = \\frac{k}{m}\$. In this case, the quantity \$V(t)\$ can be identified with the position:
\$\$x(t) = A \\cos(\\omega_0 t - \\phi).\$\$
`
};
