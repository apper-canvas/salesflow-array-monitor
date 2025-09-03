import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  showFilters = false,
  onFilterClick
}) => {
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    onSearch?.(searchValue);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
        />
      </div>
      
      {showFilters && (
        <button
          onClick={onFilterClick}
          className="ml-3 p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 bg-white"
        >
          <ApperIcon name="Filter" className="h-4 w-4 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;