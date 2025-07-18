import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCateringWorkList, getAssignedUsers, submitAttendanceRating } from '../../Services/Api/SubAdmin/SubLoginSlice';
import { Search, Filter, Calendar, MapPin, User, Phone, Eye, AlertCircle, RefreshCw, Users, Clock, ExternalLink, Star, StarOff, CheckCircle, X } from 'lucide-react';

const CateringWorks = () => {
  const dispatch = useDispatch();
  const { cateringWorkList, assignedUsers, attendanceRating } = useSelector((state) => state.subAdminAuth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');
  const [selectedWork, setSelectedWork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [currentRatingUser, setCurrentRatingUser] = useState(null);
  const [currentWorkId, setCurrentWorkId] = useState(null);
  const [ratings, setRatings] = useState({
    pant: false,
    shoe: false,
    timing: false,
    neatness: false,
    performance: false,
    travel_allowance: '',
    over_time: '',
    bonus: '',
    long_fare: ''
  });

  useEffect(() => {
    dispatch(getCateringWorkList());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getCateringWorkList());
  };

  const filteredWorks = cateringWorkList.data.filter(work => {
    const matchesSearch = work.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.place?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.work_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.Auditorium_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.Catering_company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || work.status === filterStatus;
    const matchesWorkType = filterWorkType === 'all' || work.work_type === filterWorkType;
    
    return matchesSearch && matchesStatus && matchesWorkType;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWorkTypeColor = (workType) => {
    switch (workType?.toLowerCase()) {
      case 'wedding':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'break_fast':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lunch':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dinner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'party':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWorkType = (workType) => {
    if (!workType) return 'N/A';
    return workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const openModal = (work) => {
    setSelectedWork(work);
    setShowModal(true);
    // Fetch assigned users for this work
    dispatch(getAssignedUsers(work.id));
  };

  const closeModal = () => {
    setSelectedWork(null);
    setShowModal(false);
  };

  const openAttendanceModal = (work) => {
    setCurrentWorkId(work.id);
    setShowAttendanceModal(true);
    // Fetch assigned users for this work
    dispatch(getAssignedUsers(work.id));
  };

  const closeAttendanceModal = () => {
    setShowAttendanceModal(false);
    setCurrentRatingUser(null);
    setCurrentWorkId(null);
    setRatings({
      pant: false,
      shoe: false,
      timing: false,
      neatness: false,
      performance: false,
      travel_allowance: '',
      over_time: '',
      bonus: '',
      long_fare: ''
    });
  };

  const submitRating = () => {
    if (!currentRatingUser || !currentWorkId) return;

    const ratingData = {
      user: currentRatingUser.user_id,
      work: currentWorkId,
      pant: ratings.pant,
      shoe: ratings.shoe,
      timing: ratings.timing,
      neatness: ratings.neatness,
      performance: ratings.performance,
      travel_allowance: ratings.travel_allowance ? parseFloat(ratings.travel_allowance) : 0,
      over_time: ratings.over_time ? parseFloat(ratings.over_time) : 0,
      bonus: ratings.bonus ? parseFloat(ratings.bonus) : 0,
      long_fare: ratings.long_fare ? parseFloat(ratings.long_fare) : 0
    };
    console.log(ratingData);
    dispatch(submitAttendanceRating(ratingData));
  };

  const handleRatingChange = (field, value) => {
    setRatings(prev => ({
      ...prev,
      [field]: value
    }));
  };


  // Get unique work types for filter
  const workTypes = [...new Set(cateringWorkList.data.map(work => work.work_type).filter(Boolean))];
  const currentAssignedUsers = currentWorkId ? assignedUsers.data[currentWorkId] || [] : [];
  const selectedWorkAssignedUsers = selectedWork ? assignedUsers.data[selectedWork.id] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catering Works</h1>
            <p className="text-sm text-gray-600">Manage all catering assignments</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={cateringWorkList.isLoading}
            className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-5 w-5 ${cateringWorkList.isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search works..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-shrink-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="confirmed">Confirmed</option>
          </select>
          
          <select
            value={filterWorkType}
            onChange={(e) => setFilterWorkType(e.target.value)}
            className="flex-shrink-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="all">All Types</option>
            {workTypes.map(workType => (
              <option key={workType} value={workType}>
                {formatWorkType(workType)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {cateringWorkList.isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center">
            <RefreshCw className="h-5 w-5 animate-spin mr-2 text-blue-500" />
            <span className="text-gray-600">Loading catering works...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {cateringWorkList.error && (
        <div className="mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700 text-sm font-medium">{cateringWorkList.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Works Cards */}
      {/* Updated Work Cards Section */}
{!cateringWorkList.isLoading && !cateringWorkList.error && (
  <div className="space-y-3">
    {filteredWorks.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>No catering works found.</p>
      </div>
    ) : (
      filteredWorks.map((work) => (
        <div key={work.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getWorkTypeColor(work.work_type)}`}>
              {formatWorkType(work.work_type)}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(work.status)}`}>
              {work.status ? work.status.charAt(0).toUpperCase() + work.status.slice(1) : 'Unknown'}
            </span>
          </div>

          {/* Venue - Highlighted */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{work.Auditorium_name || 'Venue Not Specified'}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="flex-1">{work.place || 'N/A'}, {work.district || 'N/A'}</span>
              {work.location_url && (
                <a
                  href={work.location_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 p-1 ml-2"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-xs text-gray-500">Date</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatDate(work.date)}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-xs text-gray-500">Time</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatTime(work.reporting_time)}</span>
            </div>
          </div>

          {/* Boys Count */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-base font-bold text-blue-900">{work.no_of_boys_needed || 0} Boys Needed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => openModal(work)}
              className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </button>
            <button
              onClick={() => openAttendanceModal(work)}
              className="flex-1 bg-green-50 text-green-700 border border-green-200 rounded-lg py-2 px-4 text-sm font-medium hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <Star className="h-4 w-4 mr-2" />
              Mark Attendance
            </button>
          </div>
        </div>
      ))
    )}
  </div>
)}

{/* Updated Detail Modal */}
{showModal && selectedWork && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
    <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Work Details</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Venue - Highlighted */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-bold text-blue-900 text-xl mb-2">{selectedWork.Auditorium_name || 'Venue Not Specified'}</h4>
          <div className="flex items-center text-blue-700">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{selectedWork.place || 'N/A'}, {selectedWork.district || 'N/A'}</span>
            {selectedWork.location_url && (
              <a
                href={selectedWork.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 p-1 ml-2"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          {selectedWork.address && (
            <p className="text-sm text-blue-600 mt-2">{selectedWork.address}</p>
          )}
        </div>

        {/* Work Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Work Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Work Type</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getWorkTypeColor(selectedWork.work_type)}`}>
                {formatWorkType(selectedWork.work_type)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedWork.status)}`}>
                {selectedWork.status ? selectedWork.status.charAt(0).toUpperCase() + selectedWork.status.slice(1) : 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Published</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${selectedWork.is_published ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {selectedWork.is_published ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(selectedWork.date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reporting Time</span>
              <span className="text-sm font-medium text-gray-900">{formatTime(selectedWork.reporting_time)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Boys Needed</span>
              <span className="text-sm font-medium text-gray-900">{selectedWork.no_of_boys_needed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attendees</span>
              <span className="text-sm font-medium text-gray-900">{selectedWork.attendees || 0}</span>
            </div>
          </div>
        </div>

        {/* Assigned Users */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Assigned Users</h4>
          {assignedUsers.isLoading ? (
            <div className="text-center py-4">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto text-blue-500" />
              <p className="text-sm text-gray-600 mt-2">Loading assigned users...</p>
            </div>
          ) : selectedWorkAssignedUsers.length === 0 ? (
            <p className="text-sm text-gray-600">No users assigned to this work.</p>
          ) : (
            <div className="space-y-3">
              {selectedWorkAssignedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.user_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.type === 'supervisor' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {user.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(user.assigned_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        {selectedWork.instructions && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedWork.instructions}</p>
          </div>
        )}

        {/* About Work */}
        {selectedWork.About_work && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">About Work</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedWork.About_work}</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={closeModal}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Detail Modal */}
      {showModal && selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Work Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Work Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Work Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Work Type</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getWorkTypeColor(selectedWork.work_type)}`}>
                      {formatWorkType(selectedWork.work_type)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedWork.status)}`}>
                      {selectedWork.status ? selectedWork.status.charAt(0).toUpperCase() + selectedWork.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Published</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${selectedWork.is_published ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                      {selectedWork.is_published ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(selectedWork.date)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reporting Time</span>
                    <span className="text-sm font-medium text-gray-900">{formatTime(selectedWork.reporting_time)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Boys Needed</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.no_of_boys_needed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attendees</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.attendees || 0}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.customer_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mobile</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.customer_mobile || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Location Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Address</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{selectedWork.address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Place</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.place || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">District</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.district || 'N/A'}</span>
                  </div>
                  {selectedWork.location_url && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Map</span>
                      <a
                        href={selectedWork.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        View Location <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Users */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Assigned Users</h4>
                {assignedUsers.isLoading ? (
                  <div className="text-center py-4">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto text-blue-500" />
                    <p className="text-sm text-gray-600 mt-2">Loading assigned users...</p>
                  </div>
                ) : selectedWorkAssignedUsers.length === 0 ? (
                  <p className="text-sm text-gray-600">No users assigned to this work.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedWorkAssignedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.user_name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.type === 'supervisor' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {user.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(user.assigned_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Auditorium</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.Auditorium_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Catering Company</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWork.Catering_company || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(selectedWork.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Updated</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(selectedWork.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {selectedWork.instructions && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedWork.instructions}</p>
                </div>
              )}

              {/* About Work */}
              {selectedWork.About_work && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">About Work</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedWork.About_work}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={closeModal}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Rating Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">c</h3>
                <button
                  onClick={closeAttendanceModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {assignedUsers.isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto text-blue-500" />
                  <p className="text-sm text-gray-600 mt-2">Loading assigned users...</p>
                </div>
              ) : currentAssignedUsers.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No users assigned to this work.</p>
              ) : (
                <div className="space-y-4">
                  {currentAssignedUsers.filter(user => user.type === 'boy').map((user) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.user_name}</h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setCurrentRatingUser(user)}
                        className="w-full bg-blue-50 text-blue-700 border border-blue-200 rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Rate this user
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Form Modal */}
      {currentRatingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full h-screen overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Rate {currentRatingUser.user_name}</h3>
                <button
                  onClick={() => setCurrentRatingUser(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6 pb-40">
              {/* Pant Rating */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Pant</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRatingChange('pant', true)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.pant === true 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Good
                  </button>
                  <button
                    onClick={() => handleRatingChange('pant', false)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.pant === false 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Poor
                  </button>
                </div>
              </div>

              {/* Shoe Rating */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Shoe</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRatingChange('shoe', true)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.shoe === true 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Good
                  </button>
                  <button
                    onClick={() => handleRatingChange('shoe', false)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.shoe === false 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Poor
                  </button>
                </div>
              </div>

              {/* Timing Rating */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Timing</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRatingChange('timing', true)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.timing === true 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Good
                  </button>
                  <button
                    onClick={() => handleRatingChange('timing', false)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.timing === false 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Poor
                  </button>
                </div>
              </div>

              {/* Neatness Rating */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Neatness</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRatingChange('neatness', true)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.neatness === true 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Good
                  </button>
                  <button
                    onClick={() => handleRatingChange('neatness', false)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.neatness === false 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Poor
                  </button>
                </div>
              </div>

              {/* Performance */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Performance</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRatingChange('performance', true)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.performance === true 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Good
                  </button>
                  <button
                    onClick={() => handleRatingChange('performance', false)}
                    className={`flex items-center justify-center px-4 py-4 rounded-xl border text-base font-medium transition-colors ${
                      ratings.performance === false 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Poor
                  </button>
                </div>
              </div>

              {/* Travel Allowance */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Travel Allowance (₹)</label>
                <input
                  type="number"
                  value={ratings.travel_allowance}
                  onChange={(e) => handleRatingChange('travel_allowance', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Over Time */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Over Time (₹)</label>
                <input
                  type="number"
                  value={ratings.over_time}
                  onChange={(e) => handleRatingChange('over_time', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Bonus */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Bonus (₹)</label>
                <input
                  type="number"
                  value={ratings.bonus}
                  onChange={(e) => handleRatingChange('bonus', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Long Fare */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-4">Long Fare (₹)</label>
                <input
                  type="number"
                  value={ratings.long_fare}
                  onChange={(e) => handleRatingChange('long_fare', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
              <button
                onClick={submitRating}
                disabled={attendanceRating.isLoading}
                className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base"
              >
                {attendanceRating.isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Rating'
                )}
              </button>
              
              <button
                onClick={() => setCurrentRatingUser(null)}
                className="w-full bg-gray-100 text-gray-700 py-4 px-4 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringWorks;