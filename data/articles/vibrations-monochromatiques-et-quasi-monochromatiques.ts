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

<img src="/mysite/ch2-1-3-harmoscill.png" alt="ch2 1 3 harmoscill" class="max-w-full h-auto rounded-lg shadow-md my-4" />
<figcaption class="text-sm text-gray-600 mt-2 italic">
    Figure 1 – Mouvement de l’oscillateur harmonique
  </figcaption>

The kinetic and potential energies of this oscillator are respectively:

\$\$\\varepsilon_k = \\frac{1}{2} m \\dot{x}^2 = \\frac{1}{2} m \\omega_0^2 A^2 \\sin^2(\\omega t - \\phi) \\quad \\text{and} \\quad \\varepsilon_p = \\frac{1}{2} k x^2 = \\frac{1}{2} k A^2 \\cos^2(\\omega_0 t - \\phi)\$\$

Hence, the total energy:

\$\$\\varepsilon = \\varepsilon_k + \\varepsilon_p = \\frac{1}{2} m \\omega_0^2 A^2\$\$

The total energy of a monochromatic vibration is \\textbf{constant} and proportional to the square of the amplitude \$A\$, or equivalently to the square of the modulus of the complex amplitude of the vibration \$\\underbar{U} = A e^{i\\phi}\$:
\$\$\\varepsilon \\propto A^2 = \\underbar{U} \\, \\underbar{U}^*\$\$

\\begin{remark}
It is important to emphasize that monochromatic vibrations are an idealization. In practice, no real source can produce a strictly monochromatic vibration: every physical source generates a wave whose spectrum has a finite width, however small it may be.
\\end{remark}

\\section{Quasi-Monochromatic Vibrations}

A quasi-monochromatic vibration is a vibration which, unlike the ideal monochromatic vibration, does not oscillate indefinitely with a constant amplitude. Instead, it is modulated by a slow envelope, which causes its amplitude (and possibly its phase) to vary over time. These vibrations are of great interest in optics and wave physics, as they accurately describe real signals emitted by sources that are finite in time.

It can be written in the form:
\$\$V(t) = A(t) \\cos(\\omega_0 t - \\phi)\$\$
where \$A(t)\$ represents the temporal envelope of the vibration, which varies slowly compared to the function \$\\cos(\\omega_0 t - \\phi)\$.




\\begin{example}


<div class="flex gap-4 my-4 flex-wrap">
  <div class="flex-1 min-w-[200px]">
    <img src="/mysite/ch2-2-expl-a.png" alt="ch2 2 expl a" class="w-full h-auto rounded-lg shadow-md" />
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">Figure 1(b) -Truncated Monochromatic Vibration</p>
  </div>
  <div class="flex-1 min-w-[200px]">
    <img src="/mysite/ch2-2-expl-b.png" alt="ch2 2 expl b" class="w-full h-auto rounded-lg shadow-md" />
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic"> Figure 2(b) –Damped vibration</p>
  </div>
</div>

\\textbf{Truncated Monochromatic Vibration:}
\\[
A(t) =
\\begin{cases}
  a, & \\text{for } 0 \\leq t \\leq \\tau, \\quad \\text{with } \\tau \\gg \\dfrac{2\\pi}{\\omega_0},\\\\
  0, & \\text{otherwise.}
\\end{cases}
\\]

\\textbf{Damped Vibration:}
\\[
A(t) =
\\begin{cases}
  a\\,e^{-t/\\tau}, & \\text{for } t \\ge 0,\\ \\text{with } \\tau \\gg \\dfrac{2\\pi}{\\omega_0},\\\\
  0, & \\text{otherwise.}
\\end{cases}
\\]

\\textbf{Monochromatic} vibrations thus appear as a limiting case of \\textbf{quasi-monochromatic} vibrations, when the characteristic decay time \$\\tau \\rightarrow \\infty\$. In this case, the envelope becomes constant and the vibration persists indefinitely.
\\end{example}

\\section{Temporal Spectrum of a Quasi-Monochromatic Vibration}

Thanks to Fourier\'s theorem, we know that any signal or vibration can be expressed as a superposition of sinusoidal vibrations whose frequencies are close to a characteristic angular frequency \$\\omega_0\$.

The temporal spectrum is the \\textbf{frequency representation of the signal}—the vibration—obtained via the Fourier transform.

The temporal spectrum of a vibration \$V(t)\$ is the function \$\\tilde{\\underbar{V}}(\\nu)\$ defined by:

\\[
\\tilde{\\underbar{V}}(\\nu) = \\int_{-\\infty}^{+\\infty} \\underbar{V}(t) e^{i 2 \\pi \\nu t} \\, dt
\\]

or in terms of angular frequency \$\\omega = 2 \\pi \\nu\$:

\\[
\\tilde{\\underbar{V}}(\\nu) = \\int_{-\\infty}^{+\\infty} \\underbar{V}(t) e^{i \\omega t} \\, dt
\\]

