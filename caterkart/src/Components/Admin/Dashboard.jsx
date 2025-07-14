import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcomingWorks } from '../../Services/Api/Admin/WorkSlice';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock,
          iconColor: 'text-gray-600'
        };
      case 'approved':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: CheckCircle,
          iconColor: 'text-gray-600'
        };
      case 'rejected':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: XCircle,
          iconColor: 'text-gray-600'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertCircle,
          iconColor: 'text-gray-600'
        };
    }
  };

  const getWorkTypeColor = (workType) => {
    switch (workType) {
      case 'wedding':
      case 'birthday':
      case 'corporate':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
                const statusConfig = getStatusConfig(work.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">
                        {work.Auditorium_name || 'N/A'}
                      </h4>
                      {work.status && (
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                          {work.status.charAt(0).toUpperCase() + work.status.slice(1)}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getWorkTypeColor(work.work_type)}`}>
                          {work.work_type.charAt(0).toUpperCase() + work.work_type.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{work.place}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{work.no_of_boys_needed} staff needed</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{formatDate(work.date)}</span>
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