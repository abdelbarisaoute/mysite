import { Article } from '../../types';

export const vcdsvvsvs_1762141076559: Article = {
  id: 'vcdsvvsvs-1762141076559',
  title: 'vcdsvvsvs',
  date: '2025-11-03',
  summary: 'dfwgess getgegb',
  content: `En physique, de nombreux phénomènes peuvent être expliqués par des oscillations ou par vibration de leur grandeur caractéristique. Le son et les ondes electromagnétiques sont modélisées par des vibrations; les premiers étant des vibrations mécaniques dans l'air et les ondes \\textbf{EM} étant des vibrations simultanées d'un champ électrique et d'un champ magnétique, la lumière est également une onde électromagnétique, présentant des caractéristiques analogues à celles d’une onde mécanique, mais capable de se propager dans le vide. Contrairement au son par exemple qui ne peut se propager que dans un milieu matériel (c'est le cas pour toutes les vibrations mécaniques). 

Les \\textbf{vibrations monochromatiques} ou \\textbf{vibrations harmoniques} ont un rôle central grâce à leur simplicité mathématique et leur capacité à décomposer tout signal complexe. Ce principe est fondé sur le \\textbf{théorème de Fourier} qui stipule que tout signal ou fonction périodique peut s'exprimer comme une superposition d'ondes sinusoïdales. 

\\section{Vibrations monochromatiques}

\\subsection{Définition}

Une vibration monochromatique peut être exprimée par une fonction sinusoïdale, soit \$V(x)\$ cette fonction sinusoïdale:

\$\$V(t) = A \\cos( \\omega t -\\phi )\\quad \\text{avec} \\quad \\begin{cases}
A : & \\text{l'amplitude}\\\\
\\omega : & \\text{pulsation ou fréquence angulaire} \\\\
\\phi : & \\text{retard de phase}
\\end{cases}\$\$
On définit la période \$ T = \\frac{2\\pi}{\\omega} \$ et la fréquence \$ \\nu = \\frac{1}{T} \$, une autre notation courante de la fréquence est \$f\$. La fonction \$V(t)\$ ne dépend que du temps puisque l’on décrit la vibration d'un seul point autour de son point d'équilibre. 

On a indiqué dans l'introduction de ce chapitre que l'intérêt de ce type de vibrations est leur simplicité mathématique. En physique, les relations sont généralement différentielles ou intégrales, et ces vibrations gardent leurs formes sinusoïdales lors de la dérivation ou de l’intégration:

\$\$ \\frac{dV(t)}{dt} = -A\\omega \\sin(\\omega t -\\phi ) = A \\omega \\cos\\left(\\omega t -\\phi +\\frac{\\pi}{2} \\right)\$\$ 

\$\$ \\int V(t)dt = \\frac{A}{\\omega} \\sin(\\omega t -\\phi) = \\frac{A}{\\omega} \\cos\\left(\\omega t -\\phi -\\frac{\\pi}{2} \\right) \$\$
Ainsi la dérivation et l'intégration d'une vibration monochromatique ne modifie que sa phase, ce qui explique leur rôle fondamental dans la modélisation des phénomènes oscillatoires et ondulatoires.

\\begin{remarque}
Ainsi, le signe négatif dans \$(\\omega t - \\phi)\$ traduit simplement le fait qu’une phase plus grande implique que la vibration atteint son maximum plus tard dans le temps.
\\end{remarque}

\\subsection{Expression complexe de la fonction de vibration}

La fonction \$V(t)\$ comme on a vu précédemment est une fonction avec trois paramètres dont deux-\$\\omega\$ et \$\\phi\$-apparaissent toujours de manière couplée , c'est plus commode donc de représenter \$V(t)\$ sous forme complexe pour simplifier les manipulations mathématiques;

\$\$ V(t) = Re\\{\\underbar{V}(t)\\} \\quad \\text{avec} \\quad \\underbar{V}(t) = A \\exp(-i ( \\omega t -\\phi ) ) = A \\exp( i\\phi) \\exp(-i\\omega t)\$\$

Le coefficient \$ A e^{i\\phi} \$ est l'amplitude complexe de la vibration, il regroupe l'amplitude réelle et la phase initiale dans une seule grandeur complexe, le facteur \$ e^{-i\\omega t} \$ représente l'évolution temporelle harmonique. Elle revient à exprimer positivement le retard de phase \$\\phi\$.

\\begin{remarque}
Les deux conventions \$ e^{-i\\omega t} \$ et \$ e^{i\\omega t} \$ sont mathématiquement équivalentes, à condition d'être utilisées d'une manière cohérente dans tout le calcul. Mais physiquement, elles correspondent à deux conventions de signe opposées dans la description du temps et de la propagation. Le choix de signe est donc une convention mathématique sans effet sur les grandeurs physiques réelles comme la position, la vitesse ou l’énergie.
\\end{remarque}



\\subsection{Energie d'une vibration monochromatique}
On considère une vibration monochromatique représentée par:
\$\$ V(t) = A \\cos( \\omega t - \\phi ) \$\$
L'énergie associée à cette vibration dépend de la grandeur physique représentée par \$V(t)\$.

Dans le cas général de l'oscillateur harmonique (mécanique ou électrique), on distingue deux formes d'énergie:
\\begin{itemize}
	\\item l'énergie cinétique (ou énergie magnétique pour un circuit LC) est proportionnelle à la vitesse ou à la dérivée de \$V(t)\$.
	\\item l'énergie potentielle (ou énergie électrique dans un condensateur) est proportionnelle à \$V(t)^2\$.
\\end{itemize}

On considère un oscillateur harmonique mécanique -\\autoref{fig:oscillateur}- constitué d'un ressort de raideur \$k\$, lié d'une extrémité à un plan inerte et de l'autre extrémité à une masse \$m\$. Cette masse glisse sur le support sans frottement, et son mouvement est suivant l'axe \$(Ox)\$ horizontal. La masse oscille autour de sa position d'équilibre \$x(t) = 0\$, on sait que la fréquence propre est \$\\omega_0^2 = \\frac{k}{m} \$. Dans ce cas, la grandeur \$V(t)\$ peut être identifiée à la position \$x(t) = A \\cos( \\omega_0 t - \\phi )\$.
\\begin{figure}[H] % or [htbp]
  \\centering
  \\begin{tikzpicture}[x=1cm,y=1cm,line cap=round,line join=round] 
    % Mur (hachuré) et sol
    \\fill[gray!20] (-0.8,0) rectangle (0,2);
    \\draw[thick] (0,0) -- (0,2);
    \\foreach \\y in {0.1,0.4,...,1.8} {
      \\draw[gray!60] (-0.8,\\y) -- (0,\\y+0.2);
    }
    \\draw[thick] (-0.8,0) -- (9.5,0);

    % Ressort
    \\coordinate (A) at (0.1,0.75);
    \\coordinate (B) at (5.0,0.75);
    \\draw[line width=0.9pt] (0,0.75) -- (A);
    \\draw[decorate, decoration={coil, aspect=0.4, segment length=6mm, amplitude=4pt}, line width=0.9pt]
      (A) -- (B);
    \\draw[line width=0.9pt] (B) -- (5.4,0.75);

    % Masse
    \\def\\mw{2.2}
    \\def\\mh{1.5}
    \\coordinate (C) at (5.4,0.02);
    \\draw[fill=black!10, thick, rounded corners=2pt] (C) rectangle ++(\\mw,\\mh);
    \\node at (\$(C)+(0.5*\\mw,0.5*\\mh)\$) {\$m\$};

    % Étiquettes et flèches
    \\node[above=6pt] at (\$(A)!0.5!(B)\$) {\$k\$};
    \\draw[->,>=Latex,thick] (7.6,0.75) -- ++(1.0,0) node[right] {\$x(t)\$};
    \\draw[->,>=Latex,thick,red!70!black] (\$(C)+(0.5*\\mw,0.5*\\mh)\$) -- ++(-1.2,0) node[above left] {\$-kx\$};

    % Marqueur d'équilibre (facultatif)
    \\draw[densely dashed,gray] (5.4,0) -- (5.4,2.2) node[above,black] {\$x=0\$};
  \\end{tikzpicture}
  \\caption{Oscillateur harmonique (masse–ressort) avec position \$x(t)\$ et force de rappel \$-kx\$.}
  \\label{fig:oscillateur}
\\end{figure}

Les énergies cinétique et potentielle de cet oscillateur sont respectivement :

\$\$ \\varepsilon_k = \\frac{1}{2} m \\dot{x}^2 = \\frac{1}{2} m \\omega_0^2 A^2 \\sin^2(\\omega t - \\phi ) \\quad \\text{et} \\quad \\varepsilon_p = \\frac{1}{2} k x^2 = \\frac{1}{2}kA^2\\cos^2(\\omega_0 t - \\phi)\$\$

D'où l'énergie totale : 

\$\$ \\varepsilon = \\varepsilon_k + \\varepsilon_p = \\frac{1}{2} m \\omega_0^2A^2\$\$

L'énergie totale d'une vibration monochromatique est \\textbf{constante} et proportionnelle au carré de l’amplitude \$A\$., soit aussi au carré du module de l'amplitude complexe de la vibration \$ \\underbar{U} = A e^{i \\phi }\$: 
\$\$ \\varepsilon \\varpropto A^2 = \\underbar{U} . \\underbar{U}^* \$\$

\\begin{remarque}
Il est important de souligner que les vibrations monochromatiques constituent une idéalisation. En pratique, aucune source réelle ne peut produire une vibration strictement monochromatique : toute source physique génère une onde dont le spectre possède une largeur finie, aussi petite soit-elle.
\\end{remarque}`,
};
