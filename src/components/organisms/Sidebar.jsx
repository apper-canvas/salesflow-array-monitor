import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const navigation = [
  { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { name: "Contacts", href: "/contacts", icon: "Users" },
  { name: "Leads", href: "/leads", icon: "UserPlus" },
  { name: "Pipeline", href: "/pipeline", icon: "BarChart3" },
  { name: "Deals", href: "/deals", icon: "DollarSign" },
  { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
  { name: "Activities", href: "/activities", icon: "Activity" },
];

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 border-l-4 border-primary-600"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
        )}
        onClick={() => onMobileClose?.()}
      >
        <ApperIcon
          name={item.icon}
          className={cn(
            "mr-3 h-5 w-5 transition-colors duration-200",
            isActive 
              ? "text-primary-600" 
              : "text-gray-500 group-hover:text-gray-700"
          )}
        />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <ApperIcon name="Zap" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  SalesFlow
                </h1>
                <p className="text-xs text-gray-500">CRM System</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full p-2">
                  <ApperIcon name="User" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Sales Manager</p>
                  <p className="text-xs text-gray-500">sales@salesflow.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {/* Mobile sidebar overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm"
          onClick={onMobileClose}
        />
        
        <div className={cn(
          "relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onMobileClose}
            >
              <ApperIcon name="X" className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <ApperIcon name="Zap" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  SalesFlow
                </h1>
                <p className="text-xs text-gray-500">CRM System</p>
              </div>
            </div>
            
            <nav className="px-4 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full p-2">
                  <ApperIcon name="User" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Sales Manager</p>
                  <p className="text-xs text-gray-500">sales@salesflow.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;