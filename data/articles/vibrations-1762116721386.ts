import { Article } from '../../types';

export const vibrations_1762116721386: Article = {
  id: 'vibrations-1762116721386',
  title: 'vibrations',
  date: '2025-11-02',
  summary: 'sdvsvdv dsdb sd',
  content: `En physique, de nombreux phénomènes peuvent être expliqués par des oscillations ou par vibration de leur grandeur caractéristique. 
Le son et les ondes électromagnétiques sont modélisées par des vibrations; les premiers étant des vibrations mécaniques dans l'air et les ondes EM étant des vibrations simultanées d'un champ électrique et d'un champ magnétique. 
La lumière est également une onde électromagnétique, présentant des caractéristiques analogues à celles d’une onde mécanique, mais capable de se propager dans le vide. 
Contrairement au son, qui ne peut se propager que dans un milieu matériel.

## Vibrations monochromatiques

### Définition
Une vibration monochromatique peut être exprimée par une fonction sinusoïdale:
\$\$ V(t) = A \\\\cos( \\\\omega t - \\\\phi ) \$\$
avec:
- \$A\$ : amplitude
- \$\\\\omega\$ : pulsation ou fréquence angulaire
- \$\\\\phi\$ : retard de phase

La période \$T = \\\\frac{2\\\\pi}{\\\\omega}\$ et la fréquence \$\\\\nu = \\\\frac{1}{T}\$.
La dérivée et l'intégrale d'une vibration monochromatique modifient uniquement sa phase:
\$\$ \\\\frac{dV}{dt} = -A \\\\omega \\\\sin(\\\\omega t - \\\\phi) = A \\\\omega \\\\cos(\\\\omega t - \\\\phi + \\\\frac{\\\\pi}{2}) \$\$
\$\$ \\\\int V(t) dt = \\\\frac{A}{\\\\omega} \\\\sin(\\\\omega t - \\\\phi) = \\\\frac{A}{\\\\omega} \\\\cos(\\\\omega t - \\\\phi - \\\\frac{\\\\pi}{2}) \$\$

### Expression complexe
On peut représenter \$V(t)\$ sous forme complexe:
\$\$ V(t) = \\\\text{Re}\\\\{ \\\\underline{V}(t) \\\\}, \\\\quad \\\\underline{V}(t) = A e^{i\\\\phi} e^{-i\\\\omega t} \$\$

### Énergie d'une vibration monochromatique
Pour un oscillateur harmonique mécanique (masse-ressort):
- Énergie cinétique: \$\$ \\\\varepsilon_k = \\\\frac{1}{2} m \\\\dot{x}^2 = \\\\frac{1}{2} m \\\\omega_0^2 A^2 \\\\sin^2(\\\\omega t - \\\\phi) \$\$
- Énergie potentielle: \$\$ \\\\varepsilon_p = \\\\frac{1}{2} k x^2 = \\\\frac{1}{2} k A^2 \\\\cos^2(\\\\omega t - \\\\phi) \$\$

Énergie totale:
\$\$ \\\\varepsilon = \\\\varepsilon_k + \\\\varepsilon_p = \\\\frac{1}{2} m \\\\omega_0^2 A^2 = A^2 = \\\\underline{U} \\\\cdot \\\\underline{U}^* \$\$

## Vibrations quasi monochromatiques
Une vibration quasi monochromatique est modulée par une enveloppe lente \$A(t)\$:
\$\$ V(t) = A(t) \\\\cos(\\\\omega_0 t - \\\\phi) \$\$

### Exemple : vibration tronquée
\$\$ A(t) =
\\\\begin{cases}
a, & 0 \\\\le t \\\\le \\\\tau, \\\\\\\\
0, & \\\\text{autrement}
\\\\end{cases} \$\$

Le spectre temporel complexe est:
\$\$ \\\\underline{\\\\tilde{V}}(\\\\nu) = a \\\\tau e^{i\\\\phi} e^{i\\\\pi(\\\\nu - \\\\nu_0)\\\\tau} \\\\frac{\\\\sin[\\\\pi(\\\\nu - \\\\nu_0)\\\\tau]}{\\\\pi(\\\\nu - \\\\nu_0)\\\\tau} \$\$

### Exemple : vibration amortie
\$\$ A(t) =
\\\\begin{cases}
a e^{-t/\\\\tau}, & t \\\\ge 0, \\\\\\\\
0, & \\\\text{autrement}
\\\\end{cases} \$\$
\$\$ \\\\underline{\\\\tilde{V}}(\\\\nu) = a e^{i\\\\phi} \\\\tau \\\\left[ U_R(\\\\theta) + i U_I(\\\\theta) \\\\right] \$\$

La magnitude du spectre:
\$\$ |\\\\underline{\\\\tilde{V}}(\\\\nu)| = a \\\\tau \\\\sqrt{ U_R^2(\\\\theta) + U_I^2(\\\\theta) } \$\$

### Remarque
Le déphasage initial \$\\\\phi\$ n'affecte pas le module du spectre temporel, il ne fait que tourner le spectre dans le plan complexe.
\``,
};
