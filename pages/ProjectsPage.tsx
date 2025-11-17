import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import { Project } from '../types';

const ProjectsPage: React.FC = () => {
  const { projects } = useContext(ProjectContext);

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      <section className="text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-12 rounded-xl shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Projects
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Browse through my projects and code samples
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedProjects.map((project: Project) => (
          <article
            key={project.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4 border-purple-500 hover:border-purple-600"
          >
            <header>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {new Date(project.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {project.title}
              </h2>
            </header>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {project.description}
            </p>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Link
                to={`/project/${project.id}`}
                className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                View Details →
              </Link>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  GitHub →
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Live Demo →
                </a>
              )}
            </div>
          </article>
        ))}

        {sortedProjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
