import { useState, useEffect, useCallback } from 'react';
import { githubService } from '../services/githubService';

export const useEditableContent = (storageKey: string, initialContent: string, filePath?: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem(storageKey);
    if (savedContent) {
      setContent(savedContent);
      setEditedContent(savedContent);
    } else {
      setContent(initialContent);
      setEditedContent(initialContent);
    }
  }, [storageKey, initialContent]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    // Always save to localStorage as fallback
    localStorage.setItem(storageKey, editedContent);
    setContent(editedContent);

    // If GitHub is configured and filePath is provided, commit to GitHub
    if (githubService.isConfigured() && filePath) {
      try {
        await githubService.commitFile({
          path: filePath,
          content: editedContent,
          message: `Update ${storageKey} via web interface`,
        });
        alert('Changes saved and committed to GitHub! The site will be redeployed shortly.');
      } catch (error) {
        console.error('Failed to commit to GitHub:', error);
        alert('Changes saved locally, but failed to commit to GitHub. Please check your settings and try again.');
      }
    } else {
      alert('Changes saved locally only. Configure GitHub in Settings to commit changes to the repository.');
    }
    
    setIsEditing(false);
    setIsSaving(false);
  }, [storageKey, editedContent, filePath]);

  const handleCancel = useCallback(() => {
    setEditedContent(content);
    setIsEditing(false);
  }, [content]);

  return {
    isEditing,
    setIsEditing,
    content,
    editedContent,
    setEditedContent,
    handleSave,
    handleCancel,
    isSaving,
  };
};
