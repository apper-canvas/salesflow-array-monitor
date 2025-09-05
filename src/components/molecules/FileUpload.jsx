import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { attachmentService } from '@/services/api/attachmentService';

const FileUpload = ({ entityType, entityId, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (!entityId) {
      toast.error('Please save the record first before uploading files');
      return;
    }

    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = validFiles.map(async (file) => {
        // In a real application, you would upload the file to a storage service
        // and get back a file path. For now, we'll simulate this.
        const filePath = `uploads/${entityType}/${entityId}/${Date.now()}-${file.name}`;
        
        const attachmentData = {
          name: file.name,
          filePath: filePath,
          [`${entityType}Id`]: entityId
        };

        return attachmentService.create(attachmentData);
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(r => r !== null);

      if (successful.length > 0) {
        toast.success(`Successfully uploaded ${successful.length} file${successful.length > 1 ? 's' : ''}`);
        onUploadComplete?.();
      }

      if (successful.length !== validFiles.length) {
        const failed = validFiles.length - successful.length;
        toast.error(`Failed to upload ${failed} file${failed > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-sm text-gray-600">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ApperIcon name="Upload" className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag and drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;