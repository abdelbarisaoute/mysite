import { Resume } from '../types';

export const resumeData: Resume = {
  id: 'main-resume',
  name: 'Abdelbari Saoutelhak',
  contact: '<a href="mailto:abdelbarisaoutelhak@gmail.com">abdelbarisaoutelhak@gmail.com</a> | <a href="https://linkedin.com/in/abdelbari-saoutelhak">linkedin.com/in/abdelbari-saoutelhak</a>',
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      content: `Physics undergraduate student with practical experience in Raman spectroscopy on carbon nanotubes and a solid background in 3D modeling. Motivated, rigorous, and autonomous, seeking to apply my skills in a dynamic environment where I can continue learning and contribute effectively.`
    },
    {
      id: 'education',
      title: 'Education',
      content: `\\textbf{Faculty of Sciences of Montpellier, Bachelor\\'s Degree in Physics}\n\\textit{Sept 2024 – May 2025}`
    },
    {
      id: 'experience',
      title: 'Experience',
      content: `\\textbf{Research Internship - Laboratoire Charles Coulomb (L2C), University of Montpellier}\n\\textit{June 2 – June 27, 2025}\n\n\\begin{itemize}\n\\item Experiments in Raman and photoluminescence (PL) spectroscopy on single-walled carbon nanotubes (SWCNTs)\n\\item Study of the effects of quaterthiophene (4T) encapsulation on optical and structural properties of nanotubes\n\\item Analysis of spectra (RBM, G, D, 2D, PL) to identify doping, mechanical strain, electronic interactions, and thermal effects\n\\item Use of lasers (785, 633, 532 nm) to explore resonance regimes\n\\item Writing of a scientific report; deepened understanding of chirality and electronic transitions\n\\end{itemize}`
    },
    {
      id: 'projects',
      title: 'Projects',
      content: `\\textbf{Automatic Detection of Raman Modes in Carbon Nanotubes}\n\n\\begin{itemize}\n\\item Development of a Python algorithm for processing Raman spectroscopy data applied to single-walled carbon nanotubes (SWCNTs), implementing peak detection, baseline correction, and mode attribution (RBM, G band) according to Raman selection rules.\n\\item \\textbf{Skills:} Python (NumPy, SciPy, Matplotlib), data processing, spectroscopic analysis, nanomaterial physics.\n\\end{itemize}`
    },
    {
      id: 'courses',
      title: 'Courses and Certifications',
      content: `\\textbf{Get Started with Python, Coursera} - \\textit{2025}\n\n\\begin{itemize}\n\\item Introduction to Python programming, basic data structures, and automation.\n\\end{itemize}`
    },
    {
      id: 'technical-skills',
      title: 'Technical Skills',
      content: `\\begin{itemize}\n\\item \\textbf{Software:} Blender, VS Code, JupyterLab, Texmaker\n\\item \\textbf{Office Suite:} Excel, Word, PowerPoint\n\\item \\textbf{Knowledge:} Python programming (Data analysis, NumPy, SymPy), LaTeX\n\\end{itemize}`
    },
    {
      id: 'languages',
      title: 'Languages',
      content: `\\begin{itemize}\n\\item \\textbf{French:} Fluent\n\\item \\textbf{Arabic:} Native\n\\item \\textbf{English:} Fluent\n\\item \\textbf{Turkish:} Intermediate\n\\end{itemize}`
    }
  ]
};
