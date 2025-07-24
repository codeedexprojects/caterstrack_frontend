import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const SubAdminHeader = ({ activeSection, setSidebarOpen }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'sub-dashboard':
        return 'Sub Admin Dashboard';
      case 'create-user':
        return 'Create User';
      case 'users':
        return 'Users Management';
      case 'catering-works':
        return 'Catering Works';
      default:
        return 'Sub Admin Dashboard';
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
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Sub Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SubAdminHeader;