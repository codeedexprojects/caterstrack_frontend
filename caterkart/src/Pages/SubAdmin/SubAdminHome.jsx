import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SubAdminSidebar from '../../Components/SubAdmin/SubAdminSidebar';
import SubAdminHeader from '../../Components/SubAdmin/SubAdminHeader';

const SubAdminHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Extract active section from path
  const section = location.pathname.split('/')[2] || 'sub-dashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SubAdminSidebar
        activeSection={section}
        setActiveSection={() => {}} // We don't need to manage it via state now
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <SubAdminHeader
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

export default SubAdminHome;