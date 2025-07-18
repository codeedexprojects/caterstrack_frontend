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
  fetchWorkRequestsByWork,
  updateWorkRequestStatusAndAssign,
  assignSupervisors,
  assignBoyToWork,
  publishWork,
  fetchAssignedUsers,
  setSelectedWork,
  setShowDetailModal,
  setShowSupervisorModal,
  setShowBoyModal,
  clearSelectedWork
} from '../../Services/Api/Admin/WorkSlice';

import { getUsersList } from '../../Services/Api/Admin/UserSlice';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Increased timeout for better UX
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
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${getToastStyles()} animate-slide-in max-w-sm`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1 flex-shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const Works = () => {
  const dispatch = useDispatch();
  const { 
    works, 
    workRequests, 
    assignedUsers, 
    loading, 
    error,
    selectedWork,
    showDetailModal,
    showSupervisorModal,
    showBoyModal
  } = useSelector(state => state.work);
  const { users } = useSelector(state => state.users);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWork, setCurrentWork] = useState(null);
  const [publishingWorkId, setPublishingWorkId] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [selectedBoys, setSelectedBoys] = useState([]);
  const [availableBoys, setAvailableBoys] = useState([]);
  
  
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
    dispatch(getUsersList());
  }, [dispatch]);

  useEffect(() => {
    const boys = users.filter(user => user.role === 'boys');
    setAvailableBoys(boys);
  }, [users]);


  useEffect(() => {
    const supervisors = users.filter(user => user.role === 'supervisor');
    setAvailableSupervisors(supervisors);
  }, [users]);


  useEffect(() => {
  if (users.length > 0 && assignedUsers.users) {
    // Filter out already assigned supervisors
    const assignedSupervisorIds = assignedUsers.users
      .filter(user => user.role === 'supervisor')
      .map(user => user.id);
    
    const unassignedSupervisors = users.filter(user => 
      user.role === 'supervisor' && !assignedSupervisorIds.includes(user.id)
    );
    setAvailableSupervisors(unassignedSupervisors);
    
    // Filter out already assigned boys
    const assignedBoyIds = assignedUsers.users
      .filter(user => user.role === 'boys')
      .map(user => user.id);
    
    const unassignedBoys = users.filter(user => 
      user.role === 'boys' && !assignedBoyIds.includes(user.id)
    );
    setAvailableBoys(unassignedBoys);
  } else {
    // If no assigned users data, show all users
    setAvailableSupervisors(users.filter(user => user.role === 'supervisor'));
    setAvailableBoys(users.filter(user => user.role === 'boys'));
  }
}, [users, assignedUsers.users]);

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

const handleWorkClick = async (work) => {
  dispatch(setSelectedWork(work));
  dispatch(setShowDetailModal(true));
  
  try {
    // Load assigned users first
    await dispatch(fetchAssignedUsers(work.id));
    
    // Then load work requests
    await dispatch(fetchWorkRequestsByWork(work.id));
    
  } catch (error) {
    console.error('Failed to load work data:', error);
    showToast('Failed to load work data', 'error');
  }
};

const handleAssignSupervisors = async () => {
  if (!selectedWork || selectedSupervisors.length === 0) {
    showToast('Please select at least one supervisor', 'error');
    return;
  }

  try {
    const result = await dispatch(assignSupervisors({
      work: selectedWork.id,
      assignments: selectedSupervisors.map(id => ({ supervisor_id: id }))
    })).unwrap();
    
    showToast('Supervisors assigned successfully!', 'success');
    handleCloseSupervisorModal();
    
    // Refresh assigned users and work requests
    await dispatch(fetchAssignedUsers(selectedWork.id));
    await dispatch(fetchWorkRequestsByWork(selectedWork.id));
    
  } catch (error) {
    console.error('Supervisor assignment error:', error);
    showToast(error.message || error || 'Failed to assign supervisors', 'error');
  }
};

const handleAssignBoys = async () => {
  if (!selectedWork || selectedBoys.length === 0) {
    showToast('Please select at least one boy', 'error');
    return;
  }

  // This now directly sends an array of boy IDs, e.g., [3, 5]
  const payload = {
    work: selectedWork.id,
    boys: selectedBoys,
  };

  try {
    const result = await dispatch(assignBoyToWork(payload)).unwrap();
    showToast('Boys assigned successfully!', 'success');
    handleCloseBoyModal();

    // Refresh data
    await dispatch(fetchAssignedUsers(selectedWork.id));
    await dispatch(fetchWorkRequestsByWork(selectedWork.id));

  } catch (error) {
    console.error('Boy assignment error:', error);
    showToast(error.message || error || 'Failed to assign boys', 'error');
  }
};

  // Handle boy assignment (reject or assign)
  const handleBoyAction = async (requestId, action) => {
    try {
      if (action === 'reject') {
        await dispatch(updateWorkRequestStatusAndAssign({
          id: requestId,
          status: 'rejected',
          assigned: 0
        })).unwrap();
        showToast('Request rejected successfully!', 'success');
      } else if (action === 'assign') {
        await dispatch(updateWorkRequestStatusAndAssign({
          id: requestId,
          status: 'accepted',
          assigned: 1
        })).unwrap();
        showToast('Boy assigned successfully!', 'success');
      }
      // Refresh work requests
      await dispatch(fetchWorkRequestsByWork(selectedWork.id));
    } catch (error) {
      showToast(error.message || 'Failed to process request', 'error');
    }
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

  const handleCloseDetailModal = () => {
    dispatch(clearSelectedWork());
  };

  const handleOpenSupervisorModal = () => {
    dispatch(setShowSupervisorModal(true));
  };

  const handleCloseSupervisorModal = () => {
    dispatch(setShowSupervisorModal(false));
    setSelectedSupervisors([]);
  };

  const handleOpenBoyModal = () => {
    dispatch(setShowBoyModal(true));
  };

  const handleCloseBoyModal = () => {
    dispatch(setShowBoyModal(false));
    setSelectedBoys([]);
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

{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {error}
  </div>
)}

{/* Works Grid - Remove tabs, show only works */}
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
        
        {/* Action Buttons */}
        <div className="space-y-2">
          {/* View Details Button */}
          <button
            onClick={() => handleWorkClick(work)}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4" />
            View Details & Manage
          </button>
          
          {/* Publish Button */}
          <button
            onClick={() => handlePublishToggle(work)}
            disabled={publishingWorkId === work.id}
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
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

{/* Work Details Modal */}
{showDetailModal && selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building className="h-6 w-6 text-blue-600" />
                {selectedWork.Auditorium_name || 'Work Details'}
              </h2>
              {selectedWork.Catering_company && (
                <p className="text-lg text-gray-600 flex items-center gap-2 mt-1">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  {selectedWork.Catering_company}
                </p>
              )}
            </div>
              <button
                onClick={handleCloseDetailModal} // Updated
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

      {/* Work Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Work Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{selectedWork.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{selectedWork.reporting_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{selectedWork.attendees} attendees</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>₹{selectedWork.payment_amount}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {selectedWork.customer_name}</p>
            <p><strong>Mobile:</strong> {selectedWork.customer_mobile}</p>
            <p><strong>Location:</strong> {selectedWork.place}, {selectedWork.district}</p>
          </div>
        </div>
      </div>

      {/* Assigned Users Section */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Users</h3>

  {assignedUsers.users && assignedUsers.users.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assignedUsers.users.map((user) => (
        <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{user.user_name}</h4>
              <p className="text-sm text-gray-500">
                {user.role === 'supervisor' ? 'Supervisor' : 'Worker'}
              </p>
              {user.email && (
                <p className="text-sm text-gray-500">{user.email}</p>
              )}
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'supervisor' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Assigned: {new Date(user.assigned_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">No users assigned yet</p>
    </div>
  )}
</div>


      {/* Supervisor Assignment */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Supervisor Assignment</h3>
          <div className="flex gap-2">
              <button
                onClick={handleOpenBoyModal} // Updated
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Boy
              </button>
              <button
                onClick={handleOpenSupervisorModal} // Updated
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Assign Supervisors
              </button>
            </div>
        </div>
      </div>

      {/* Work Requests Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Work Requests</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Boy Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience & Skills
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
                      <div className="text-xs text-gray-400 mt-1">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                      {request.assigned === 1 && (
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBoyAction(request.id, 'assign')}
                          className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 text-sm border border-green-200"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => handleBoyAction(request.id, 'reject')}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 text-sm border border-red-200"
                        >
                          Reject
                        </button>
                      </div>
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
              No boys have requested this work yet.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}

{/* Boy Assignment Modal */}
{showBoyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assign Boys</h3>
              <button
                onClick={handleCloseBoyModal} // Updated
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
      
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {availableBoys.length > 0 ? (
          availableBoys.map((boy) => (
            <label key={boy.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selectedBoys.includes(boy.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBoys([...selectedBoys, boy.id]);
                  } else {
                    setSelectedBoys(selectedBoys.filter(id => id !== boy.id));
                  }
                }}
                className="mr-3"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{boy.user_name}</span>
                <div className="text-xs text-gray-500">
                  {boy.mobile_number && <span>{boy.mobile_number}</span>}
                  {boy.place && <span> • {boy.place}</span>}
                </div>
                <div className="flex gap-1 mt-1">
                  {boy.experienced && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Experienced
                    </span>
                  )}
                  {boy.has_bike && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Has Bike
                    </span>
                  )}
                </div>
              </div>
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No boys available</p>
        )}
      </div>
      
            <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseBoyModal} // Updated
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignBoys}
              disabled={selectedBoys.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Boys ({selectedBoys.length})
            </button>
          </div>
    </div>
  </div>
)}

{/* Supervisor Assignment Modal */}
{showSupervisorModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Assign Supervisors</h3>
        <button
          onClick={handleCloseSupervisorModal}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {availableSupervisors.length > 0 ? (
          availableSupervisors.map((supervisor) => (
            <label key={supervisor.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selectedSupervisors.includes(supervisor.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSupervisors([...selectedSupervisors, supervisor.id]);
                  } else {
                    setSelectedSupervisors(selectedSupervisors.filter(id => id !== supervisor.id));
                  }
                }}
                className="mr-3"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{supervisor.user_name}</span>
                <div className="text-xs text-gray-500">
                  {supervisor.mobile_number && <span>{supervisor.mobile_number}</span>}
                  {supervisor.place && <span> • {supervisor.place}</span>}
                </div>
              </div>
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No supervisors available</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleCloseSupervisorModal}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleAssignSupervisors}
          disabled={selectedSupervisors.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Assign Supervisors ({selectedSupervisors.length})
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Works;