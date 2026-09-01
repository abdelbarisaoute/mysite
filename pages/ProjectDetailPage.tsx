import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import ContentRenderer from '../components/ContentRenderer';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useContext(ProjectContext);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Project Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The project you're looking for doesn't exist.
        </p>
        <Link
          to="/projects"
          className="text-gray-700 dark:text-gray-300 hover:underline underline-offset-4"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/projects"
        className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:underline underline-offset-4 mb-6"
      >
        ← Back to Projects
      </Link>

      <article className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 p-8">
        <header className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {new Date(project.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {project.description}
          </p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                View on GitHub →
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Live Demo →
              </a>
            )}
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <ContentRenderer content={project.content} />
        </div>

        {project.codeSnippet && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Code Sample
            </h2>
            <pre className="bg-gray-100 dark:bg-black p-4 rounded overflow-x-auto border border-gray-200 dark:border-gray-800">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {project.codeSnippet}
              </code>
            </pre>
          </div>
        )}
      </article>
    </div>
  );
};

export default ProjectDetailPage;
