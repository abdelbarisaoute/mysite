import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageInsert: (markdown: string) => void;
}

interface UploadedImage {
  name: string;
  url: string;
  size: number;
  file?: File;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
  caption?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageInsert }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<UploadedImage>>([]);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<'single' | 'double'>('single');
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  // Get base path from vite config or default to '/mysite/'
  const basePath = import.meta.env.BASE_URL || '/mysite/';

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      showNotification('error', 'Please upload only image files (PNG, JPG, GIF, SVG, WebP)');
      return;
    }

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newImage: UploadedImage = {
          name: file.name,
          url: result,
          size: file.size,
          file: file,
          uploaded: false,
          uploading: false
        };
        setUploadedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get repository information from localStorage or environment
  const getRepositoryInfo = () => {
    const savedRepoOwner = localStorage.getItem('githubRepoOwner');
    const savedRepoName = localStorage.getItem('githubRepoName');
    
    if (savedRepoOwner && savedRepoName) {
      return { repoOwner: savedRepoOwner, repoName: savedRepoName };
    }
    
    // Fallback to environment or defaults
    let repoOwner = import.meta.env.VITE_GITHUB_OWNER;
    let repoName = import.meta.env.VITE_GITHUB_REPO;
    
    // Try to extract from hostname/pathname with validation
    if (!repoOwner) {
      const hostnameOwner = window.location.hostname.split('.')[0];
      repoOwner = hostnameOwner && hostnameOwner !== 'localhost' ? hostnameOwner : 'abdelbarisaoute';
    }
    
    if (!repoName) {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      repoName = pathParts.length > 0 && pathParts[0] !== 'admin' ? pathParts[0] : 'mysite';
    }
    
    return { repoOwner, repoName };
  };

  // Upload image to GitHub repository
  const uploadImageToGitHub = async (image: UploadedImage): Promise<boolean> => {
    const token = localStorage.getItem('githubToken') || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      setUploadedImages(prev => prev.map(img => 
        img.name === image.name 
          ? { ...img, error: 'GitHub token not configured', uploading: false } 
          : img
      ));
      return false;
    }

    if (!image.file) {
      setUploadedImages(prev => prev.map(img => 
        img.name === image.name 
          ? { ...img, error: 'File data not available', uploading: false } 
          : img
      ));
      return false;
    }

    const { repoOwner, repoName } = getRepositoryInfo();
    
    // Clean filename for URL-safe usage while preserving file extension
    const cleanName = image.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
    const filePath = `public/${cleanName}`;

    try {
      // Set uploading state
      setUploadedImages(prev => prev.map(img => 
        img.name === image.name 
          ? { ...img, uploading: true, error: undefined } 
          : img
      ));

      // Read file as ArrayBuffer and convert to base64
      const arrayBuffer = await image.file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Convert to base64 using chunked approach to avoid stack overflow
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
      }
      const base64Content = btoa(binary);

      // Check if file already exists
      let sha: string | undefined;
      try {
        const getResponse = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
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
        // File doesn't exist, that's fine
      }

      // Upload the file
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Add image: ${cleanName}`,
            content: base64Content,
            sha: sha,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload to GitHub');
      }

      // Update state to show success
      setUploadedImages(prev => prev.map(img => 
        img.name === image.name 
          ? { ...img, uploaded: true, uploading: false, name: cleanName } 
          : img
      ));

      return true;
    } catch (error) {
      console.error('GitHub API error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUploadedImages(prev => prev.map(img => 
        img.name === image.name 
          ? { ...img, error: errorMessage, uploading: false } 
          : img
      ));
      return false;
    }
  };

  // Upload all images to GitHub
  const uploadAllToGitHub = async () => {
    const token = localStorage.getItem('githubToken') || import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!token) {
      showNotification('error', 'GitHub token not configured. Please set up GitHub token in the dashboard settings.');
      return;
    }

    const imagesToUpload = uploadedImages.filter(img => !img.uploaded && !img.uploading);
    
    if (imagesToUpload.length === 0) {
      showNotification('error', 'No images to upload or all images already uploaded.');
      return;
    }

    showNotification('success', `Uploading ${imagesToUpload.length} image(s)...`);

    let successCount = 0;
    for (const image of imagesToUpload) {
      const success = await uploadImageToGitHub(image);
      if (success) successCount++;
    }

    if (successCount === imagesToUpload.length) {
      showNotification('success', `Successfully uploaded ${successCount} image(s) to GitHub! The site will rebuild automatically.`);
    } else {
      showNotification('error', `Uploaded ${successCount} out of ${imagesToUpload.length} image(s). Check individual errors.`);
    }
  };

  // Helper function to clean filename for URL-safe usage
  const cleanFilename = (filename: string): string => {
    return filename.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
  };

  // Helper function to generate alt text from filename
  const generateAltText = (filename: string): string => {
    return filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  };

  const generateImageMarkdown = (imageName: string, caption: string = '', alt: string = ''): string => {
    const cleanName = cleanFilename(imageName);
    const altText = alt || generateAltText(imageName);
    
    if (caption) {
      // Image with caption wrapped in a div
      return `<div class="my-4">
  <img src="${basePath}${cleanName}" alt="${altText}" class="max-w-full h-auto rounded-lg shadow-md" />
  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">${caption}</p>
</div>`;
    } else {
      // Image without caption
      return `<img src="${basePath}${cleanName}" alt="${altText}" class="max-w-full h-auto rounded-lg shadow-md my-4" />`;
    }
  };

  const generateDoubleImageMarkdown = (image1: UploadedImage, image2: UploadedImage): string => {
    const cleanName1 = cleanFilename(image1.name);
    const cleanName2 = cleanFilename(image2.name);
    const altText1 = generateAltText(image1.name);
    const altText2 = generateAltText(image2.name);
    
    return `<div class="flex gap-4 my-4 flex-wrap items-start">
  <div class="flex-1 min-w-[200px]">
    <img src="${basePath}${cleanName1}" alt="${altText1}" class="w-full h-64 object-cover rounded-lg shadow-md" />
    ${image1.caption ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">${image1.caption}</p>` : ''}
  </div>
  <div class="flex-1 min-w-[200px]">
    <img src="${basePath}${cleanName2}" alt="${altText2}" class="w-full h-64 object-cover rounded-lg shadow-md" />
    ${image2.caption ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">${image2.caption}</p>` : ''}
  </div>
</div>`;
  };

  const handleInsertImage = (image: UploadedImage) => {
    const markdown = generateImageMarkdown(image.name, image.caption);
    onImageInsert(markdown);
    showNotification('success', 'Image HTML inserted into article!');
  };

  const handleInsertSelectedImages = () => {
    if (selectedLayout === 'single') {
      if (selectedImages.length === 0) {
        showNotification('error', 'Please select at least one image');
        return;
      }
      // Insert selected images one by one
      selectedImages.forEach(index => {
        const image = uploadedImages[index];
        const markdown = generateImageMarkdown(image.name, image.caption);
        onImageInsert(markdown + '\n\n');
      });
      showNotification('success', `${selectedImages.length} image(s) inserted into article!`);
    } else {
      // Double layout - enforce exactly 2 images
      if (selectedImages.length !== 2) {
        showNotification('error', 'Please select exactly 2 images for side-by-side layout');
        return;
      }
      const image1 = uploadedImages[selectedImages[0]];
      const image2 = uploadedImages[selectedImages[1]];
      const markdown = generateDoubleImageMarkdown(image1, image2);
      onImageInsert(markdown);
      showNotification('success', '2 images inserted side-by-side into article!');
    }
    setSelectedImages([]);
  };

  const handleCopyMarkdown = (image: UploadedImage) => {
    const markdown = generateImageMarkdown(image.name, image.caption);
    navigator.clipboard.writeText(markdown);
    showNotification('success', 'Image HTML copied to clipboard!');
  };

  const handleToggleImageSelection = (index: number) => {
    setSelectedImages(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        if (selectedLayout === 'double' && prev.length >= 2) {
          // For double layout, only allow 2 selections
          showNotification('error', 'Only 2 images can be selected for side-by-side layout');
          return prev;
        }
        return [...prev, index];
      }
    });
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    setUploadedImages(prev => prev.map((img, i) => 
      i === index ? { ...img, caption } : img
    ));
  };

  const handleDownloadImage = (image: UploadedImage) => {
    const a = document.createElement('a');
    a.href = image.url;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="my-4">
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        📷 Upload Images
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Notification Toast */}
              {notification && (
                <div className={`mb-4 p-3 rounded-lg ${
                  notification.type === 'success' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                }`}>
                  {notification.message}
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Upload Images</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop images here or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Files
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports: PNG, JPG, GIF, SVG, WebP
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold mb-2">🚀 Direct GitHub Upload (Recommended)</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Upload your images using the area above</li>
                  <li>Click "Upload All to GitHub" to commit images directly to your repository</li>
                  <li>Images will be available automatically after deployment (1-2 minutes)</li>
                  <li>Click "Insert" to add the image HTML to your article content</li>
                </ol>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Note:</strong> GitHub token must be configured in dashboard settings for direct upload to work.
                </p>
              </div>

              <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-bold mb-2">📥 Manual Download (Alternative)</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Download images individually using the "Download" button</li>
                  <li>Place the downloaded images in the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">public/</code> directory of your repository</li>
                  <li>Commit and push the images to GitHub manually</li>
                </ol>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Uploaded Images ({uploadedImages.length})</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={uploadAllToGitHub}
                        disabled={uploadedImages.every(img => img.uploaded || img.uploading)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        🚀 Upload All to GitHub
                      </button>
                    </div>
                  </div>

                  {/* Layout Selector */}
                  <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold mb-2">📐 Insert Layout Options</h4>
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="layout"
                          value="single"
                          checked={selectedLayout === 'single'}
                          onChange={() => setSelectedLayout('single')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Single Image(s)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="layout"
                          value="double"
                          checked={selectedLayout === 'double'}
                          onChange={() => setSelectedLayout('double')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Two Images Side-by-Side</span>
                      </label>
                    </div>
                    {selectedImages.length > 0 && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={handleInsertSelectedImages}
                          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                        >
                          📥 Insert {selectedImages.length} Selected Image(s) ({selectedLayout === 'double' ? 'Side-by-Side' : 'Individual'})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedImages([])}
                          className="ml-2 px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Clear Selection
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {selectedLayout === 'single' 
                        ? 'Select one or more images to insert them individually with captions.' 
                        : 'Select exactly 2 images to insert them side-by-side.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {uploadedImages.map((image, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-lg p-4 transition-colors ${
                          selectedImages.includes(index) 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Checkbox for selection */}
                          <div className="flex items-start pt-2">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(index)}
                              onChange={() => handleToggleImageSelection(index)}
                              className="w-5 h-5 cursor-pointer"
                            />
                          </div>
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-32 h-32 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{image.name}</p>
                              {image.uploading && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                  Uploading...
                                </span>
                              )}
                              {image.uploaded && (
                                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                  ✓ Uploaded
                                </span>
                              )}
                              {image.error && (
                                <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                                  ✗ Error
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Size: {formatFileSize(image.size)}</p>
                            {image.error && (
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">Error: {image.error}</p>
                            )}
                            
                            {/* Caption Input */}
                            <div className="mt-2">
                              <label className="block text-sm font-medium mb-1">
                                Caption (optional):
                              </label>
                              <input
                                type="text"
                                value={image.caption || ''}
                                onChange={(e) => handleUpdateCaption(index, e.target.value)}
                                placeholder="Enter a caption for this image..."
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            
                            <div className="mt-2 space-y-2">
                              <div className="text-sm">
                                <p className="font-medium mb-1">Image HTML Preview:</p>
                                <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                                  {generateImageMarkdown(image.name, image.caption)}
                                </code>
                              </div>
                              
                              <div className="flex gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleInsertImage(image)}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                >
                                  Insert into Article
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyMarkdown(image)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                  Copy HTML
                                </button>
                                {!image.uploaded && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => uploadImageToGitHub(image)}
                                      disabled={image.uploading}
                                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-400"
                                    >
                                      Upload to GitHub
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadImage(image)}
                                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                                    >
                                      Download
                                    </button>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
