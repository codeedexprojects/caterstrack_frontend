import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcomingWorks } from '../../Services/Api/Admin/WorkSlice'; // Adjust import path as needed

const Dashboard = () => {
  const dispatch = useDispatch();
  const { upcomingWorks, loading, error } = useSelector(state => state.work);
  
  useEffect(() => {
    dispatch(fetchUpcomingWorks());
  }, [dispatch]);

  const stats = [
    { title: 'Total Users', value: '1,234', color: 'bg-blue-500' },
    { title: 'Total Fares', value: '₹45,678', color: 'bg-green-500' },
    { title: 'Active Users', value: '987', color: 'bg-purple-500' },
    { title: 'Pending Approvals', value: '23', color: 'bg-orange-500' },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkTypeColor = (workType) => {
    switch (workType) {
      case 'wedding':
        return 'bg-pink-100 text-pink-800';
      case 'birthday':
        return 'bg-blue-100 text-blue-800';
      case 'corporate':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CaterKart Admin Dashboard</h2>
        <p className="text-gray-600">Select a section from the sidebar to get started</p>
      </div>
      
      {/* Stats Cards */}
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

      {/* Upcoming Works Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Works</h3>
        </div>
        
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && !error && upcomingWorks.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming works</h3>
              <p className="mt-1 text-sm text-gray-500">There are no upcoming works scheduled.</p>
            </div>
          )}
          
          {!loading && !error && upcomingWorks.length > 0 && (
            <div className="space-y-4">
              {upcomingWorks.map((work) => (
                <div key={work.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{work.customer_name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                          {work.status.charAt(0).toUpperCase() + work.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWorkTypeColor(work.work_type)}`}>
                          {work.work_type.charAt(0).toUpperCase() + work.work_type.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Mobile:</span> {work.customer_mobile}</p>
                          <p><span className="font-medium">Location:</span> {work.place}, {work.district}</p>
                          <p><span className="font-medium">Address:</span> {work.address}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Date:</span> {formatDate(work.date)}</p>
                          <p><span className="font-medium">Time:</span> {formatTime(work.time)}</p>
                          <p><span className="font-medium">Attendees:</span> {work.attendees}</p>
                          <p><span className="font-medium">Boys Needed:</span> {work.no_of_boys_needed}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4">
                        <div className="text-sm">
                          <span className="font-medium text-green-600">Amount: ₹{work.payment_amount}</span>
                        </div>
                        {work.location_url && (
                          <a 
                            href={work.location_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            View Location
                          </a>
                        )}
                      </div>
                      
                      {work.remarks && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Remarks:</span> {work.remarks}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end text-xs text-gray-500">
                      <div>Created: {formatDate(work.created_at)}</div>
                      <div>Updated: {formatDate(work.updated_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;