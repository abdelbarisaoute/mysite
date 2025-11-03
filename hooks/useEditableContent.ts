import { useState, useEffect, useCallback } from 'react';

export const useEditableContent = (storageKey: string, initialContent: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [editedContent, setEditedContent] = useState(content);

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

  const handleSave = useCallback(() => {
    localStorage.setItem(storageKey, editedContent);
    setContent(editedContent);
    setIsEditing(false);
  }, [storageKey, editedContent]);

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
  };
};
