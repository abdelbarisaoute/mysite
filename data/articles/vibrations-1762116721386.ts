import { Article } from '../../types';

export const vibrations_1762116721386: Article = {
  id: 'vibrations-1762116721386',
  title: 'vibrations',
  date: '2025-11-02',
  summary: 'sdvsvdv dsdb sd',
  content: `En physique, de nombreux phénomènes peuvent être expliqués par des oscillations ou par vibration de leur grandeur caractéristique. Le son et les ondes electromagnétiques sont modélisées par des vibrations; les premiers étant des vibrations mécaniques dans l'air et les ondes \\textbf{EM} étant des vibrations simultanées d'un champ électrique et d'un champ magnétique, la lumière est également une onde électromagnétique, présentant des caractéristiques analogues à celles d’une onde mécanique, mais capable de se propager dans le vide. Contrairement au son par exemple qui ne peut se propager que dans un milieu matériel (c'est le cas pour toutes les vibrations mécaniques). 

Les \\textbf{vibrations monochromatiques} ou \\textbf{vibrations harmoniques} ont un rôle central grâce à leur simplicité mathématique et leur capacité à décomposer tout signal complexe. Ce principe est fondé sur le \\textbf{théorème de Fourier} qui stipule que tout signal ou fonction périodique peut s'exprimer comme une superposition d'ondes sinusoïdales. 

\\\\section{Vibrations monochromatiques}

\\\\subsection{Définition}

Une vibration monochromatique peut être exprimée par une fonction sinusoïdale, soit \$V(x)\$ cette fonction sinusoïdale:

\$\$V(t) = A \\cos( \\omega t -\\phi )\\quad \\text{avec} \\quad \\begin{cases}
A : & \\text{l'amplitude}\\\\
\\omega : & \\text{pulsation ou fréquence angulaire} \\\\
\\phi : & \\text{retard de phase}
\\end{cases}\$\$
On définit la période \$ T = \\frac{2\\pi}{\\omega} \$ et la fréquence \$ \\nu = \\frac{1}{T} \$, une autre notation courante de la fréquence est \$f\$. La fonction \$V(t)\$ ne dépend que du temps puisque l’on décrit la vibration d'un seul point autour de son point d'équilibre. 

On a indiqué dans l'introduction de ce chapitre que l'intérêt de ce type de vibrations est leur simplicité mathématique. En physique, les relations sont généralement différentielles ou intégrales, et ces vibrations gardent leurs formes sinusoïdales lors de la dérivation ou de l’intégration:

\$\$ \\frac{dV(t)}{dt} = -A\\omega \\sin(\\omega t -\\phi ) = A \\omega \\cos\\left(\\omega t -\\phi +\\frac{\\pi}{2} \\right)\$\$ 

\$\$ \\int V(t) = \\frac{A}{\\omega} \\sin(\\omega t -\\phi) = \\frac{A}{\\omega} \\cos\\left(\\omega t -\\phi -\\frac{\\pi}{2} \\right) \$\$
Ainsi la dérivation et l'intégration d'une vibration monochromatique ne modifie que sa phase, ce qui explique leur rôle fondamental dans la modélisation des phénomènes oscillatoires et ondulatoires.

\\\\begin{remarque}
Ainsi, le signe négatif dans \$ ( \\omega t - \\phi ) \$ traduit simplement le fait qu’une phase plus grande implique que la vibration atteint son maximum plus tard dans le temps.
\\\\end{remarque}

\\\\subsection{Expression complexe de la fonction de vibration}

La fonction \$V(t)\$ comme on a vu précédemment est une fonction avec trois paramètres dont deux-\$\\omega\$ et \$\\phi\$-apparaissent toujours de manière couplée , c'est plus commode donc de représenter \$V(t)\$ sous forme complexe pour simplifier les manipulations mathématiques;

\$\$ V(t) = Re\\{\\underbar{V}(t)\\} \\quad \\text{avec} \\quad \\underbar{V}(t) = A \\exp(-i ( \\omega t -\\phi ) ) = A \\exp( i\\phi) \\exp(-i\\omega t)\$\$

Le coefficient \$ A e^{i\\phi} \$ est l'amplitude complexe de la vibration, il regroupe l'amplitude réelle et la phase initiale dans une seule grandeur complexe, le facteur \$ e^{-i\\omega t} \$ représente l'évolution temporelle harmonique. Elle revient à exprimer positivement le retard de phase \$\\phi\$.

\\\\begin{remarque}
Les deux conventions \$ e^{-i\\omega t} \$ et \$ e^{i\\omega t} \$ sont mathématiquement équivalentes, à condition d'être utilisées d'une manière cohérente dans tout le calcul. Mais physiquement, elles correspondent à deux conventions de signe opposées dans la description du temps et de la propagation. Le choix de signe est donc une convention mathématique sans effet sur les grandeurs physiques réelles comme la position, la vitesse ou l’énergie.
\\\\end{remarque}

\\\\subsection{Energie d'une vibration monochromatique}
On considère une vibration monochromatique représentée par:
\$\$ V(t) = A \\cos( \\omega t - \\phi ) \$\$
L'énergie associée à cette vibration dépend de la grandeur physique représentée par \$V(t)\$.

Dans le cas général de l'oscillateur harmonique (mécanique ou électrique), on distingue deux formes d'énergie:
\\\\begin{itemize}
	\\item l'énergie cinétique (ou énergie magnétique pour un circuit LC) est proportionnelle à la vitesse ou à la dérivée de \$V(t)\$.
	\\item l'énergie potentielle (ou énergie électrique dans un condensateur) est proportionnelle à \$V(t)^2\$.
\\\\end{itemize}

On considère un oscillateur harmonique mécanique -\\autoref{fig:oscillateur}- constitué d'un ressort de raideur \$k\$, lié d'une extrémité à un plan inerte et de l'autre extrémité à une masse \$m\$. Cette masse glisse sur le support sans frottement, et son mouvement est suivant l'axe \$(Ox)\$ horizontal. La masse oscille autour de sa position d'équilibre \$x(t) = 0\$, on sait que la fréquence propre est \$\\omega_0^2 = \\frac{k}{m} \$. Dans ce cas, la grandeur \$V(t)\$ peut être identifiée à la position \$x(t) = A \\cos( \\omega_0 t - \\phi )\$.
...
\$\$
\\tilde{\\underline{V}}(\\nu) = \\int^{+\\infty}_{-\\infty} \\underline{V}(t) e^{i 2 \\pi vt} dt
\$\$
ou en fonction de la pulsation \$ \\omega = 2 \\pi \\nu\$ :

\$\$
\\tilde{\\underline{V}}(\\nu) = \\int^{+\\infty}_{-\\infty} \\underline{V}(t) e^{i \\omega t} dt
\$\$

...
`,
};
