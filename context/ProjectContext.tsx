import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { Project } from '../types';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
}

const defaultProjectContext: ProjectContextType = {
  projects: [],
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
};

export const ProjectContext = createContext<ProjectContextType>(defaultProjectContext);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error('Failed to parse saved projects:', e);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0 || localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
