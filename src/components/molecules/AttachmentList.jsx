import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { attachmentService } from '@/services/api/attachmentService';

const AttachmentList = ({ entityType, entityId, refreshTrigger }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (entityId) {
      loadAttachments();
    }
  }, [entityId, refreshTrigger]);

  const loadAttachments = async () => {
    if (!entityId) return;
    
    setLoading(true);
    try {
      const data = await attachmentService.getByEntity(entityType, entityId);
      setAttachments(data);
    } catch (error) {
      console.error('Error loading attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attachmentId, fileName) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setDeleting(attachmentId);
    try {
      const success = await attachmentService.delete(attachmentId);
      if (success) {
        setAttachments(prev => prev.filter(a => a.Id !== attachmentId));
        toast.success('File deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (attachment) => {
    // In a real application, you would handle the actual file download
    // This could involve getting a signed URL from your storage service
    toast.info(`Download functionality for "${attachment.name}" would be implemented here`);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'doc':
      case 'docx':
        return 'FileText';
      case 'xls':
      case 'xlsx':
        return 'Sheet';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image';
      case 'zip':
      case 'rar':
        return 'Archive';
      default:
        return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <ApperIcon name="Loader2" className="h-5 w-5 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-600">Loading attachments...</span>
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="text-center py-4">
        <ApperIcon name="Paperclip" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No attachments</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div 
          key={attachment.Id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <ApperIcon 
              name={getFileIcon(attachment.name)} 
              className="h-5 w-5 text-gray-500 flex-shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <button
                onClick={() => handleDownload(attachment)}
                className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block w-full text-left"
                title={attachment.name}
              >
                {attachment.name}
              </button>
              <p className="text-xs text-gray-500">
                {attachment.uploadDate && format(new Date(attachment.uploadDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(attachment.Id, attachment.name)}
            loading={deleting === attachment.Id}
            disabled={deleting === attachment.Id}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;