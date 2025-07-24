import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import { getUsersList, clearUsersError, createUser, clearCreateError, getUserDetails, updateUserDetails, clearUpdateError, updateUser, deleteUser, clearDeleteError, searchUsers, filterUsers, clearSearchResults, clearFilterResults } from '../../Services/Api/Admin/UserSlice';
const UsersList = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, isCreating, createError, userDetails, isLoadingDetails, isUpdating, updateError, isDeleting, deleteError, searchResults, filterResults, isSearching, isFiltering, searchError, filterError } = useSelector((state) => state.users);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalUserData, setOriginalUserData] = useState(null);
  const [filterParams, setFilterParams] = useState({
    role: '',
    employment_type: '',
    has_bike: ''
  });
  const [displayUsers, setDisplayUsers] = useState([]);
  const [activeView, setActiveView] = useState('all'); // 'all', 'search', 'filter'
  
const [formData, setFormData] = useState({
  user_name: '',
  mobile_number: '',
  role: '',
  password: '',
  confirmPassword: '',
  address: '',
  district: '',
  place: '',
  experienced: false,
  employment_type: '',
  has_bike: false,
  has_license: false,
  license_image: null
});

  const [detailsFormData, setDetailsFormData] = useState({
    mobile_number: '',
    address: '',
    district: '',
    place: '',
    experienced: false,
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
    { value: 'part_time', label: 'Part Time' },
    { value: 'full_time', label: 'Full Time' }
  ];

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);


  const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

useEffect(() => {
  if (userDetails && isEditModalOpen && selectedUserForEdit) {
    const userData = {
      user_name: userDetails.user_name || '',
      mobile_number: userDetails.mobile_number || '',
      role: userDetails.role || '',
      password: '',
      confirmPassword: '',
      address: userDetails.address || '',
      district: userDetails.district || '',
      place: userDetails.place || '',
      experienced: userDetails.experienced || false,
      employment_type: userDetails.employment_type || '',
      has_bike: userDetails.has_bike || false,
      has_license: userDetails.has_license || false,
      license_image: null
    };
    
    setFormData(userData);
    // Store original data for comparison
    setOriginalUserData({
      user_name: userDetails.user_name || '',
      mobile_number: userDetails.mobile_number || '',
      role: userDetails.role || '',
      address: userDetails.address || '',
      district: userDetails.district || '',
      place: userDetails.place || '',
      experienced: userDetails.experienced || false,
      employment_type: userDetails.employment_type || '',
      has_bike: userDetails.has_bike || false,
      has_license: userDetails.has_license || false,
    });
  }
}, [userDetails, isEditModalOpen, selectedUserForEdit]);

  // Clear create error when modal opens
  useEffect(() => {
    if (isCreateModalOpen) {
      dispatch(clearCreateError());
    }
  }, [isCreateModalOpen, dispatch]);

  // Populate details form when user details are loaded
  useEffect(() => {
    if (userDetails && (isViewDetailsModalOpen)) {
      setDetailsFormData({
        mobile_number: userDetails.mobile_number || '',
        address: userDetails.address || '',
        district: userDetails.district || '',
        place: userDetails.place || '',
        experienced: userDetails.experienced || false,
        employment_type: userDetails.employment_type || '',
        has_bike: userDetails.has_bike || false,
        has_license: userDetails.has_license || false,
        license_image: null // Reset file input
      });
    }
  }, [userDetails, isViewDetailsModalOpen]);

useEffect(() => {
  if (activeView === 'search') {
    if (Array.isArray(searchResults)) {
      setDisplayUsers(searchResults);
    } else if (searchResults && searchResults.results && Array.isArray(searchResults.results)) {
      setDisplayUsers(searchResults.results);
    } else {
      setDisplayUsers([]);
    }
  } else if (activeView === 'filter') {
    if (Array.isArray(filterResults)) {
      setDisplayUsers(filterResults);
    } else if (filterResults && filterResults.results && Array.isArray(filterResults.results)) {
      setDisplayUsers(filterResults.results);
    } else {
      setDisplayUsers([]);
    }
  } else {
    setDisplayUsers(users || []);
  }
}, [users, searchResults, filterResults, activeView]);

