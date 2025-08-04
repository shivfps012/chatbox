import React, { useRef } from 'react';
import { Upload, X, FileText, File, Image } from 'lucide-react';

const FileUpload = ({ 
  onFileUpload, 
  maxSize = 10, 
  acceptedTypes = ['.pdf', '.msg', '.eml', '.txt', '.docx', '.doc', 'image/*'] 
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxSize}MB)`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedTypes.includes(fileExtension)) {
          errors.push(`${file.name} is not a supported file type`);
          return;
        }
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      validFiles.forEach(file => dataTransfer.items.add(file));
      onFileUpload(dataTransfer.files);
    }
  };

  return (
    <div className="p-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Supports: Documents ({acceptedTypes.filter(type => !type.includes('image')).join(', ')}) and Images (JPG, PNG, GIF, etc.) - max {maxSize}MB each
        </p>
        
        <div className="flex justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </div>
          <div className="flex items-center space-x-1">
            <Image className="h-4 w-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center space-x-1">
            <File className="h-4 w-4" />
            <span>Messages</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',') + ',image/*'}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;