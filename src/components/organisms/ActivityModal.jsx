import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const activityTypes = [
  { value: 'call', label: 'Phone Call', icon: 'Phone' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'meeting', label: 'Meeting', icon: 'Calendar' },
  { value: 'note', label: 'Note', icon: 'FileText' },
  { value: 'task', label: 'Task', icon: 'CheckSquare' }
];

const entityTypes = [
  { value: 'contact', label: 'Contact' },
  { value: 'lead', label: 'Lead' },
  { value: 'deal', label: 'Deal' },
  { value: 'task', label: 'Task' }
];

const ActivityModal = ({ isOpen, onClose, activity, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'note',
    entityType: 'contact',
    entityId: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || 'note',
        entityType: activity.entityType || 'contact',
        entityId: activity.entityId?.toString() || '',
        description: activity.description || ''
      });
    } else {
      setFormData({
        type: 'note',
        entityType: 'contact',
        entityId: '',
        description: ''
      });
    }
    setErrors({});
  }, [activity, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.entityId || formData.entityId === '0') {
      newErrors.entityId = 'Entity ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        type: formData.type,
        entityType: formData.entityType,
        entityId: parseInt(formData.entityId) || 0,
        description: formData.description.trim()
      });
    } catch (error) {
      console.error('Error saving activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const selectedActivityType = activityTypes.find(type => type.value === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <ApperIcon 
                    name={selectedActivityType?.icon || 'Activity'} 
                    className="h-5 w-5 mr-2 text-primary-600" 
                  />
                  {activity ? 'Edit Activity' : 'New Activity'}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  disabled={loading}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Activity Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Type
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {activityTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('type', type.value)}
                        className={cn(
                          "flex flex-col items-center p-3 rounded-lg border transition-all duration-200",
                          formData.type === type.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        )}
                      >
                        <ApperIcon name={type.icon} className="h-4 w-4 mb-1" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entity Type */}
                <Select
                  label="Related To"
                  value={formData.entityType}
                  onChange={(e) => handleInputChange('entityType', e.target.value)}
                  error={errors.entityType}
                >
                  {entityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>

                {/* Entity ID */}
                <Input
                  label="Entity ID"
                  type="number"
                  value={formData.entityId}
                  onChange={(e) => handleInputChange('entityId', e.target.value)}
                  error={errors.entityId}
                  placeholder="Enter the ID of the related record"
                />

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={cn(
                      "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200",
                      errors.description && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Describe the activity details..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>
              </CardContent>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  {activity ? 'Update Activity' : 'Create Activity'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;