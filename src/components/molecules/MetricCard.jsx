import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = false 
}) => {
  const isPositive = trend === "up";
  
  return (
    <Card className={cn(
      "transform hover:scale-105 transition-all duration-200 cursor-pointer",
      gradient && "bg-gradient-to-br from-white to-gray-50",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className={cn(
            "p-2 rounded-full",
            gradient ? "bg-gradient-to-br from-primary-100 to-secondary-100" : "bg-primary-50"
          )}>
            <ApperIcon name={icon} className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {value}
          </p>
          
          {trend && trendValue && (
            <div className="flex items-center text-sm">
              <ApperIcon 
                name={isPositive ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "h-4 w-4 mr-1",
                  isPositive ? "text-accent-500" : "text-red-500"
                )}
              />
              <span className={cn(
                "font-medium",
                isPositive ? "text-accent-600" : "text-red-600"
              )}>
                {trendValue}
              </span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;