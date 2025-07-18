import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUpcomingWorks, fetchAdminStats } from '../../Services/Api/SubAdmin/DashboardSlice'
import {
  Users, CheckCircle, Clock, UserPlus, Calendar,
  MapPin, Timer, Utensils, Building2, UserCheck
} from 'lucide-react'

const SubAdminDashboard = () => {
  const dispatch = useDispatch()

  const {
    upcomingWorks,
    adminStats,
    loading,
    error
  } = useSelector((state) => state.subDashboard)

  useEffect(() => {
    dispatch(fetchUpcomingWorks())
    dispatch(fetchAdminStats())
  }, [dispatch])

  const handleViewWork = (workId) => {
    window.location.href = '/subadmin/catering-works/'
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
                    onClick={() => handleViewWork(work.id)}
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
      </div>
    </div>
  )
}

export default SubAdminDashboard
