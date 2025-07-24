import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock, CheckCircle, XCircle, AlertCircle, Calendar, MapPin, Filter, Search, Eye, ChefHat, MoreHorizontal,
} from 'lucide-react';
import Header from '../../Components/Users/Header';
import Footer from '../../Components/Users/Footer';
import { useNavigate } from 'react-router-dom';
import { fetchMyWorks } from '../../Services/Api/User/UserAuthSlice';

const MyWorksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { myWorks: workData, isLoading: loading, error } = useSelector((state) => state.userAuth);
  
  // Local state
  const [activeTab, setActiveTab] = useState('active');
  const [selectedWork, setSelectedWork] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch works data on component mount
  useEffect(() => {
    dispatch(fetchMyWorks());
  }, [dispatch]);

  const handleViewDetails = (workDetailId) => {
    console.log(workDetailId)
    navigate(`/work-details/${workDetailId}`);
  };

  // Group works by status
  const getWorksByStatus = () => {
    if (!Array.isArray(workData)) {
      return {
        pending: [],
        accepted: [],
        rejected: []
      };
    }
    
    return workData.reduce((acc, work) => {
      const status = work.status || 'pending';
      if (!acc[status]) acc[status] = [];
      acc[status].push(work);
      return acc;
    }, {
      pending: [],
      accepted: [],
      rejected: []
    });
  };

  const worksByStatus = getWorksByStatus();

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: AlertCircle,
      accepted: CheckCircle,
      rejected: XCircle
    };
    return icons[status] || AlertCircle;
  };

  const tabs = [
    {
      id: 'active',
      label: 'Active',
      count: worksByStatus.pending.length + worksByStatus.accepted.length
    },
    { id: 'pending', label: 'Pending', count: worksByStatus.pending.length },
    { id: 'accepted', label: 'Accepted', count: worksByStatus.accepted.length },
    { id: 'rejected', label: 'Rejected', count: worksByStatus.rejected.length }
  ];

  const getWorksForTab = (tabId) => {
    switch (tabId) {
      case 'active':
        return [...worksByStatus.pending, ...worksByStatus.accepted];
      case 'pending':
        return worksByStatus.pending;
      case 'accepted':
        return worksByStatus.accepted;
      case 'rejected':
        return worksByStatus.rejected;
      default:
        return Array.isArray(workData) ? workData : [];
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const WorkCard = ({ work }) => {
    const StatusIcon = getStatusIcon(work.status);
    const workDetail = work.work_detail;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-gray-800">
                {workDetail?.date} -  {workDetail?.Auditorium_name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(work.status)}`}>
                <StatusIcon className="w-3 h-3 inline mr-1" />
                {work.status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 font-medium">
              {workDetail?.Auditorium_name || workDetail?.Catering_company || 'Event Service'}
            </p>

          </div>
          <div className="text-right">

            {work.assigned && (
              <div className="text-sm text-green-600 font-medium mt-1">✓ Assigned</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="text-sm">{workDetail?.place || 'Location TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="text-sm">{formatDate(workDetail?.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm">{formatTime(workDetail?.reporting_time)}</span>
          </div>

        </div>

        {/* Comment section */}
        {work.comment && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Comment:</p>
            <p className="text-sm text-blue-700 mt-1">{work.comment}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${work.status === 'accepted' ? 'bg-green-500' :
              work.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
            <span className="text-sm text-gray-600">
              Requested on {new Date(work.requested_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewDetails(work.work_detail.id)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const currentWorks = getWorksForTab(activeTab);
  const filteredWorks = currentWorks.filter(work =>
    work.work_detail?.place?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.boy?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.work_detail?.Auditorium_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.work_detail?.Catering_company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRetry = () => {
    dispatch(fetchMyWorks());
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 border-4 border-orange-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <ChefHat className="w-8 h-8 text-orange-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-lg font-medium text-gray-700">Loading your works...</p>
            <p className="text-sm text-gray-500">We're preparing everything for you</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Error Loading Works</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalWorks = Array.isArray(workData) ? workData.length : 0;

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRetry}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Works</h1>
                <p className="text-gray-600">Manage your catering assignments and track progress</p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search works..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards - Modified for responsive layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Total Works Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Works</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">{totalWorks}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Pending</p>
                  <p className="text-xl md:text-2xl font-bold text-yellow-600">{worksByStatus.pending.length}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Accepted Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Accepted</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">{worksByStatus.accepted.length}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Rejected Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Rejected</p>
                  <p className="text-xl md:text-2xl font-bold text-red-600">{worksByStatus.rejected.length}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === tab.id
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Works Grid */}
          <div className="grid gap-6">
            {filteredWorks.length > 0 ? (
              filteredWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))
            ) : (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No works found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'No works available in this category'}
                </p>
                {!searchTerm && totalWorks === 0 && (
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Refresh Works
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyWorksPage;