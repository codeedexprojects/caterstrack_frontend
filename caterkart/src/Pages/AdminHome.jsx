import React, { useState } from 'react';
import Sidebar from '../Components/Admin/Sidebar';
import Header from '../Components/Admin/Header';
import Dashboard from '../Components/Admin/Dashboard';
import UsersList from '../Components/Admin/UsersList';
import FaresList from '../Components/Admin/FaresList';

const AdminHome = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersList />;
      case 'fares':
        return <FaresList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          activeSection={activeSection}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminHome;