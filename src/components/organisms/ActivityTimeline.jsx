import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import { cn } from '@/utils/cn';

const ActivityTimeline = ({ activities, onEditActivity, onDeleteActivity }) => {
  
  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      task: "CheckSquare",
      completed: "CheckCircle"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-600",
      email: "text-green-600",
      meeting: "text-purple-600",
      note: "text-gray-600",
      task: "text-orange-600",
      completed: "text-emerald-600"
    };
    return colors[type] || "text-gray-600";
  };

  const formatActivityDate = (dateString) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE, h:mm a');
    } else if (isThisYear(date)) {
      return format(date, 'MMM d, h:mm a');
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    
    activities.forEach(activity => {
      const date = parseISO(activity.createdAt);
      let groupKey;
      
      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else if (isThisWeek(date)) {
        groupKey = format(date, 'EEEE');
      } else if (isThisYear(date)) {
        groupKey = format(date, 'MMMM d');
      } else {
        groupKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });
    
    return groups;
  };

  const groupedActivities = groupActivitiesByDate(activities);

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Activity" className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">No activities to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
        <div key={dateGroup} className="relative">
          {/* Date Group Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border">
              {dateGroup}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({groupActivities.length} {groupActivities.length === 1 ? 'activity' : 'activities'})
              </span>
            </h3>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {groupActivities.map((activity, index) => (
                <div key={activity.Id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-200 rounded-full">
                      <ApperIcon 
                        name={getActivityIcon(activity.type)} 
                        className={cn("h-4 w-4", getActivityColor(activity.type))}
                      />
                    </div>
                    {/* Connector line to next item */}
                    {index < groupActivities.length - 1 && (
                      <div className="absolute top-8 left-1/2 w-0.5 h-6 bg-gray-200 transform -translate-x-1/2" />
                    )}
                  </div>

                  {/* Activity Card */}
                  <Card className="flex-1 hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getActivityColor(activity.type))}
                            >
                              {activity.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {activity.entityType}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatActivityDate(activity.createdAt)}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-900 mb-2 leading-relaxed">
                            {activity.description}
                          </p>

                          {/* Entity Info */}
                          <div className="flex items-center text-xs text-gray-500">
                            <ApperIcon name="Link" className="h-3 w-3 mr-1" />
                            <span>
                              {activity.entityType} #{activity.entityId}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditActivity(activity)}
                            className="p-1 h-8 w-8"
                          >
                            <ApperIcon name="Edit2" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteActivity(activity.Id)}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;