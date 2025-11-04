import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageInsert: (markdown: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageInsert }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ name: string; url: string; size: number }>>([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please upload only image files (PNG, JPG, GIF, SVG, WebP)');
      return;
    }

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newImage = {
          name: file.name,
          url: result,
          size: file.size
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

  const generateImageMarkdown = (imageName: string, alt: string = ''): string => {
    // Generate clean filename for URL
    const cleanName = imageName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    const altText = alt || imageName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    
    return `<img src="/mysite/${cleanName}" alt="${altText}" class="max-w-full h-auto rounded-lg shadow-md my-4" />`;
  };

  const handleInsertImage = (image: { name: string; url: string }) => {
    const markdown = generateImageMarkdown(image.name);
    onImageInsert(markdown);
    setShowModal(false);
  };

  const handleCopyMarkdown = (image: { name: string; url: string }) => {
    const markdown = generateImageMarkdown(image.name);
    navigator.clipboard.writeText(markdown);
    alert('Image markdown copied to clipboard!');
  };

  const handleDownloadImage = (image: { name: string; url: string }) => {
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

  return (
    <div className="my-4">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        📷 Upload Images
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Upload Images</h2>
                <button
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
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h3 className="font-bold mb-2">📝 Important Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>After uploading, download the image files to your computer</li>
                  <li>Place the downloaded images in the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">public/</code> directory of your repository</li>
                  <li>Commit and push the images to GitHub</li>
                  <li>The images will be available after deployment</li>
                  <li>Click "Insert" to add the image HTML to your article content</li>
                </ol>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4">Uploaded Images ({uploadedImages.length})</h3>
                  <div className="space-y-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="border dark:border-gray-600 rounded-lg p-4">
                        <div className="flex gap-4">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-32 h-32 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{image.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Size: {formatFileSize(image.size)}</p>
                            
                            <div className="mt-2 space-y-2">
                              <div className="text-sm">
                                <p className="font-medium mb-1">Image HTML:</p>
                                <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                                  {generateImageMarkdown(image.name)}
                                </code>
                              </div>
                              
                              <div className="flex gap-2 flex-wrap">
                                <button
                                  onClick={() => handleInsertImage(image)}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                >
                                  Insert into Article
                                </button>
                                <button
                                  onClick={() => handleCopyMarkdown(image)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                  Copy HTML
                                </button>
                                <button
                                  onClick={() => handleDownloadImage(image)}
                                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                                >
                                  Download Image
                                </button>
                                <button
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