// ADD this helper function
const getChangedFields = (originalData, currentData, excludeFields = []) => {
  const changedFields = {};
  
  Object.keys(currentData).forEach(key => {
    if (excludeFields.includes(key)) return;
    
    const originalValue = originalData[key];
    const currentValue = currentData[key];
    
    // Skip empty values
    if (currentValue === '' || currentValue === null || currentValue === undefined) {
      return;
    }
    
    // For new fields (not in original data) or changed values
    if (originalValue === undefined || originalValue !== currentValue) {
      changedFields[key] = currentValue;
    }
  });
  
  return changedFields;
};

const handleInputChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  
  if (type === 'file') {
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }
  
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
  
  if (!formData.user_name) {
    errors.user_name = 'Username is required';
  }
  
  if (!formData.mobile_number) {
    errors.mobile_number = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(formData.mobile_number)) {
    errors.mobile_number = 'Mobile number must be 10 digits';
  }
  
  if (!formData.role) {
    errors.role = 'Role is required';
  }
  
  // Only validate password if it's not empty (for edit mode)
  if (formData.password && formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  // Only check password confirmation if password is provided
  if (formData.password && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  // For create mode, password is required
  if (!selectedUserForEdit && !formData.password) {
    errors.password = 'Password is required';
  }
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

  const validateDetailsForm = () => {
    const errors = {};
    
    if (!detailsFormData.mobile_number) {
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
  
  try {
    // First create the user with basic details
    const { confirmPassword, address, district, place, experienced, employment_type, has_bike, has_license, license_image, ...basicUserData } = formData;
    const createResult = await dispatch(createUser(basicUserData)).unwrap();
    const newUserId = createResult.user.id;
    console.log(createResult.user.id) // Assuming the API returns the new user ID
    
    // Then add the additional details
    const detailsData = {
      mobile_number: formData.mobile_number,
      address,
      district,
      place,
      experienced,
      employment_type,
      has_bike,
      has_license,
      license_image: license_image ? await convertFileToBase64(license_image) : null
    };
    await dispatch(updateUserDetails({
      userId: newUserId,
      userData: detailsData
    })).unwrap();
    
    // Reset form and close modal
    setFormData({
      user_name: '', mobile_number: '', role: '', password: '', confirmPassword: '',
      address: '', district: '', place: '', experienced: false, employment_type: '',
      has_bike: false, has_license: false, license_image: null
    });
    setFormErrors({});
    setIsCreateModalOpen(false);
    dispatch(getUsersList());
    
  } catch (error) {
    console.error('Error creating user:', error);
  }
};


  const handleViewDetails = async (userId) => {
    setSelectedUserId(userId);
    setIsViewDetailsModalOpen(true);
    dispatch(getUserDetails(userId));
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setFormData({
      user_name: '',
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

const handleEdit = async (userId) => {
  const userToEdit = users.find(user => user.id === userId);
  
  // First get the detailed user information
  await dispatch(getUserDetails(userId));
  
  setSelectedUserForEdit(userToEdit);
  setIsEditModalOpen(true);
};

const handleSearch = async (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    try {
      const result = await dispatch(searchUsers(searchQuery));
      if (result.payload && Array.isArray(result.payload)) {
        setActiveView('search');
      } else if (result.payload && result.payload.results && Array.isArray(result.payload.results)) {
        setActiveView('search');
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }
};

const handleFilter = async () => {
  const activeFilters = Object.entries(filterParams).reduce((acc, [key, value]) => {
    if (value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  if (Object.keys(activeFilters).length > 0) {
    try {
      const result = await dispatch(filterUsers(activeFilters));
      if (result.payload && result.payload.results && Array.isArray(result.payload.results)) {
        setActiveView('filter');
      } else if (result.payload && Array.isArray(result.payload)) {
        setActiveView('filter');
      }
    } catch (error) {
      console.error('Filter error:', error);
    }
  }
};

const handleClearFilters = () => {
  setFilterParams({
    role: '',
    employment_type: '',
    has_bike: ''
  });
  setSearchQuery('');
  setActiveView('all');
  dispatch(clearSearchResults());
  dispatch(clearFilterResults());
};

const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilterParams(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleDelete = (userId) => {
  setUserToDelete(userId);
  setShowDeleteConfirm(true);
};

const confirmDelete = async () => {
  try {
    await dispatch(deleteUser(userToDelete)).unwrap();
    setShowDeleteConfirm(false);
    setUserToDelete(null);
    dispatch(getUsersList());
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const handleEditSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  if (!originalUserData) {
    console.error('No original data to compare');
    return;
  }
  
  try {
    const { confirmPassword, address, district, place, experienced, employment_type, has_bike, has_license, license_image, ...allBasicData } = formData;
    
    // Get only changed basic user fields
    const changedBasicData = getChangedFields(originalUserData, allBasicData, ['password']);
    
    // Handle password separately (only include if provided)
    if (formData.password && formData.password.trim() !== '') {
      changedBasicData.password = formData.password;
    }
    
    // Only update basic user info if there are changes
    if (Object.keys(changedBasicData).length > 0) {
      await dispatch(updateUser({ 
        userId: selectedUserForEdit.id, 
        userData: changedBasicData 
      })).unwrap();
    }
    
    // Get only changed details fields
    const currentDetailsData = {
      mobile_number: formData.mobile_number,
      address,
      district,
      place,
      experienced,
      employment_type,
      has_bike,
      has_license,
    };
    
    const changedDetailsData = getChangedFields(originalUserData, currentDetailsData);
    
    // Handle file separately (always include if new file is selected)
    if (license_image) {
      changedDetailsData.license_image = await convertFileToBase64(license_image);
    }
    
    // Only call updateUserDetails if there are changes
    if (Object.keys(changedDetailsData).length > 0) {
      await dispatch(updateUserDetails({
        userId: selectedUserForEdit.id,
        userData: changedDetailsData
      })).unwrap();
    }
    
    setFormData({
      user_name: '', mobile_number: '', role: '', password: '', confirmPassword: '',
      address: '', district: '', place: '', experienced: false, employment_type: '',
      has_bike: false, has_license: false, license_image: null
    });
    setFormErrors({});
    setIsEditModalOpen(false);
    setSelectedUserForEdit(null);
    setOriginalUserData(null); 
    
    dispatch(getUsersList());
    
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const handleCloseEditModal = () => {
  setIsEditModalOpen(false);
  setSelectedUserForEdit(null);
  setOriginalUserData(null); 
  setFormData({
    user_name: '', mobile_number: '', role: '', password: '', confirmPassword: '',
    address: '', district: '', place: '', experienced: false, employment_type: '',
    has_bike: false, has_license: false, license_image: null
  });
  setFormErrors({});
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
      {/* Fixed Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
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
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Search Section */}
            <div>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>
            
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <select
                name="role"
                value={filterParams.role}
                onChange={handleFilterChange}
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                {USER_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              
              <select
                name="employment_type"
                value={filterParams.employment_type}
                onChange={handleFilterChange}
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Employment Types</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              
              <select
                name="has_bike"
                value={filterParams.has_bike}
                onChange={handleFilterChange}
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Bike Status</option>
                <option value="true">Has Bike</option>
                <option value="false">No Bike</option>
              </select>
              
              <div className="flex gap-2">
                <button
                  onClick={handleFilter}
                  disabled={isFiltering}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {isFiltering ? 'Filtering...' : 'Filter'}
                </button>
                
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 whitespace-nowrap"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          {/* Active View Indicator */}
          {activeView !== 'all' && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {activeView === 'search' ? 'search' : 'filtered'} results 
              ({displayUsers.length} {displayUsers.length === 1 ? 'user' : 'users'})
            </div>
          )}
        </div>
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

      {deleteError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {deleteError}
          <button
            onClick={() => dispatch(clearDeleteError())}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(displayUsers) &&
                displayUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewDetails(user.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.mobile_number || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(user.id);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(user.id);
                        }}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user.id);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
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

                {/* Add these fields in the Create User Modal form */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter address"
    disabled={isCreating}
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
  <input
    type="text"
    name="district"
    value={formData.district}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter district"
    disabled={isCreating}
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
  <input
    type="text"
    name="place"
    value={formData.place}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter place"
    disabled={isCreating}
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
  <select
    name="employment_type"
    value={formData.employment_type}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    disabled={isCreating}
  >
    <option value="">Select employment type</option>
    {EMPLOYMENT_TYPES.map((type) => (
      <option key={type.value} value={type.value}>
        {type.label}
      </option>
    ))}
  </select>
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">License Image</label>
  <input
    type="file"
    name="license_image"
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    accept="image/*"
    disabled={isCreating}
  />
</div>

<div className="mb-4 flex items-center space-x-4">
  <div className="flex items-center">
    <input
      type="checkbox"
      id="experienced"
      name="experienced"
      checked={formData.experienced}
      onChange={handleInputChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      disabled={isCreating}
    />
    <label htmlFor="experienced" className="ml-2 block text-sm text-gray-700">Experienced</label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="has_bike"
      name="has_bike"
      checked={formData.has_bike}
      onChange={handleInputChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      disabled={isCreating}
    />
    <label htmlFor="has_bike" className="ml-2 block text-sm text-gray-700">Has Bike</label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="has_license"
      name="has_license"
      checked={formData.has_license}
      onChange={handleInputChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      disabled={isCreating}
    />
    <label htmlFor="has_license" className="ml-2 block text-sm text-gray-700">Has License</label>
  </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Id</label>
                    <p className="text-sm text-gray-900">{userDetails.user_id}</p>
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
      {/* Edit User Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
          <button
            onClick={handleCloseEditModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleEditSubmit}>
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
              disabled={isUpdating}
            />
            {formErrors.user_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.user_name}</p>
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
              disabled={isUpdating}
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
              disabled={isUpdating}
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
              Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
              disabled={isUpdating}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          {formData.password && (
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
                disabled={isUpdating}
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Add these fields in the Edit Modal after the role field */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter address"
    disabled={isUpdating}
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
  <input
    type="text"
    name="district"
    value={formData.district}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter district"
    disabled={isUpdating}
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
  <input
    type="text"
    name="place"
    value={formData.place}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter place"
    disabled={isUpdating}
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
  <select
    name="employment_type"
    value={formData.employment_type}
    onChange={handleInputChange}
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

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">License Image</label>
  <input
    type="file"
    name="license_image"
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    accept="image/*"
    disabled={isUpdating}
  />
</div>

<div className="mb-4 flex items-center space-x-4">
  <div className="flex items-center">
    <input
      type="checkbox"
      id="edit_experienced"
      name="experienced"
      checked={formData.experienced}
      onChange={handleInputChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      disabled={isUpdating}
    />
    <label htmlFor="edit_experienced" className="ml-2 block text-sm text-gray-700">Experienced</label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="edit_has_bike"
      name="has_bike"
      checked={formData.has_bike}
      onChange={handleInputChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      disabled={isUpdating}
    />
    <label htmlFor="edit_has_bike" className="ml-2 block text-sm text-gray-700">Has Bike</label>
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      id="edit_has_license"
      name="has_license"
      checked={formData.has_license}
      onChange={handleInputChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      disabled={isUpdating}
    />
    <label htmlFor="edit_has_license" className="ml-2 block text-sm text-gray-700">Has License</label>
  </div>
</div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCloseEditModal}
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
              {isUpdating ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{/* Delete Confirmation Modal */}
{showDeleteConfirm && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="flex justify-center">
          <Trash2 className="text-red-600 w-12 h-12" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UsersList;