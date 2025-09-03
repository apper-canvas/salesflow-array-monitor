import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add New",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        <ApperIcon 
          name={icon} 
          className="h-16 w-16 text-gray-400"
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-md hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg"
        >
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;