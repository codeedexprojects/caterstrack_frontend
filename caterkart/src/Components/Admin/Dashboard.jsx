import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchUpcomingWorks, 
  fetchAdminStats, 
  setSelectedWork, 
  setShowDetailModal,
  fetchWorkRequestsByWork,
  fetchAssignedUsers,
  fetchWorks  // Add this import
} from '../../Services/Api/Admin/WorkSlice';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle, Eye, X } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { upcomingWorks, works, adminStats, loading, error } = useSelector(state => state.work);
  
  useEffect(() => {
    dispatch(fetchUpcomingWorks());
    dispatch(fetchAdminStats());
    dispatch(fetchWorks()); // Fetch all works to get complete details
  }, [dispatch]);

  const stats = [
    { 
      title: 'Total Users', 
      value: adminStats?.total_users || 0, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Works Completed', 
      value: adminStats?.total_works_completed || 0, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Pending Works', 
      value: adminStats?.total_pending_works || 0, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Join Requests', 
      value: adminStats?.total_pending_join_requests || 0, 
      color: 'bg-orange-500' 
    },
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

  const getWorkTypeColor = (workType) => {
    switch (workType?.toLowerCase()) {
      case 'wedding':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'birthday':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'corporate':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'lunch':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleViewDetails = async (upcomingWork) => {
    try {
      // Find the complete work details from the works array using the work ID
      const completeWork = works.find(work => work.id === upcomingWork.id);
      
      if (completeWork) {
        // Use the complete work details
        dispatch(setSelectedWork(completeWork));
      } else {
        // Fallback to upcoming work data if complete work not found
        dispatch(setSelectedWork(upcomingWork));
      }
      
      dispatch(setShowDetailModal(true));
      
      // Navigate to works page
      navigate('/admin/works');
      
      // Fetch related data
      await dispatch(fetchAssignedUsers(upcomingWork.id));
      await dispatch(fetchWorkRequestsByWork(upcomingWork.id));
    } catch (error) {
      console.error('Failed to load work data:', error);
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && !error && upcomingWorks.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming works</h3>
              <p className="mt-1 text-sm text-gray-500">There are no upcoming works scheduled.</p>
            </div>
          )}
          
          {!loading && !error && upcomingWorks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingWorks.map((work, index) => {
                return (
                  <div key={work.id || index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-blue-600 truncate">
                        {work.Auditorium_name || 'N/A'}
                      </h4>
                      <button
                        onClick={() => handleViewDetails(work)}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getWorkTypeColor(work.work_type)}`}>
                          {work.work_type?.charAt(0).toUpperCase() + work.work_type?.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-800">{work.place}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{work.no_of_boys_needed} staff needed</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-green-600">{formatDate(work.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{formatTime(work.reporting_time)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;