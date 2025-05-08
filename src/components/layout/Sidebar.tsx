import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: "📊" },
  { name: "Prospects", href: "/prospects", icon: "🔍" },
  { name: "Clients", href: "/clients", icon: "👥" },
  { name: "Meetings", href: "/meetings", icon: "📅" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-neumorph-sm hidden md:block">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="Advizall" className="h-8 mr-2" />
            <span className="text-lg font-bold">
              <span className="text-secondary">Advizall</span> CRM
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  "text-gray-700 hover:bg-gray-100 hover:text-primary",
                  "transition-all duration-150 ease-in-out"
                )}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Advizall" className="h-6 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-500">Powered by</p>
              <p className="text-sm font-medium text-gray-900">Advizall</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
