import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchUpcomingWorks, 
  fetchAdminStats, 
  openModal, 
  closeModal, 
  getAssignedUsers 
} from '../../Services/Api/SubAdmin/DashboardSlice'
import {
  Users, CheckCircle, Clock, UserPlus, Calendar,
  MapPin, Timer, Utensils, Building2, UserCheck, X,
  User, ExternalLink, RefreshCw
} from 'lucide-react'

const SubAdminDashboard = () => {
  const dispatch = useDispatch()

  const {
    upcomingWorks,
    adminStats,
    loading,
    error,
    modal,
    assignedUsers
  } = useSelector((state) => state.subDashboard)

  useEffect(() => {
    dispatch(fetchUpcomingWorks())
    dispatch(fetchAdminStats())
  }, [dispatch])

  // Handle opening modal and fetching assigned users
  const handleViewWork = (work) => {
    dispatch(openModal(work))
    dispatch(getAssignedUsers(work.id))
  }

  // Handle closing modal
  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Helper functions for modal
  const getWorkTypeColor = (workType) => {
    switch (workType?.toLowerCase()) {
      case 'catering':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'event':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'wedding':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatWorkType = (workType) => {
    return workType?.charAt(0).toUpperCase() + workType?.slice(1) || 'Unknown'
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: adminStats.total_users,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Works Completed',
      value: adminStats.total_works_completed,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Works',
      value: adminStats.total_pending_works,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Join Requests',
      value: adminStats.total_pending_join_requests,
      icon: UserPlus,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

  // Get assigned users for the selected work
  const selectedWorkAssignedUsers = modal.selectedWork 
    ? assignedUsers.data[modal.selectedWork.id] || []
    : []

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SubAdmin Dashboard</h1>
          <p className="text-gray-600">Manage catering works and monitor system stats</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div key={index} className={`${card.bgColor} rounded-xl p-6 shadow-sm border border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading.adminStats ? '...' : card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Upcoming Works Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Upcoming Catering Works
            </h2>
            <span className="text-sm text-gray-500">
              {upcomingWorks.length} work{upcomingWorks.length !== 1 ? 's' : ''} scheduled
            </span>
          </div>

          {loading.upcomingWorks ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error.upcomingWorks ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Error loading upcoming works</p>
              <p className="text-sm text-gray-500">{error.upcomingWorks}</p>
            </div>
          ) : upcomingWorks.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming works scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingWorks.map((work) => (
                <div key={work.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900">{work.work_type}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      ID: {work.id}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {work.place}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      {work.Auditorium_name}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(work.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Timer className="h-4 w-4 mr-2" />
                      {formatTime(work.reporting_time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserCheck className="h-4 w-4 mr-2" />
                      {work.no_of_boys_needed} boys needed
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewWork(work)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Messages */}
        {error.adminStats && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">
              Error loading stats: {error.adminStats}
            </p>
          </div>
        )}

        {/* Modal */}
        {modal.isOpen && modal.selectedWork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Work Details</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Venue - Highlighted */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-xl mb-2">
                    {modal.selectedWork.Auditorium_name || 'Venue Not Specified'}
                  </h4>
                  <div className="flex items-center text-blue-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{modal.selectedWork.place || 'N/A'}, {modal.selectedWork.district || 'N/A'}</span>
                    {modal.selectedWork.location_url && (
                      <a
                        href={modal.selectedWork.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1 ml-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {modal.selectedWork.address && (
                    <p className="text-sm text-blue-600 mt-2">{modal.selectedWork.address}</p>
                  )}
                </div>

                {/* Work Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Work Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Work Type</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getWorkTypeColor(modal.selectedWork.work_type)}`}>
                        {formatWorkType(modal.selectedWork.work_type)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(modal.selectedWork.status)}`}>
                        {modal.selectedWork.status ? modal.selectedWork.status.charAt(0).toUpperCase() + modal.selectedWork.status.slice(1) : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Published</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${modal.selectedWork.is_published ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {modal.selectedWork.is_published ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Date</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(modal.selectedWork.date)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reporting Time</span>
                      <span className="text-sm font-medium text-gray-900">{formatTime(modal.selectedWork.reporting_time)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Boys Needed</span>
                      <span className="text-sm font-medium text-gray-900">{modal.selectedWork.no_of_boys_needed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Attendees</span>
                      <span className="text-sm font-medium text-gray-900">{modal.selectedWork.attendees || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Users */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Assigned Users</h4>
                  {loading.assignedUsers ? (
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
                {modal.selectedWork.instructions && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {modal.selectedWork.instructions}
                    </p>
                  </div>
                )}

                {/* About Work */}
                {modal.selectedWork.About_work && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">About Work</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {modal.selectedWork.About_work}
                    </p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubAdminDashboard