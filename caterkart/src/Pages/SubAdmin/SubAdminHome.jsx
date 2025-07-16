import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../Components/SubAdmin/Sidebar';
import Header from '../../Components/SubAdmin/Header';

const AdminHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // extract active section from path
  const section = location.pathname.split('/')[2] || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeSection={section}
        setActiveSection={() => {}} // we don't need to manage it via state now
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          activeSection={section}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Routed Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminHome;