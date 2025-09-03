import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMobileMenuClick, title, showSearch = true, onSearch, actions, showQuickAdd = false }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button and title */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={onMobileMenuClick}
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
            
            {title && (
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </div>
            )}
          </div>

          {/* Search and actions */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {showSearch && (
              <div className="hidden md:block max-w-md w-full">
                <SearchBar 
                  placeholder="Search contacts, leads, deals..."
                  onSearch={onSearch}
                />
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {actions}
              
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200">
                <ApperIcon name="Bell" className="h-5 w-5" />
              </button>
              
              {/* Quick add */}
{showQuickAdd && (
                <Button size="sm" icon="Plus">
                  <span className="hidden sm:inline">Quick Add</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;