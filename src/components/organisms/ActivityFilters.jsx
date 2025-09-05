import React, { useState } from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
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

const ActivityFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  totalCount, 
  filteredCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (value) => {
    onFiltersChange({
      ...filters,
      searchQuery: value
    });
  };

  const handleDateRangeChange = (field, value) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const toggleActivityType = (type) => {
    const newTypes = filters.activityTypes.includes(type)
      ? filters.activityTypes.filter(t => t !== type)
      : [...filters.activityTypes, type];
    
    onFiltersChange({
      ...filters,
      activityTypes: newTypes
    });
  };

  const toggleEntityType = (type) => {
    const newTypes = filters.entityTypes.includes(type)
      ? filters.entityTypes.filter(t => t !== type)
      : [...filters.entityTypes, type];
    
    onFiltersChange({
      ...filters,
      entityTypes: newTypes
    });
  };

  const hasActiveFilters = 
    filters.searchQuery || 
    filters.dateRange.start || 
    filters.dateRange.end ||
    filters.activityTypes.length > 0 || 
    filters.entityTypes.length > 0;

  return (
    <Card>
      <CardContent className="p-4">
        {/* Top Row - Search and Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" 
              />
              <input
                type="text"
                placeholder="Search activities..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredCount === totalCount ? (
                <span>{totalCount} activities</span>
              ) : (
                <span>{filteredCount} of {totalCount} activities</span>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="X" className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}

            {/* Expand/Collapse Toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ApperIcon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                className="h-4 w-4 mr-1" 
              />
              Filters
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="From Date"
                type="date"
                value={filters.dateRange.start || ''}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={filters.dateRange.end || ''}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
              />
            </div>

            {/* Activity Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Types
              </label>
              <div className="flex flex-wrap gap-2">
                {activityTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleActivityType(type.value)}
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                      filters.activityTypes.includes(type.value)
                        ? "bg-primary-100 text-primary-800 border border-primary-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    )}
                  >
                    <ApperIcon name={type.icon} className="h-3 w-3 mr-1" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Entity Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related To
              </label>
              <div className="flex flex-wrap gap-2">
                {entityTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleEntityType(type.value)}
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                      filters.entityTypes.includes(type.value)
                        ? "bg-secondary-100 text-secondary-800 border border-secondary-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Summary */}
        {hasActiveFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
              
              {filters.searchQuery && (
                <Badge variant="outline">
                  Search: "{filters.searchQuery}"
                </Badge>
              )}
              
              {filters.dateRange.start && (
                <Badge variant="outline">
                  From: {filters.dateRange.start}
                </Badge>
              )}
              
              {filters.dateRange.end && (
                <Badge variant="outline">
                  To: {filters.dateRange.end}
                </Badge>
              )}
              
              {filters.activityTypes.map(type => (
                <Badge key={type} variant="primary">
                  {activityTypes.find(t => t.value === type)?.label || type}
                </Badge>
              ))}
              
              {filters.entityTypes.map(type => (
                <Badge key={type} variant="secondary">
                  {entityTypes.find(t => t.value === type)?.label || type}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFilters;