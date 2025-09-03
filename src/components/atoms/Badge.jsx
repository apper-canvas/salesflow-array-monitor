import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const badgeVariants = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-accent-100 text-accent-800",
  danger: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
  outline: "border border-gray-300 text-gray-700 bg-transparent"
};

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;