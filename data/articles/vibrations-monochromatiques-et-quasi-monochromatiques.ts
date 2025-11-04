import { Article } from '../../types';

export const vibrationsMonochromatiquesEtQuasiMonochromatiques: Article = {
  id: 'vibrations-monochromatiques-et-quasi-monochromatiques',
  title: 'Vibrations monochromatiques et quasi monochromatiques',
  date: '2025-11-04',
  summary: 'Une exploration des vibrations monochromatiques et leur rôle fondamental en physique, incluant leurs propriétés mathématiques et leur importance dans la décomposition des signaux complexes.',
  content: `# Vibrations monochromatiques et quasi-monochromatiques

En physique, de nombreux phénomènes peuvent être expliqués par des oscillations ou par la vibration de leur grandeur caractéristique. Le son et les ondes électromagnétiques sont modélisés par des vibrations ; les premiers étant des vibrations mécaniques dans l\'air, et les ondes **EM** étant des vibrations simultanées d\'un champ électrique et d\'un champ magnétique.

## 1. Vibrations monochromatiques

Une vibration monochromatique est représentée par :

\$\$
V(t) = A \\cos(\\omega t - \\phi)
\$\$

où :
- \\(A\\) est l\'amplitude,
- \\(\\omega\\) la pulsation,
- \\(\\phi\\) la phase à l’origine des temps.

Une telle vibration conserve sa forme sinusoïdale lors de la dérivation et de l’intégration.  
Elle correspond donc au mouvement périodique élémentaire dans la nature.

### Représentation complexe

On associe à cette vibration la forme complexe :

\$\$
\\underline{V}(t) = A e^{i\\phi} e^{-i\\omega t}
\$\$

La partie réelle donne la vibration physique :

\$\$
V(t) = \\Re\\left( \\underline{V}(t) \\right)
\$\$

Cette notation permet de simplifier les calculs :  
- la dérivée temporelle devient une multiplication par \\(-i\\omega\\),
- l’intégration devient une division par \\(-i\\omega\\).

### Énergie

L’énergie moyenne transportée par une vibration monochromatique est proportionnelle à :

\$\$
\\varepsilon = \\frac{1}{2} m \\omega_0^2 A^2
\$\$

---

## 2. Vibrations quasi-monochromatiques

Les signaux réels ne sont jamais strictement monochromatiques.  
Ils sont décrits par des vibrations **quasi monochromatiques** de la forme :

\$\$
V(t) = A(t)\\cos(\\omega_0 t - \\phi)
\$\$

où \\(A(t)\\) varie lentement dans le temps.  
On introduit une **durée caractéristique de décroissance** \\(\\tau\\) telle que :

\$\$
A(t) = a e^{-t/\\tau}
\$\$

Cette durée est inversement liée à la largeur spectrale : plus \\(\\tau\\) est grand, plus le signal est monochromatique.

---

## 3. Spectre temporel et transformée de Fourier

La transformée de Fourier d’un signal \\(V(t)\\) est définie par :

\$\$
\\tilde{V}(\\nu) = \\int_{-\\infty}^{+\\infty} \\underline{V}(t) e^{i2\\pi\\nu t} dt
\$\$

Pour un signal tronqué de durée \\(\\tau\\) :

\$\$
A(t) =
\\begin{cases}
a & \\text{si } 0 < t < \\tau, \\\\
0 & \\text{ailleurs.}
\\end{cases}
\$\$

On obtient alors un spectre de la forme :

\$\$
|\\tilde{V}(\\nu)| = a\\tau \\, \\text{sinc} \\left[ \\pi (\\nu - \\nu_0)\\tau \\right]
\$\$

où la largeur du lobe principal vaut approximativement :

\$\$
\\Delta\\nu \\simeq \\frac{1}{\\tau}
\$\$

**Interprétation :**  
Plus la vibration est brève dans le temps, plus son spectre est large en fréquence.  
C’est la manifestation du **principe d’incertitude temps–fréquence**.

---

## 4. Cas amorti : vibration quasi-monochromatique réelle

Pour un signal amorti :

\$\$
A(t) = a e^{-t/\\tau}, \\quad t \\ge 0
\$\$

on obtient :

\$\$
\\tilde{V}(\\nu) = \\frac{a}{1/\\tau + i2\\pi(\\nu - \\nu_0)}
\$\$

Son module :

\$\$
|\\tilde{V}(\\nu)| = \\frac{a}{\\sqrt{(1/\\tau)^2 + [2\\pi(\\nu - \\nu_0)]^2}}
\$\$

présente un **pic de résonance** en \\(\\nu = \\nu_0\\) et une largeur à mi-hauteur :

\$\$
\\Delta\\nu = \\frac{1}{\\pi\\tau}
\$\$

---

### Conclusion

Le passage du cas monochromatique (idéal) au cas quasi-monochromatique (réel) traduit la réalité des phénomènes physiques :  
toute vibration de durée finie possède un spectre élargi, selon la relation fondamentale :

\$\$
\\Delta\\nu \\, \\tau \\approx 1
\$\$

Cette dualité temps–fréquence est à la base de la description des ondes dans de nombreux domaines : acoustique, optique, et mécanique quantique.
`
};
