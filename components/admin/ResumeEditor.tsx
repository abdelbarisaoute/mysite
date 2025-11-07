import React, { useState, useEffect } from 'react';
import { Resume, ResumeSection } from '../../types';
import { resumeData } from '../../data/resume';
import ArticlePreview from '../ArticlePreview';
import { generateId } from '../../utils/idGenerator';

interface ResumeEditorProps {
  onMessage: (message: { type: 'success' | 'error', text: string }) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
}

const DEPLOYMENT_INFO = 'The site will automatically rebuild within 1-2 minutes. Press Ctrl+Shift+R (Cmd+Shift+R on Mac) to see changes immediately.';

const ResumeEditor: React.FC<ResumeEditorProps> = ({ onMessage, isSubmitting, setIsSubmitting }) => {
  const [resumeFormData, setResumeFormData] = useState<Resume>(resumeData);
  const [showPreview, setShowPreview] = useState(true);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [sectionFormData, setSectionFormData] = useState<ResumeSection>({
    id: '',
    title: '',
    content: ''
  });
  const [showSectionForm, setShowSectionForm] = useState(false);

  useEffect(() => {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      try {
        const parsedResume = JSON.parse(savedResume);
        setResumeFormData(parsedResume);
      } catch (e) {
        console.error('Failed to parse saved resume:', e);
      }
    }
  }, []);

  const saveResumeToGitHub = async (resume: Resume): Promise<boolean> => {
    const token = localStorage.getItem('githubToken') || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      onMessage({ 
        type: 'error', 
        text: 'GitHub token not configured. Resume saved locally only.' 
      });
      return false;
    }

    const escapeForString = (str: string): string => {
      return str
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
    };

    const escapeForTemplate = (str: string): string => {
      return str
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')
        .replace(/\r?\n/g, '\\n');
    };

    const sectionsCode = resume.sections.map(section => `    {
      id: '${escapeForString(section.id)}',
      title: '${escapeForString(section.title)}',
      content: \`${escapeForTemplate(section.content)}\`
    }`).join(',\n');

    const content = `import { Resume } from '../types';

export const resumeData: Resume = {
  id: '${escapeForString(resume.id)}',
  name: '${escapeForString(resume.name)}',
  contact: '${escapeForString(resume.contact)}',
  sections: [
${sectionsCode}
  ]
};
`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const base64Content = btoa(String.fromCharCode(...data));
    
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    const repoOwnerToUse = savedRepoOwner || 'abdelbarisaoute';
    const repoNameToUse = savedRepoName || 'mysite';
    const filePath = 'data/resume.ts';

    try {
      let sha: string | undefined;
      try {
        const getResponse = await fetch(
          `https://api.github.com/repos/${repoOwnerToUse}/${repoNameToUse}/contents/${filePath}`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
        if (getResponse.ok) {
          const data = await getResponse.json();
          sha = data.sha;
        }
      } catch (e) {
        // File doesn't exist
      }

      const response = await fetch(
        `https://api.github.com/repos/${repoOwnerToUse}/${repoNameToUse}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update resume: ${resume.name}`,
            content: base64Content,
            sha: sha,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save to GitHub');
      }

      return true;
    } catch (error) {
      console.error('GitHub API error:', error);
      onMessage({ 
        type: 'error', 
        text: `Failed to save to repository: ${error instanceof Error ? error.message : 'Unknown error'}. Resume saved locally only.` 
      });
      return false;
    }
  };

  const handleResumeInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    localStorage.setItem('resume', JSON.stringify(resumeFormData));

    const success = await saveResumeToGitHub(resumeFormData);
    
    setIsSubmitting(false);

    if (success) {
      onMessage({ 
        type: 'success', 
        text: `Resume "${resumeFormData.name}" has been updated and committed to GitHub! ${DEPLOYMENT_INFO}` 
      });
    } else {
      onMessage({ 
        type: 'success', 
        text: `Resume "${resumeFormData.name}" has been saved locally. Changes will be visible immediately but won't be committed to GitHub.` 
      });
    }
  };

  const handleAddSection = () => {
    setEditingSectionIndex(null);
    setSectionFormData({
      id: '',
      title: '',
      content: ''
    });
    setShowSectionForm(true);
  };

  const handleEditSection = (index: number) => {
    setEditingSectionIndex(index);
    setSectionFormData(resumeFormData.sections[index]);
    setShowSectionForm(true);
  };

  const handleDeleteSection = (index: number) => {
    if (!window.confirm(`Are you sure you want to delete "${resumeFormData.sections[index].title}"?`)) {
      return;
    }
    const updatedSections = resumeFormData.sections.filter((_, i) => i !== index);
    const updatedResume = { ...resumeFormData, sections: updatedSections };
    setResumeFormData(updatedResume);
    localStorage.setItem('resume', JSON.stringify(updatedResume));
    onMessage({ 
      type: 'success', 
      text: 'Section deleted successfully. Click "Save All Sections" to commit to GitHub.' 
    });
  };

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sectionId = editingSectionIndex !== null 
      ? sectionFormData.id 
      : generateId(sectionFormData.title);
    
    const section: ResumeSection = {
      ...sectionFormData,
      id: sectionId
    };

    let updatedSections: ResumeSection[];
    if (editingSectionIndex !== null) {
      updatedSections = resumeFormData.sections.map((s, i) => i === editingSectionIndex ? section : s);
    } else {
      updatedSections = [...resumeFormData.sections, section];
    }

    const updatedResume = { ...resumeFormData, sections: updatedSections };
    setResumeFormData(updatedResume);
    
    setShowSectionForm(false);
    setEditingSectionIndex(null);
    setSectionFormData({ id: '', title: '', content: '' });
    
    onMessage({ 
      type: 'success', 
      text: `Section "${section.title}" ${editingSectionIndex !== null ? 'updated' : 'added'} successfully. Click "Save All Sections" to commit to GitHub.` 
    });
  };

  return (
    <div>
      {/* Resume Info Form */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Resume Header Information</h2>
        <form onSubmit={handleResumeInfoSubmit} className="space-y-4">
          <div>
            <label htmlFor="resume-name" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="resume-name"
              value={resumeFormData.name}
              onChange={(e) => setResumeFormData({ ...resumeFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="resume-contact" className="block text-sm font-medium mb-2">
              Contact Information (HTML) *
            </label>
            <textarea
              id="resume-contact"
              value={resumeFormData.contact}
              onChange={(e) => setResumeFormData({ ...resumeFormData, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              rows={3}
              required
              placeholder='<a href="mailto:email@example.com">email@example.com</a> | <a href="https://linkedin.com/in/profile">linkedin.com/in/profile</a>'
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use HTML for links, e.g., &lt;a href="url"&gt;text&lt;/a&gt;
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Update Resume Info'}
          </button>
        </form>
      </div>

      {/* Section Editor */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Resume Sections</h2>
          <div className="flex gap-2">
            {!showSectionForm && (
              <button
                type="button"
                onClick={handleAddSection}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Add New Section
              </button>
            )}
          </div>
        </div>

        {showSectionForm && (
          <div className={`admin-preview-grid ${showPreview ? 'with-preview' : ''} mb-6`}>
            <div className="space-y-4">
              <form onSubmit={handleSectionSubmit} id="section-form">
                <div className="mb-4">
                  <label htmlFor="section-title" className="block text-sm font-medium mb-2">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    id="section-title"
                    value={sectionFormData.title}
                    onChange={(e) => setSectionFormData({ ...sectionFormData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="section-content" className="block text-sm font-medium mb-2">
                    Content * (Supports LaTeX syntax)
                  </label>
                  <textarea
                    id="section-content"
                    value={sectionFormData.content}
                    onChange={(e) => setSectionFormData({ ...sectionFormData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    rows={15}
                    required
                  />
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
                    <p className="font-semibold mb-1">💡 LaTeX Syntax Support:</p>
                    <div className="space-y-1">
                      <p>• <strong>Bold:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">\textbf{"{text}"}</code></p>
                      <p>• <strong>Italic:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">\textit{"{text}"}</code></p>
                      <p>• <strong>Lists:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">\begin{"{itemize}"} \item ... \end{"{itemize}"}</code></p>
                      <p>• <strong>Math:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">$formula$</code> or <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">$$formula$$</code></p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
                  >
                    {editingSectionIndex !== null ? 'Update Section' : 'Add Section'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSectionForm(false);
                      setEditingSectionIndex(null);
                      setSectionFormData({ id: '', title: '', content: '' });
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors ml-auto"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>
              </form>
            </div>

            {showPreview && (
              <div>
                <h3 className="text-xl font-bold mb-4">Preview</h3>
                <ArticlePreview
                  title={sectionFormData.title}
                  date=""
                  summary=""
                  content={sectionFormData.content}
                />
              </div>
            )}
          </div>
        )}

        {!showSectionForm && (
          <div>
            <div className="space-y-4">
              {resumeFormData.sections && resumeFormData.sections.map((section, index) => (
                <div 
                  key={section.id} 
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{section.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Section {index + 1} of {resumeFormData.sections.length}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => handleEditSection(index)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(index)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!resumeFormData.sections || resumeFormData.sections.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No sections yet. Click "Add New Section" to create the first section!
                </p>
              )}
            </div>

            {resumeFormData.sections && resumeFormData.sections.length > 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleResumeInfoSubmit}
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save All Sections to GitHub'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
