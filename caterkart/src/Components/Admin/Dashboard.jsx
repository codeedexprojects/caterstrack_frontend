import React from 'react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', color: 'bg-blue-500' },
    { title: 'Total Fares', value: '₹45,678', color: 'bg-green-500' },
    { title: 'Active Users', value: '987', color: 'bg-purple-500' },
    { title: 'Pending Approvals', value: '23', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CaterKart Admin Dashboard</h2>
        <p className="text-gray-600">Select a section from the sidebar to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;