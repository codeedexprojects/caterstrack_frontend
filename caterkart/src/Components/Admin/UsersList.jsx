import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsersList, clearUsersError, createUser, clearCreateError, getUserDetails, updateUserDetails, clearUpdateError } from '../../Services/Api/Admin/UserSlice';

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, isCreating, createError, userDetails, isLoadingDetails, isUpdating, updateError } = useSelector((state) => state.users);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isAddDetailsModalOpen, setIsAddDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    mobile_number: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [detailsFormData, setDetailsFormData] = useState({
    mobile_number: '',
    address: '',
    district: '',
    place: '',
    experienced: false,
    profile_image: null,
    main_area: '',
    employment_type: '',
    has_bike: false,
    has_license: false,
    license_image: null
  });

  const [formErrors, setFormErrors] = useState({});
  const [detailsFormErrors, setDetailsFormErrors] = useState({});

  const USER_ROLES = [
    { value: 'subadmin', label: 'Subadmin/Captain' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'head_boy', label: 'Head Boy' },
    { value: 'boys', label: 'Boys' }
  ];

  const EMPLOYMENT_TYPES = [
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Full Time', label: 'Full Time' }
  ];

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  // Clear create error when modal opens
  useEffect(() => {
    if (isCreateModalOpen) {
      dispatch(clearCreateError());
    }
  }, [isCreateModalOpen, dispatch]);

  // Clear update error when modal opens
  useEffect(() => {
    if (isAddDetailsModalOpen) {
      dispatch(clearUpdateError());
    }
  }, [isAddDetailsModalOpen, dispatch]);

  // Populate details form when user details are loaded
  useEffect(() => {
    if (userDetails && (isViewDetailsModalOpen || isAddDetailsModalOpen)) {
      setDetailsFormData({
        mobile_number: userDetails.mobile_number || '',
        address: userDetails.address || '',
        district: userDetails.district || '',
        place: userDetails.place || '',
        experienced: userDetails.experienced || false,
        profile_image: null, // Reset file input
        main_area: userDetails.main_area || '',
        employment_type: userDetails.employment_type || '',
        has_bike: userDetails.has_bike || false,
        has_license: userDetails.has_license || false,
        license_image: null // Reset file input
      });
    }
  }, [userDetails, isViewDetailsModalOpen, isAddDetailsModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDetailsInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setDetailsFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setDetailsFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (detailsFormErrors[name]) {
      setDetailsFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.user_name.trim()) {
      errors.user_name = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.mobile_number.trim()) {
      errors.mobile_number = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      errors.mobile_number = 'Mobile number must be 10 digits';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDetailsForm = () => {
    const errors = {};
    
    if (!detailsFormData.mobile_number.trim()) {
      errors.mobile_number = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(detailsFormData.mobile_number)) {
      errors.mobile_number = 'Mobile number must be 10 digits';
    }
    
    setDetailsFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for API (exclude confirmPassword)
    const { confirmPassword, ...submitData } = formData;
    
    try {
      await dispatch(createUser(submitData)).unwrap();
      
      // Reset form and close modal on success
      setFormData({
        user_name: '',
        email: '',
        mobile_number: '',
        role: '',
        password: '',
        confirmPassword: ''
      });
      setFormErrors({});
      setIsCreateModalOpen(false);
      
      // Refresh users list
      dispatch(getUsersList());
      
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDetailsForm()) {
      return;
    }
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(detailsFormData).forEach(key => {
        if (key === 'profile_image' || key === 'license_image') {
          // Only append files if they exist
          if (detailsFormData[key]) {
            formDataToSend.append(key, detailsFormData[key]);
          }
        } else {
          formDataToSend.append(key, detailsFormData[key]);
        }
      });
      
      await dispatch(updateUserDetails({ userId: selectedUserId, userData: formDataToSend })).unwrap();
      
      // Reset form and close modal on success
      setDetailsFormData({
        mobile_number: '',
        address: '',
        district: '',
        place: '',
        experienced: false,
        profile_image: null,
        main_area: '',
        employment_type: '',
        has_bike: false,
        has_license: false,
        license_image: null
      });
      setDetailsFormErrors({});
      setIsAddDetailsModalOpen(false);
      
      // Refresh users list
      dispatch(getUsersList());
      
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleViewDetails = async (userId) => {
    setSelectedUserId(userId);
    setIsViewDetailsModalOpen(true);
    dispatch(getUserDetails(userId));
  };

  const handleAddDetails = async (userId) => {
    setSelectedUserId(userId);
    setIsAddDetailsModalOpen(true);
    dispatch(getUserDetails(userId));
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setFormData({
      user_name: '',
      email: '',
      mobile_number: '',
      role: '',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    dispatch(clearCreateError());
  };

  const handleCloseViewDetailsModal = () => {
    setIsViewDetailsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleCloseAddDetailsModal = () => {
    setIsAddDetailsModalOpen(false);
    setSelectedUserId(null);
    setDetailsFormData({
      mobile_number: '',
      address: '',
      district: '',
      place: '',
      experienced: false,
      profile_image: null,
      main_area: '',
      employment_type: '',
      has_bike: false,
      has_license: false,
      license_image: null
    });
    setDetailsFormErrors({});
    dispatch(clearUpdateError());
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'subadmin':
        return 'bg-blue-100 text-blue-800';
      case 'supervisor':
        return 'bg-orange-100 text-orange-800';
      case 'head_boy':
        return 'bg-green-100 text-green-800';
      case 'boys':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'subadmin': 'Subadmin/Captain',
      'supervisor': 'Supervisor',
      'head_boy': 'Head Boy',
      'boys': 'Boys'
    };
    return roleMap[role] || role;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600">Manage all users in your system</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create User</span>
        </button>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => dispatch(clearUsersError())}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {createError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {createError}
          <button
            onClick={() => dispatch(clearCreateError())}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {updateError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {updateError}
          <button
            onClick={() => dispatch(clearUpdateError())}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.mobile_number || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleViewDetails(user.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleAddDetails(user.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Add Details
                    </button>
                    <button className="text-orange-600 hover:text-orange-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.user_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter username"
                    disabled={isCreating}
                  />
                  {formErrors.user_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.user_name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email"
                    disabled={isCreating}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.mobile_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter mobile number"
                    disabled={isCreating}
                  />
                  {formErrors.mobile_number && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.mobile_number}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isCreating}
                  >
                    <option value="">Select a role</option>
                    {USER_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                    disabled={isCreating}
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                    disabled={isCreating}
                  />
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isCreating ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewDetailsModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">User Details</h3>
                <button
                  onClick={handleCloseViewDetailsModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {isLoadingDetails ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : userDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <p className="text-sm text-gray-900">{userDetails.user_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900">{userDetails.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <p className="text-sm text-gray-900">{userDetails.mobile_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <p className="text-sm text-gray-900">{getRoleDisplayName(userDetails.role)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-sm text-gray-900">{userDetails.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <p className="text-sm text-gray-900">{userDetails.district || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                    <p className="text-sm text-gray-900">{userDetails.place || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Area</label>
                    <p className="text-sm text-gray-900">{userDetails.main_area || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <p className="text-sm text-gray-900">{userDetails.employment_type || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experienced</label>
                    <p className="text-sm text-gray-900">{userDetails.experienced ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Has Bike</label>
                    <p className="text-sm text-gray-900">{userDetails.has_bike ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Has License</label>
                    <p className="text-sm text-gray-900">{userDetails.has_license ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
                    <p className="text-sm text-gray-900">{userDetails.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approved Status</label>
                    <p className="text-sm text-gray-900">{userDetails.is_approved ? 'Approved' : 'Not Approved'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-sm text-gray-900">{userDetails.created_at ? new Date(userDetails.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  {userDetails.profile_image && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                      <img 
                        src={userDetails.profile_image} 
                        alt="Profile" 
                        className="w-20 h-20 object-cover rounded-full border"
                      />
                      </div>
                  )}
                  {userDetails.license_image && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Image</label>
                      <img 
                        src={userDetails.license_image} 
                        alt="License" 
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No user details available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Details Modal */}
      {isAddDetailsModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add/Edit User Details</h3>
                <button
                  onClick={handleCloseAddDetailsModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleDetailsSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile_number"
                      value={detailsFormData.mobile_number}
                      onChange={handleDetailsInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        detailsFormErrors.mobile_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter mobile number"
                      disabled={isUpdating}
                    />
                    {detailsFormErrors.mobile_number && (
                      <p className="mt-1 text-sm text-red-600">{detailsFormErrors.mobile_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={detailsFormData.address}
                      onChange={handleDetailsInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter address"
                      disabled={isUpdating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={detailsFormData.district}
                      onChange={handleDetailsInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter district"
                      disabled={isUpdating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Place
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={detailsFormData.place}
                      onChange={handleDetailsInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter place"
                      disabled={isUpdating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Area
                    </label>
                    <input
                      type="text"
                      name="main_area"
                      value={detailsFormData.main_area}
                      onChange={handleDetailsInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter main area"
                      disabled={isUpdating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      name="employment_type"
                      value={detailsFormData.employment_type}
                      onChange={handleDetailsInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                    >
                      <option value="">Select employment type</option>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="profile_image"
                      onChange={handleDetailsInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept="image/*"
                      disabled={isUpdating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Image
                    </label>
                    <input
                      type="file"
                      name="license_image"
                      onChange={handleDetailsInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept="image/*"
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="experienced"
                      name="experienced"
                      checked={detailsFormData.experienced}
                      onChange={handleDetailsInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isUpdating}
                    />
                    <label htmlFor="experienced" className="ml-2 block text-sm text-gray-700">
                      Experienced
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_bike"
                      name="has_bike"
                      checked={detailsFormData.has_bike}
                      onChange={handleDetailsInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isUpdating}
                    />
                    <label htmlFor="has_bike" className="ml-2 block text-sm text-gray-700">
                      Has Bike
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_license"
                      name="has_license"
                      checked={detailsFormData.has_license}
                      onChange={handleDetailsInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isUpdating}
                    />
                    <label htmlFor="has_license" className="ml-2 block text-sm text-gray-700">
                      Has License
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseAddDetailsModal}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Update Details'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;