import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const buttonVariants = {
  primary: "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-md hover:shadow-lg",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm",
  success: "bg-gradient-to-r from-accent-600 to-emerald-600 text-white hover:from-accent-700 hover:to-emerald-700 shadow-md hover:shadow-lg",
  danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg",
  ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
};

const buttonSizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
};

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  children,
  loading,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="mr-2 h-4 w-4 animate-spin" 
        />
      )}
      {!loading && icon && (
        <ApperIcon 
          name={icon} 
          className="mr-2 h-4 w-4" 
        />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;