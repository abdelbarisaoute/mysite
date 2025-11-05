import { Article } from '../../types';

export const vibrationsMonochromatiquesEtQuasiMonochromatiques: Article = {
  id: 'vibrations-monochromatiques-et-quasi-monochromatiques',
  title: 'Vibrations monochromatiques et quasi monochromatiques',
  date: '2025-11-04',
  summary: 'Une exploration des vibrations monochromatiques et leur rôle fondamental en physique, incluant leurs propriétés mathématiques et leur importance dans la décomposition des signaux complexes.',
  content: `En physique, de nombreux phénomènes peuvent être expliqués par des oscillations ou par vibration de leur grandeur caractéristique. Le son et les ondes electromagnétiques sont modélisées par des vibrations; les premiers étant des vibrations mécaniques dans l\'air et les ondes \\textbf{EM} étant des vibrations simultanées d\'un champ électrique et d\'un champ magnétique, la lumière est également une onde électromagnétique, présentant des caractéristiques analogues à celles d’une onde mécanique, mais capable de se propager dans le vide. Contrairement au son par exemple qui ne peut se propager que dans un milieu matériel (c\'est le cas pour toutes les vibrations mécaniques). 

Les \\textbf{vibrations monochromatiques} ou \\textbf{vibrations harmoniques} ont un rôle central grâce à leur simplicité mathématique et leur capacité à décomposer tout signal complexe. Ce principe est fondé sur le \\textbf{théorème de Fourier} qui stipule que tout signal ou fonction périodique peut s\'exprimer comme une superposition d\'ondes sinusoïdales. 

\\section{Vibrations monochromatiques}

\\subsection{Définition}

Une vibration monochromatique peut être exprimée par une fonction sinusoïdale, soit \$V(x)\$ cette fonction sinusoïdale:

\$\$V(t) = A \\cos( \\omega t -\\phi )\\quad \\text{avec} \\quad \\begin{cases}
A : & \\text{l\'amplitude}\\\\
\\omega : & \\text{pulsation ou fréquence angulaire} \\\\
\\phi : & \\text{retard de phase}
\\end{cases}\$\$
On définit la période \$ T = \\frac{2\\pi}{\\omega} \$ et la fréquence \$ \\nu = \\frac{1}{T} \$, une autre notation courante de la fréquence est \$f\$. La fonction \$V(t)\$ ne dépend que du temps puisque l’on décrit la vibration d\'un seul point autour de son point d\'équilibre. 

On a indiqué dans l\'introduction de ce chapitre que l\'intérêt de ce type de vibrations est leur simplicité mathématique. En physique, les relations sont généralement différentielles ou intégrales, et ces vibrations gardent leurs formes sinusoïdales lors de la dérivation ou de l’intégration:

\$\$ \\frac{dV(t)}{dt} = -A\\omega \\sin(\\omega t -\\phi ) = A \\omega \\cos\\left(\\omega t -\\phi +\\frac{\\pi}{2} \\right)\$\$ 

\$\$ \\int V(t)dt = \\frac{A}{\\omega} \\sin(\\omega t -\\phi) = \\frac{A}{\\omega} \\cos\\left(\\omega t -\\phi -\\frac{\\pi}{2} \\right) \$\$
Ainsi la dérivation et l\'intégration d\'une vibration monochromatique ne modifie que sa phase, ce qui explique leur rôle fondamental dans la modélisation des phénomènes oscillatoires et ondulatoires.

\\begin{remarque}
Ainsi, le signe négatif dans \$ ( \\omega t - \\phi ) \$ traduit simplement le fait qu’une phase plus grande implique que la vibration atteint son maximum plus tard dans le temps.
\\end{remarque}

\\subsection{Expression complexe de la fonction de vibration}

La fonction \$V(t)\$ comme on a vu précédemment est une fonction avec trois paramètres dont deux-\$\\omega\$ et \$\\phi\$-apparaissent toujours de manière couplée , c\'est plus commode donc de représenter \$V(t)\$ sous forme complexe pour simplifier les manipulations mathématiques;

\$\$ V(t) = Re\\{\\underbar{V}(t)\\} \\quad \\text{avec} \\quad \\underbar{V}(t) = A \\exp(-i ( \\omega t -\\phi ) ) = A \\exp( i\\phi) \\exp(-i\\omega t)\$\$

Le coefficient \$ A e^{i\\phi} \$ est l\'amplitude complexe de la vibration, il regroupe l\'amplitude réelle et la phase initiale dans une seule grandeur complexe, le facteur \$ e^{-i\\omega t} \$ représente l\'évolution temporelle harmonique. Elle revient à exprimer positivement le retard de phase \$\\phi\$.

\\begin{remarque}
Les deux conventions \$ e^{-i\\omega t} \$ et \$ e^{i\\omega t} \$ sont mathématiquement équivalentes, à condition d\'être utilisées d\'une manière cohérente dans tout le calcul. Mais physiquement, elles correspondent à deux conventions de signe opposées dans la description du temps et de la propagation. Le choix de signe est donc une convention mathématique sans effet sur les grandeurs physiques réelles comme la position, la vitesse ou l’énergie.
\\end{remarque}



\\subsection{Energie d\'une vibration monochromatique}
On considère une vibration monochromatique représentée par:
\$\$ V(t) = A \\cos( \\omega t - \\phi ) \$\$
L\'énergie associée à cette vibration dépend de la grandeur physique représentée par \$V(t)\$.

Dans le cas général de l\'oscillateur harmonique (mécanique ou électrique), on distingue deux formes d\'énergie:
\\begin{itemize}
	\\item l\'énergie cinétique (ou énergie magnétique pour un circuit LC) est proportionnelle à la vitesse ou à la dérivée de \$V(t)\$.
	\\item l\'énergie potentielle (ou énergie électrique dans un condensateur) est proportionnelle à \$V(t)^2\$.
\\end{itemize}

On considère un oscillateur harmonique mécanique -\\autoref{fig:oscillateur}- constitué d\'un ressort de raideur \$k\$, lié d\'une extrémité à un plan inerte et de l\'autre extrémité à une masse \$m\$. Cette masse glisse sur le support sans frottement, et son mouvement est suivant l\'axe \$(Ox)\$ horizontal. La masse oscille autour de sa position d\'équilibre \$x(t) = 0\$, on sait que la fréquence propre est \$\\omega_0^2 = \\frac{k}{m} \$. Dans ce cas, la grandeur \$V(t)\$ peut être identifiée à la position \$x(t) = A \\cos( \\omega_0 t - \\phi )\$.
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

    % Marqueur d\'équilibre (facultatif)
    \\draw[densely dashed,gray] (5.4,0) -- (5.4,2.2) node[above,black] {\$x=0\$};
  \\end{tikzpicture}
  \\caption{Oscillateur harmonique (masse–ressort) avec position \$x(t)\$ et force de rappel \$-kx\$.}
  \\label{fig:oscillateur}
\\end{figure}

Les énergies cinétique et potentielle de cet oscillateur sont respectivement :

\$\$ \\varepsilon_k = \\frac{1}{2} m \\dot{x}^2 = \\frac{1}{2} m \\omega_0^2 A^2 \\sin^2(\\omega t - \\phi ) \\quad \\text{et} \\quad \\varepsilon_p = \\frac{1}{2} k x^2 = \\frac{1}{2}kA^2\\cos^2(\\omega_0 t - \\phi)\$\$

D\'où l\'énergie totale : 

\$\$ \\varepsilon = \\varepsilon_k + \\varepsilon_p = \\frac{1}{2} m \\omega_0^2A^2\$\$

L\'énergie totale d\'une vibration monochromatique est \\textbf{constante} et proportionnelle au carré de l’amplitude \$A\$., soit aussi au carré du module de l\'amplitude complexe de la vibration \$ \\underbar{U} = A e^{i \\phi }\$: 
\$\$ \\varepsilon \\varpropto A^2 = \\underbar{U} . \\underbar{U}^* \$\$

\\begin{remarque}
Il est important de souligner que les vibrations monochromatiques constituent une idéalisation. En pratique, aucune source réelle ne peut produire une vibration strictement monochromatique : toute source physique génère une onde dont le spectre possède une largeur finie, aussi petite soit-elle.
\\end{remarque}

\\section{Vibrations quasi monochromatiques}

Une vibration quasi monochromatique est une vibration qui, contrairement à la vibration monochromatique idéale, n’oscille pas indéfiniment avec une amplitude constante.
Elle est au contraire modulée par une enveloppe lente, qui fait varier son amplitude (et éventuellement sa phase) au cours du temps. Ces vibrations sont d’un grand intérêt en optique et en physique des ondes, car elles décrivent fidèlement les signaux réels émis par des sources finies dans le temps.

On peut l’écrire sous la forme :
\$\$ V(t) = A(t) \\cos(\\omega_0 t - \\phi) \$\$
\$A(t)\$ représente l\'enveloppe temporelle de la vibration, qui varie lentement par rapport à la fonction \$\\cos( \\omega_0t - \\phi)\$.



% --- Example usages: paste inside the document body where you want an example box ---
% Simple example (default title)
\\begin{exemple}
  \\captionsetup{type=figure}
  \\centering

  \\begin{subfigure}[t]{0.48\\linewidth}
    \\centering
    \\includegraphics[width=\\linewidth]{C:/Users/abdel/Desktop/book/Figures/CH2_2.2/Ch2_2-Expl_a.png}
    \\caption{}
    \\label{fig:a}
  \\end{subfigure}\\hfill
  \\begin{subfigure}[t]{0.48\\linewidth}
    \\centering
    \\includegraphics[width=\\linewidth]{C:/Users/abdel/Desktop/book/Figures/CH2_2.2/Ch2_2-Expl_b.png}
    \\caption{}
    \\label{fig:b}
  \\end{subfigure}

  \\caption{Comparaison entre une vibration monochromatique (a) et une vibration quasi monochromatique (b).}
  \\label{fig:side-by-side}

  \\vspace{1em}
  \\newlength{\\exgap}
  \\setlength{\\exgap}{1em}

  \\noindent
  \\begin{minipage}[t]{\\dimexpr(.5\\linewidth - .5\\exgap)\\relax}
    \\small
    \\textbf{Vibration monochromatique non amortie :}
    \\[
    A(t) =
    \\begin{cases}
      a, & \\text{pour } 0 \\leq t \\leq \\tau, \\quad \\text{avec } \\tau \\gg \\dfrac{2\\pi}{\\omega_0},\\\\
      0, & \\text{autrement.}
    \\end{cases}
    \\]
  \\end{minipage}\\hspace{\\exgap}%
  \\begin{minipage}[t]{\\dimexpr(.5\\linewidth - .5\\exgap)\\relax}
    \\small
    \\textbf{Vibration amortie :}
    \\[
    A(t) =
    \\begin{cases}
      a\\,e^{-t/\\tau}, & \\text{pour } t \\ge 0,\\ \\text{avec } \\tau \\gg \\dfrac{2\\pi}{\\omega_0},\\\\
      0, & \\text{autrement.}
    \\end{cases}
    \\]
  \\end{minipage}

  \\vspace{1em}
  \\noindent
  Les vibrations \\textbf{monochromatiques} apparaissent ainsi comme un cas limite des vibrations \\textbf{quasi monochromatiques}, lorsque la durée caractéristique de décroissance \$\\tau \\rightarrow \\infty\$. 
  Dans ce cas, l’enveloppe devient constante et la vibration persiste indéfiniment.
\\end{exemple}


% If you want figure captions inside the box, load \\usepackage{caption} in the preamble
% and use \\captionof{figure}{...} (works fine inside the tcolorbox).































\\section{Spectre temporel d\'une vibration quasi monochromatique}

Grâce au théorème de Fourier, on sait que tout signal ou vibration peut s\'exprimer comme une superposition de vibrations sinusoïdales dont les fréquences sont voisines d\'une pulsation propre \$\\omega_0\$.

Le spectre temporel est la \\textbf{représentation fréquentielle du signal}-la vibration-obtenue par la transformée de Fourier. 

Le spectre temporel d\'une vibration \$V(t)\$ est la fonction \$\\tilde{\\underline{V}}(\\nu)\$ définit par:

\\[
\\tilde{\\underline{V}}(\\nu) = \\int^{+\\infty}_{-\\infty} \\underline{V}(t) e^{i 2 \\pi vt} dt
\\]
ou en fonction de la pulsation \$ \\omega = 2 \\pi \\nu\$ :

\\[
\\tilde{\\underline{V}}(\\nu) = \\int^{+\\infty}_{-\\infty} \\underline{V}(t) e^{i \\omega t} dt
\\]

D\'un point de vue mathématique, l\'intégrale de  Fourier est définie pour tout signal \$V(t)\$ intégrable sur \$\\mathbb{R}\$. Mais en physique, il n\'existe pas une vibration infinie sur le temps, toute source de vibration émet sur une durée \$\\tau\$ finie.


\\begin{exemple}[title={Exemple : Cas d’une vibration monochromatique-vibration sinusoïdale tronquée-}]
On reprend le cas d’une vibration sinusoïdale tronquée :
\\[
\\begin{aligned}
V(t) &= A(t) \\cos(\\omega_0 t - \\phi) \\quad \\text{avec} \\quad
A(t) =
\\begin{cases}
a & \\text{si } 0 \\leq t \\leq \\tau,\\\\
0 & \\text{autrement.}
\\end{cases}
\\end{aligned}
\\]

La forme complexe associée est :
\\[
\\underline{V}(t) = A(t)\\, e^{-i(\\omega_0 t - \\phi)}.
\\]

On cherche alors le spectre temporel sur l’intervalle \$[0, \\tau]\$ :
\\[
\\begin{aligned}
\\underline{\\tilde{V}}(\\nu)
&= \\int_0^{\\tau} \\underline{V}(t)\\, e^{i 2\\pi \\nu t}\\, dt \\\\
&= \\int_0^{\\tau} a e^{i\\phi} e^{i2\\pi(\\nu - \\nu_0)t}\\, dt
\\quad \\text{avec } \\omega_0 = 2\\pi \\nu_0,\\\\
&= a e^{i\\phi} \\left[ \\frac{e^{i2\\pi(\\nu - \\nu_0)t}}{i2\\pi(\\nu - \\nu_0)} \\right]_0^{\\tau}
= a e^{i\\phi} \\frac{e^{i2\\pi(\\nu - \\nu_0)\\tau} - 1}{i2\\pi(\\nu - \\nu_0)}.
\\end{aligned}
\\]

On simplifie cette expression :
\\[
\\underline{\\tilde{V}}(\\nu)
= a \\tau e^{i\\phi} e^{i\\pi(\\nu - \\nu_0)\\tau}
\\frac{\\sin\\left[\\pi(\\nu - \\nu_0)\\tau\\right]}{\\pi(\\nu - \\nu_0)\\tau}.
\\]

On reconnaît ici la fonction \\textbf{sinus cardinal} :
\\[
sinc(x) = \\frac{\\sin(\\pi x)}{\\pi x}.
\\]

Cette fonction est paire et possède un maximum principal en \$x = 0\$.  
Elle oscille autour de zéro en décroissant en amplitude selon une loi en \$1/x\$.  
Pour étudier ses extrema, on calcule :
\\[
\\frac{d}{dx} sinc(x)
= \\frac{1}{\\pi} \\frac{\\pi x \\cos(\\pi x) - \\sin(\\pi x)}{x^2} = 0.
\\]
On en déduit la condition :
\\[
\\pi x \\cos(\\pi x) - \\sin(\\pi x) = 0
\\quad \\Leftrightarrow \\quad
\\tan(\\pi x) = \\pi x.
\\]



\\captionsetup{type=figure}
\\centering

\\begin{subfigure}[t]{0.64\\linewidth}
  \\centering
  \\includegraphics[width=\\linewidth]{C:/Users/abdel/Desktop/book/Figures/CH2_2.2/Ch2_3-Expl_sinc.png}
  \\caption{}
  \\label{fig:sinc}
\\end{subfigure}\\hfill
\\begin{subfigure}[t]{0.36\\linewidth}
  \\centering
  \\includegraphics[width=\\linewidth]{C:/Users/abdel/Desktop/book/Figures/CH2_2.2/Ch2_3-Expl_tan.png}
  \\caption{}
  \\label{fig:tan}
\\end{subfigure}

\\caption{(a) Fonction sinus cardinal \$sinc(x)\$ ; (b) Solutions de l’équation \$\\tan(\\pi x) = \\pi x\$.}
\\label{fig:sinc_tan}

\\begin{flushleft}
Les valeurs de \$x\$ pour lesquelles la dérivée s’annule peuvent être déterminées graphiquement par les intersections des courbes \$y = \\tan(\\pi x)\$ et \$y\' = \\pi x\$ (\\autoref{fig:tan}).  
On obtient alors :
\\[
x \\approx k + \\frac{1}{2} \\quad \\text{avec} \\quad k \\in \\mathbb{N}^*.
\\]
Ainsi, les extrema secondaires de la fonction \$sinc(x)\$ apparaissent à des intervalles réguliers de \$\\frac{1}{2}\$ autour du maximum principal.
\\end{flushleft}

\\vspace{1em}

\\paragraph{Interprétation physique.}
Le spectre temporel d’une vibration sinusoïdale tronquée est donc une fonction \$sinc\$, centrée sur la fréquence \$\\nu_0\$.  
La largeur de la lobe principale \$\\Delta \\nu\$ est inversement proportionnelle à la durée \$\\tau\$ de la vibration :

\\[
\\Delta \\nu \\approx \\frac{1}{\\tau}.
\\]
Autrement dit, plus la vibration est courte dans le temps, plus son spectre est large dans le domaine fréquentiel.  
Cette relation illustre le \\textbf{principe d’incertitude temps–fréquence} :
\\[
\\Delta \\nu \\cdot \\tau \\approx 1.
\\]

Ainsi, la troncature temporelle d’une vibration pure engendre un élargissement spectral : un signal de durée finie ne peut être strictement monochromatique.

\\end{exemple}


\\begin{exemple}[title={Exemple : Cas d\'une vibration quasi monochromatique-vibration amortie-}]

On reprend l\'exemple en le cas d\'une vibration quasi monochromatique amortie; 
\\[
\\begin{aligned}
V(t) & = A(t) \\cos(\\omega_0 t - \\phi) \\quad \\text{et} \\quad A(t) =
\\begin{cases}
a e^{-t/\\tau} & \\quad \\text{avec} \\quad t \\geqslant 0 \\\\
0 & \\quad \\text{autrement}
\\end{cases} \\\\
\\underline{V}(t) & = A(t) \\exp\\left(-i(\\omega_0 t -\\phi) \\right)
\\end{aligned}
\\]
On cherche le spectre temporel sur un intervalle \$[0,\\tau]\$;
\\[
\\begin{aligned}
	\\underline{\\tilde{V}}(\\nu) & = \\int^{\\tau}_{0} \\underline{V}(t) e^{i2\\pi \\nu t} dt \\\\
	& = \\int^{\\tau}_{0} a e^{-t/\\tau} e^{i2\\pi \\nu t - i \\omega_0 t} e^{i\\phi}dt \\\\
	& = a e^{i\\phi} \\int^{\\tau}_{0} e^{(2i\\pi \\nu - \\omega_0 i - 1/\\tau) t } dt \\\\
	& = a e^{i\\phi} \\left[ \\frac{e^{(2i\\pi \\nu - \\omega_0 i - 1/\\tau) t }}{2i\\pi \\nu - \\omega_0 i - 1/\\tau}        \\right]^{\\tau}_{0} \\\\
	& = ae^{i\\phi} \\frac{e^{(2i\\pi \\nu - \\omega_0 i - 1/\\tau) \\tau } - 1}{  2i\\pi \\nu - \\omega_0 i - 1/\\tau} 
\\end{aligned}
\\]
On pose \$ \\theta = ( \\nu - \\nu_0 ) 2\\pi  \\tau \$ avec \$ \\omega_0 = 2\\pi \\nu_0\$ ;
\\[
\\begin{aligned}
	\\underline{\\tilde{V}}(\\nu) & = ae^{i\\phi}\\tau \\frac{e^{-1} e^{i\\theta}-1}{i\\theta- 1}\\\\
	& = a e^{i\\phi} \\tau \\frac{-(e^{-1}e^{i\\theta} - 1) (1+i\\theta) }{1+\\theta^2}\\\\
	& = a e^{i\\phi} \\tau \\frac{1 + i\\theta - i\\theta e^{-1}e^{i\\theta} - e^{-1}e^{i\\theta} }{1 + \\theta^2} \\\\
	& = \\frac{a e^{i\\phi} \\tau }{1 + \\theta^2} \\left( 1 + i\\theta - i\\theta e^{-1} (\\cos(\\theta) + i \\sin(\\theta)) - e^{-1} (\\cos(\\theta) + i \\sin(\\theta) \\right) \\\\
	& = a e^{i\\phi} \\tau \\left[ \\underbrace{ \\frac{\\left( 1 - e^{-1} \\cos(\\theta) + \\theta e^{-1} \\sin(\\theta) \\right)}{1 + \\theta^2}}_{U_R(\\theta)} + i \\underbrace{\\frac{\\left( \\theta - e^{-1} \\sin(\\theta) - \\theta e^{-1} \\cos(\\theta) \\right)}{1 + \\theta^2}}_{U_I(\\theta)} \\right]\\\\
	\\underline{\\tilde{V}}(\\nu) & = a e^{i\\phi} \\tau \\left[ U_R(\\theta) + i U_I(\\theta) \\right]
\\end{aligned}
\\]
Et le module du spectre temporel est ;
\\[
|\\underline{\\tilde{V}}(\\nu)| = a \\tau \\sqrt{U_R^2(\\theta) + U_I^2(\\theta)} \\quad \\text{or,} \\quad |e^{i\\phi}| = 1
\\]
\\captionsetup{type=figure}
  \\centering

  % --- single image replacing the two subfigures ---
  % keep using \\captionsetup{type=figure} so this is not a floating figure
  % (safe inside the \'exemple\' boxed environment)
  \\includegraphics[width=0.8\\linewidth]{C:/Users/abdel/Desktop/book/Figures/CH2_2.2/Ch2_3-Expl_Vtilde_3Dplt.png}
  \\caption{Courbe 3D du spectre temporel complexe de la vibration quasi monochromatique amortie.}
  \\label{fig:vtilde_3dplt}
  \\vspace{1em}
  \\setlength{\\exgap}{1em}
  
 \\begin{flushleft}
 La \\autoref{fig:vtilde_3dplt} est la représentation graphique du spectre temporelle complexe de la vibration amortie, on observe que la courbe oscille au voisinage d\'un \$\\theta=0\$, c\'est autour la fréquence de résonance.
 \\end{flushleft} 
\\begin{itemize}
	\\item A la résonance \$\\nu = \\nu_0\$ donc \$\\theta = 0\$;
\\[
U_R(0) = 1 - e^{-1} \\quad \\text{et} \\quad U_I(0) = 0
\\]
Le spectre est maximum et purement réel à la résonance.
	\\item Loin de la résonance \$ |\\theta| \\gg 0 \$ les termes dominants sont ;
\\begin{align*}
	U_R(\\theta) \\approx \\frac{\\theta e^{-1} \\sin(\\theta)}{1+\\theta^2} \\sim \\frac{e^{-1} \\sin(\\theta) }{\\theta}\\\\
	U_I(\\theta) \\approx \\frac{\\theta - \\theta e^{-1} \\cos(\\theta)}{1+\\theta^2} \\sim \\frac{1 - e^{-1} \\cos(\\theta)}{\\theta}
\\end{align*}
Les deux composantes décroissent comme \$1/\\theta\$.
\\vspace{1em}
\\begin{center}
\\captionsetup{type=figure}
  % --- single image replacing the two subfigures ---
  % keep using \\captionsetup{type=figure} so this is not a floating figure
  % (safe inside the \'exemple\' boxed environment)
  \\includegraphics[width=0.9\\linewidth]{C:/Users/abdel/Desktop/book/Figures/CH2_2.2/Ch2_3-Expl_Vtilde_curves.png}
  \\caption{Composantes et représentation complexe de \$\\underline{\\tilde{V}}(\\nu)\$ }
  \\label{fig:vtilde_curvs}
  \\end{center}
  \\vspace{1em}
	\\item Dans la \\autoref{fig:vtilde_curvs} on a une représentation des composantes du spectre temporel complexe \$\\underline{\\tilde{V}}(\\nu)\$, la représentation complexe de \$\\underline{\\tilde{V}}(\\nu)\$ est la projection de la courbe dans la \\autoref{fig:vtilde_3dplt} dans le plan complexe. Cette représentation nous permet de visualiser le retard de phase \$\\phi\$, la courbe devrait être symétrique par rapport à l\'axe des composantes réelles \$Re[\\underline{\\tilde{V}}(\\theta)]\$ quand \$\\phi\$ est nulle (il ne faut pas oublier que les fonctions \$\\underline{\\tilde{V}}(\\nu)\$ et \$\\underline{\\tilde{V}}(\\theta)\$ sont analogues et la différence est pour la simplification car c\'est plus simple de prendre \$\\theta\$ comme variable que de prendre \$(\\nu - \\nu_0) \$). 
	\\item D\'autre part, la courbe de la magnitude du spectre temporel de \$\\underline{V}(\\nu)\$ est particulièrement important car il représente
directement l\'amplitude de chaque composante fréquentielle du signal. Son carré, \$|\\tilde{\\underline{V}}(\\nu)|^2\$, est appelé
\\textbf{Densité Spectrale d\'Énergie} (DSE) qui indique la répartition de l’énergie du signal dans le domaine fréquentiel.

\\end{itemize}
\\end{exemple}

\\begin{remarque}


Comme on l’a observé dans les deux exemples précédents, le spectre temporel d’une vibration ne dépend pas du déphasage initial. 
En effet, un déphasage \$\\phi\$ se traduit simplement par la multiplication du spectre par la constante complexe \$e^{i\\phi}\$, ce qui correspond à une simple rotation du spectre dans le plan complexe. Le module et la répartition fréquentielle - c’est-à-dire la largeur spectrale - restent strictement inchangés. 

Cette propriété pourrait être mentionnée après le calcul du module du spectre temporel, mais il est plus instructif de l’illustrer graphiquement-\\autoref{fig:vtilde_cplx_phiVals}-afin de bien comprendre que le déphasage n’a aucune influence sur la structure fréquentielle du signal.  
\\vspace{1em}
\\begin{center}
\\captionsetup{type=figure}
  % --- single image replacing the two subfigures ---
  % keep using \\captionsetup{type=figure} so this is not a floating figure
  % (safe inside the \'exemple\' boxed environment)
  \\includegraphics[width=0.9\\linewidth]{C:/Users/abdel/Desktop/book/Figures/CH2_2.2/Ch2_3-Rem_2.4_phiVals.png}
  \\caption{Représentation complexe de \$\\underline{\\tilde{V}}(\\nu)\$ pour différentes valeurs de \$\\phi\$}
  \\label{fig:vtilde_cplx_phiVals}
  \\end{center}
\\end{remarque}
`
};
