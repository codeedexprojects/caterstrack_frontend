import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Header = ({ activeSection, setSidebarOpen }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'users':
        return 'Users';
      case 'fares':
        return 'Fares';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{getSectionTitle()}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;