From a mathematical point of view, the Fourier integral is defined for any signal \$V(t)\$ integrable over \$\\mathbb{R}\$. But in physics, an infinitely long vibration does not exist; every vibration source emits over a finite duration \$\\tau\$.

\\begin{example}[title={Example: Case of a Monochromatic Vibration—Truncated Sinusoidal Vibration}]
We revisit the case of a truncated sinusoidal vibration:
\$\$
\\begin{aligned}
V(t) &= A(t) \\cos(\\omega_0 t - \\phi) \\quad \\text{with} \\quad
A(t) =
\\begin{cases}
a & \\text{if } 0 \\leq t \\leq \\tau,\\\\
0 & \\text{otherwise.}
\\end{cases}
\\end{aligned}
\$\$

The associated complex form is:
\$\$
\\underbar{V}(t) = A(t)\\, e^{-i(\\omega_0 t - \\phi)}.
\$\$

We then seek the temporal spectrum over the interval \$[0, \\tau]\$:
\$\$
\\begin{aligned}
\\tilde{\\underbar{V}}(\\nu) &= \\int_0^{\\tau} \\underbar{V}(t)\\, e^{i 2\\pi \\nu t}\\, dt \\\\
                           &= \\int_0^{\\tau} a e^{i\\phi} e^{i2\\pi(\\nu - \\nu_0)t}\\, dt \\quad \\text{avec} \\omega_0 = 2\\pi \\nu_0,\\\\
                           &= a e^{i\\phi} \\left[ \\frac{e^{i2\\pi(\\nu - \\nu_0)t}}{i2\\pi(\\nu - \\nu_0)} \\right]_0^{\\tau}\\\\
                           &= a e^{i\\phi} \\frac{e^{i2\\pi(\\nu - \\nu_0)\\tau} - 1}{i2\\pi(\\nu - \\nu_0)}.
\\end{aligned}
\$\$

This expression can be simplified as:

\$\$
\\tilde{\\underbar{V}}(\\nu)= a \\tau e^{i\\phi} e^{i\\pi(\\nu - \\nu_0)\\tau}\\frac{\\sin\\left[\\pi(\\nu - \\nu_0)\\tau\\right]}{\\pi(\\nu - \\nu_0)\\tau}
\$\$

Here, we recognize the \\textbf{sinc function}:
\$\$
sinc(x) = \\frac{\\sin(\\pi x)}{\\pi x}.
\$\$

This function is even and has a main maximum at \$x = 0\$.  
It oscillates around zero with decreasing amplitude following a \$1/x\$ law.  
To study its extrema, we compute:
\$\$
\\frac{d}{dx} sinc(x)
= \\frac{1}{\\pi} \\frac{\\pi x \\cos(\\pi x) - \\sin(\\pi x)}{x^2} = 0.
\$\$
From this, we deduce the condition:
\$\$
\\pi x \\cos(\\pi x) - \\sin(\\pi x) = 0
\\quad \\Leftrightarrow \\quad
\\tan(\\pi x) = \\pi x.
\$\$

<div class="flex gap-4 my-4 flex-wrap">
  <div class="flex-1 min-w-[270px]">
    <img src="/mysite/ch2-3-expl-sinc.png" alt="ch2 3 expl sinc" class="w-full h-auto rounded-lg shadow-md" />
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">Figure 3(a) –The sinc function(normalized sinc function)</p>
  </div>
  <div class="flex-1 min-w-[130px]">
    <img src="/mysite/ch2-3-expl-tan.png" alt="ch2 3 expl tan" class="w-full h-auto rounded-lg shadow-md" />
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">Figure 3(b) –Solutions for the equation \$\\tan(\\pi x)=\\pi x\$</p>
  </div>
</div>

The values of \$x\$ where the derivative vanishes can be determined graphically by the intersections of the curves \$y = \\tan(\\pi x)\$ and \$y\' = \\pi x\$.  
We then obtain:
\$\$
x \\approx k + \\frac{1}{2} \\quad \\text{with} \\quad k \\in \\mathbb{N}^*.
\$\$
Thus, the secondary extrema of the \$sinc(x)\$ function appear at regular intervals of \$\\frac{1}{2}\$ around the main maximum.

\\paragraph{Physical Interpretation.}
The temporal spectrum of a truncated sinusoidal vibration is therefore a \$sinc\$ function, centered on the frequency \$\\nu_0\$.  
The width of the main lobe \$\\Delta \\nu\$ is inversely proportional to the duration \$\\tau\$ of the vibration:
\$\$
\\Delta \\nu \\approx \\frac{1}{\\tau}.
\$\$
In other words, the shorter the vibration in time, the broader its spectrum in the frequency domain.  
This relation illustrates the \\textbf{time–frequency uncertainty principle}:
\$\$
\\Delta \\nu \\cdot \\tau \\approx 1.
\$\$

Thus, the temporal truncation of a pure vibration generates a spectral broadening: a signal of finite duration cannot be strictly monochromatic.

\\end{example}


`
};
