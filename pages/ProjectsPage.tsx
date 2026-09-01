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
      <section className="text-center p-10 border border-gray-200 dark:border-gray-800 rounded">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Projects
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse through my projects and code samples
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedProjects.map((project: Project) => (
          <article
            key={project.id}
            className="bg-white dark:bg-gray-900 p-6 rounded border border-gray-200 dark:border-gray-800"
          >
            <header>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {new Date(project.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
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
                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Link
                to={`/project/${project.id}`}
                className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:underline underline-offset-4"
              >
                View Details →
              </Link>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline underline-offset-4"
                >
                  GitHub →
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:underline underline-offset-4"
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
