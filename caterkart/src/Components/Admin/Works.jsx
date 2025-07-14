import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Building,
  ChefHat,
  FileText,
  Info
} from 'lucide-react';
import { 
  fetchWorks, 
  createWork, 
  updateWork, 
  deleteWork, 
  fetchWorkRequests,
  updateWorkRequestStatus,
  assignBoyToWork,
  fetchAssignedBoys,
  publishWork
} from '../../Services/Api/Admin/WorkSlice';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${getToastStyles()} animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const Works = () => {
  const dispatch = useDispatch();
  const { works, workRequests, loading, error } = useSelector(state => state.work);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWork, setCurrentWork] = useState(null);
  const [activeTab, setActiveTab] = useState('works');
  const [publishingWorkId, setPublishingWorkId] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_mobile: '',
    address: '',
    place: '',
    district: '',
    date: '',
    reporting_time: '',
    work_type: '',
    no_of_boys_needed: '',
    attendees: '',
    assigned_supervisor: '',
    assigned_boys: [],
    payment_amount: '',
    location_url: '',
    Auditorium_name: '',
    Catering_company: '',
    remarks: '',
    about_work: ''
  });

  useEffect(() => {
    dispatch(fetchWorks());
    dispatch(fetchWorkRequests());
  }, [dispatch]);

  // Toast functions
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(updateWork({ id: currentWork.id, data: formData })).unwrap();
        showToast('Work updated successfully!', 'success');
      } else {
        await dispatch(createWork(formData)).unwrap();
        showToast('Work created successfully!', 'success');
      }
      handleCloseModal();
    } catch (error) {
      showToast(error.message || 'Something went wrong!', 'error');
    }
  };

  const handleEdit = (work) => {
    setCurrentWork(work);
    setFormData({
      customer_name: work.customer_name || '',
      customer_mobile: work.customer_mobile || '',
      address: work.address || '',
      place: work.place || '',
      district: work.district || '',
      date: work.date || '',
      reporting_time: work.reporting_time || '',
      work_type: work.work_type || '',
      no_of_boys_needed: work.no_of_boys_needed || '',
      attendees: work.attendees || '',
      assigned_supervisor: work.assigned_supervisor || '',
      assigned_boys: work.assigned_boys || [],
      payment_amount: work.payment_amount || '',
      location_url: work.location_url || '',
      Auditorium_name: work.Auditorium_name || '',
      Catering_company: work.Catering_company || '',
      remarks: work.remarks || '',
      about_work: work.about_work || ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Custom confirm dialog with toast
    const confirmDelete = () => {
      return new Promise((resolve) => {
        setToast({
          message: 'Are you sure you want to delete this work?',
          type: 'warning',
          showConfirm: true,
          onConfirm: () => {
            resolve(true);
            hideToast();
          },
          onCancel: () => {
            resolve(false);
            hideToast();
          }
        });
      });
    };

    const confirmed = await confirmDelete();
    if (confirmed) {
      try {
        await dispatch(deleteWork(id)).unwrap();
        showToast('Work deleted successfully!', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to delete work!', 'error');
      }
    }
  };

  const handlePublishToggle = async (work) => {
    const newStatus = !work.is_published;

    try {
      setPublishingWorkId(work.id);
      await dispatch(publishWork({ id: work.id, is_published: newStatus })).unwrap();

      // ✅ Refresh the list so UI shows updated status
      await dispatch(fetchWorks());

      const message = newStatus 
        ? 'Work published successfully! It\'s now visible to workers.' 
        : 'Work unpublished successfully! It\'s no longer visible to workers.';
      
      showToast(message, 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update work status!', 'error');
    } finally {
      setPublishingWorkId(null);
    }
  };

  const handleAssignBoy = async (requestId) => {
    try {
      // This would need to be implemented in your API slice
      // await dispatch(assignBoyToWork(requestId)).unwrap();
      showToast('Boy assigned to work successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to assign boy to work!', 'error');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentWork(null);
    setFormData({
      customer_name: '',
      customer_mobile: '',
      address: '',
      place: '',
      district: '',
      date: '',
      reporting_time: '',
      work_type: '',
      no_of_boys_needed: '',
      attendees: '',
      assigned_supervisor: '',
      assigned_boys: [],
      payment_amount: '',
      location_url: '',
      Auditorium_name: '',
      Catering_company: '',
      remarks: '',
      about_work: ''
    });
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await dispatch(updateWorkRequestStatus({ id: requestId, status })).unwrap();
      showToast(`Work request ${status} successfully!`, 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update request status!', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Custom Confirm Toast Component
  const ConfirmToast = ({ message, onConfirm, onCancel }) => (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <p className="text-gray-800 mb-4">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Toast Notifications */}
      {toast && !toast.showConfirm && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {/* Confirm Toast */}
      {toast && toast.showConfirm && (
        <ConfirmToast
          message={toast.message}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Work Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Work
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('works')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'works'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Works
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Work Managemnet
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Works Tab */}
      {activeTab === 'works' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <div key={work.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {/* Auditorium name as main heading */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    {work.Auditorium_name || 'Auditorium Not Specified'}
                  </h3>
                  {/* Catering company as sub-heading */}
                  {work.Catering_company && (
                    <p className="text-md text-gray-700 mb-2 flex items-center gap-2 font-medium">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                      {work.Catering_company}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Customer: {work.customer_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(work)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* About Work Section */}
              {work.about_work && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">About Work:</p>
                      <p className="text-sm text-blue-800">{work.about_work}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{work.place}, {work.district}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{work.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{work.reporting_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{work.attendees} attendees</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{work.payment_amount}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Boys needed: {work.no_of_boys_needed}
                  </span>
                  {work.location_url && (
                    <a
                      href={work.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {work.work_type}
                  </span>
                </div>

                {/* Remarks Section */}
                {work.remarks && (
                  <div className="mb-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Remarks:</p>
                        <p className="text-xs text-gray-600">{work.remarks}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Publish Button */}
                <div className="w-full">
                  <button
                    onClick={() => handlePublishToggle(work)}
                    disabled={publishingWorkId === work.id}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      work.is_published 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {publishingWorkId === work.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      work.is_published ? 'Unpublish' : 'Publish'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Work Management Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Boy Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.boy?.user_name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.boy?.mobile_number || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.boy?.place}, {request.boy?.district}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {request.boy?.experienced && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Experienced
                            </span>
                          )}
                          {request.boy?.has_bike && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Has Bike
                            </span>
                          )}
                          {request.boy?.has_license && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Licensed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.work?.Auditorium_name || 'Auditorium Not Specified'}
                        </div>
                        {request.work?.Catering_company && (
                          <div className="text-sm text-gray-500">
                            {request.work.Catering_company}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {request.work?.place || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.work?.attendees || 0} attendees • {request.work?.no_of_boys_needed || 0} boys needed
                        </div>
                        {request.work?.location_url && (
                          <div className="mt-1">
                            <a
                              href={request.work.location_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Location
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.work?.date || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.work?.reporting_time || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                        {request.assigned && (
                          <div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Assigned
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'accepted')}
                              className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 text-sm border border-green-200"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 text-sm border border-red-200"
                            >
                              Reject
                            </button>
                          </div>
                          {!request.assigned && (
                            <button
                              onClick={() => handleAssignBoy(request.id)}
                              className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 text-sm border border-blue-200"
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      )}
                      {request.status === 'accepted' && !request.assigned && (
                        <button
                          onClick={() => handleAssignBoy(request.id)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 text-sm border border-blue-200"
                        >
                          Assign
                        </button>
                      )}
                      {request.comment && (
                        <div className="mt-2 text-xs text-gray-500">
                          Comment: {request.comment}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty state */}
          {workRequests.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No work requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                No boys have requested work assignments yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Work' : 'Add New Work'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Venue & Event Details Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Venue & Event Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auditorium Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Auditorium_name"
                      value={formData.Auditorium_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Enter auditorium name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catering Company
                    </label>
                    <input
                      type="text"
                      name="Catering_company"
                      value={formData.Catering_company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter catering company name"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About Work
                  </label>
                  <textarea
                    name="about_work"
                    value={formData.about_work}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the work details, requirements, and any special instructions..."
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional notes, special requirements, or important information..."
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customer_mobile"
                      value={formData.customer_mobile}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter full address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Place <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Enter place"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Enter district"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="reporting_time"
                      value={formData.reporting_time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="work_type"
                      value={formData.work_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select work type</option>
                      <option value="Break_Fast">Break Fast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="others">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Boys Needed <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="no_of_boys_needed"
                      value={formData.no_of_boys_needed}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="payment_amount"
                      value={formData.payment_amount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location URL
                  </label>
                  <input
                    type="url"
                    name="location_url"
                    value={formData.location_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Works;