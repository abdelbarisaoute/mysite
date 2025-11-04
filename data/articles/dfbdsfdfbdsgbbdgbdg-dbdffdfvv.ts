import { Article } from '../../types';

export const dfbdsfdfbdsgbbdgbdgDbdffdfvv: Article = {
  id: 'dfbdsfdfbdsgbbdgbdg-dbdffdfvv',
  title: 'dfbdsfdfbdsgbbdgbdg dbdffdfvv',
  date: '2025-11-04',
  summary: 'dfdbsgbsgdbsfg',
  content: `
\\section*{1. Ordre de grandeur et comparaison asymptotique}

\\begin{tcolorbox}[title=Définitions essentielles]
\\begin{itemize}[label=\$\\bullet\$]
  \\item Soient \$f\$ et \$g\$ deux fonctions définies sur un voisinage de \$+\\infty\$ (ou \$0\$).
  \\item On dit que :
  \\begin{itemize}
    \\item \$f = o(g)\$ si \$\\displaystyle \\lim_{x \\to +\\infty} \\frac{f(x)}{g(x)} = 0\$
    \\item \$f \\sim g\$ si \$\\displaystyle \\lim_{x \\to +\\infty} \\frac{f(x)}{g(x)} = 1\$
    \\item \$f = O(g)\$ s’il existe \$C>0\$ tel que \$|f(x)| \\le C|g(x)|\$ pour \$x\$ grand.
  \\end{itemize}
\\end{itemize}
\\end{tcolorbox}

\\section*{2. Fonctions de référence usuelles (croissantes à \$+\\infty\$)}

\\begin{tcolorbox}[title=Hiérarchie classique à l\'infini]
\\[
\\boxed{
\\ln(x) \\ll x^a \\ll a^x \\ll x! \\ll x^x
}
\\]
avec \$a>0\$.

\\begin{itemize}[label=\$\\diamond\$]
  \\item \$\\ln(x)\$ croît plus lentement que toute puissance de \$x\$.
  \\item Toute puissance \$x^a\$ croît plus lentement qu’une exponentielle \$a^x\$.
  \\item Les exponentielles sont dominées par la factorielle \$x!\$ (Stirling : \$x! \\sim \\sqrt{2\\pi x}\\,(x/e)^x\$).
\\end{itemize}
\\end{tcolorbox}

\\section*{3. Fonctions de référence proches de 0}

\\begin{tcolorbox}[title=Comportements usuels près de 0]
\\[
x^n \\ll e^{-1/x} \\quad \\text{et} \\quad \\ln(1+x) \\sim x, \\quad e^x - 1 \\sim x
\\]
\\begin{itemize}[label=\$\\star\$]
  \\item Quand \$x \\to 0^+\$, les fonctions exponentiellement petites \$e^{-1/x}\$ tendent plus vite vers 0 que toute puissance \$x^n\$.
  \\item Les développements limités se basent sur ces ordres de grandeur.
\\end{itemize}
\\end{tcolorbox}

\\section*{4. Exemples typiques}

\\begin{tcolorbox}[title=Exemples de comparaison]
\\[
\\frac{\\ln(x)}{x^\\alpha} \\xrightarrow[x\\to+\\infty]{} 0 \\quad (\\forall \\alpha>0)
\\]
\\[
\\frac{x^a}{e^x} \\xrightarrow[x\\to+\\infty]{} 0 \\quad (\\forall a\\in\\mathbb{R})
\\]
\\[
\\frac{e^x}{x!} \\xrightarrow[x\\to+\\infty]{} 0
\\]
\\end{tcolorbox}
`
};
