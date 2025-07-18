import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getUsersList, 
  createUser, 
  editUser, 
  clearUserCreationState, 
  clearUserEditState,
  clearUsersListError 
} from '../../Services/Api/SubAdmin/SubLoginSlice';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  Bike,
  CreditCard,
  ChevronRight,
  Menu
} from 'lucide-react';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { usersList, userCreation, userEdit } = useSelector((state) => state.subAdminAuth);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    email: '',
    role: 'boys',
    password: '',
    mobile_number: '',
    user_name: ''
  });

  const [editFormData, setEditFormData] = useState({
    email: '',
    role: '',
    password: '',
    mobile_number: '',
    user_name: '',
    address: '',
    district: '',
    place: '',
    employment_type: '',
    experienced: false,
    has_bike: false,
    has_license: false,
    is_active: true,
    is_staff: false,
    is_approved: false
  });

  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const roleOptions = [
    { value: 'boys', label: 'Boys' },
    { value: 'subadmin', label: 'Sub Admin' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'admin', label: 'Admin' }
  ];

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  useEffect(() => {
    if (userCreation.success) {
      setShowCreateModal(false);
      setCreateFormData({
        email: '',
        role: 'boys',
        password: '',
        mobile_number: '',
        user_name: ''
      });
      setCreateErrors({});
      dispatch(clearUserCreationState());
    }
  }, [userCreation.success, dispatch]);

  useEffect(() => {
    if (userEdit.success) {
      setShowEditModal(false);
      setEditFormData({
        email: '',
        role: '',
        password: '',
        mobile_number: '',
        user_name: ''
      });
      setEditErrors({});
      setSelectedUser(null);
      dispatch(clearUserEditState());
    }
  }, [userEdit.success, dispatch]);

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (createErrors[name]) {
      setCreateErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCreateForm = () => {
    const newErrors = {};

    if (!createFormData.user_name.trim()) newErrors.user_name = 'Username is required';
    if (!createFormData.email.trim()) newErrors.email = 'Email is required';
    if (!createFormData.password.trim()) newErrors.password = 'Password is required';
    if (!createFormData.mobile_number.trim()) newErrors.mobile_number = 'Mobile number is required';
    if (!createFormData.role.trim()) newErrors.role = 'Role is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (createFormData.email && !emailRegex.test(createFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (createFormData.mobile_number && !mobileRegex.test(createFormData.mobile_number)) {
      newErrors.mobile_number = 'Please enter a valid 10-digit mobile number';
    }

    setCreateErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.user_name.trim()) newErrors.user_name = 'Username is required';
    if (!editFormData.email.trim()) newErrors.email = 'Email is required';
    if (!editFormData.mobile_number.trim()) newErrors.mobile_number = 'Mobile number is required';
    if (!editFormData.role.trim()) newErrors.role = 'Role is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editFormData.email && !emailRegex.test(editFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (editFormData.mobile_number && !mobileRegex.test(editFormData.mobile_number)) {
      newErrors.mobile_number = 'Please enter a valid 10-digit mobile number';
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCreateForm()) return;

    try {
      const userData = {
        email: createFormData.email,
        role: createFormData.role,
        password: createFormData.password,
        mobile_number: parseInt(createFormData.mobile_number),
        user_name: createFormData.user_name
      };

      await dispatch(createUser(userData)).unwrap();
      dispatch(getUsersList());
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) return;

    try {
      const userData = {
        email: editFormData.email,
        role: editFormData.role,
        mobile_number: parseInt(editFormData.mobile_number),
        user_name: editFormData.user_name,
        address: editFormData.address,
        district: editFormData.district,
        place: editFormData.place,
        employment_type: editFormData.employment_type,
        experienced: editFormData.experienced,
        has_bike: editFormData.has_bike,
        has_license: editFormData.has_license,
        is_active: editFormData.is_active,
        is_staff: editFormData.is_staff,
        is_approved: editFormData.is_approved
      };

      if (editFormData.password.trim()) {
        userData.password = editFormData.password;
      }

      await dispatch(editUser({ userId: selectedUser.id, userData })).unwrap();
      dispatch(getUsersList());
    } catch (error) {
      console.error('Failed to edit user:', error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      email: user.email || '',
      role: user.role || '',
      password: '',
      mobile_number: user.mobile_number || '',
      user_name: user.user_name || '',
      address: user.address || '',
      district: user.district || '',
      place: user.place || '',
      employment_type: user.employment_type || '',
      experienced: user.experienced || false,
      has_bike: user.has_bike || false,
      has_license: user.has_license || false,
      is_active: user.is_active || true,
      is_staff: user.is_staff || false,
      is_approved: user.is_approved || false
    });
    setShowEditModal(true);
  };

  const refreshUsersList = () => {
    dispatch(getUsersList());
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      email: '',
      role: 'boys',
      password: '',
      mobile_number: '',
      user_name: ''
    });
    setCreateErrors({});
    dispatch(clearUserCreationState());
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData({
      email: '',
      role: '',
      password: '',
      mobile_number: '',
      user_name: '',
      address: '',
      district: '',
      place: '',
      employment_type: '',
      experienced: false,
      has_bike: false,
      has_license: false,
      is_active: true,
      is_staff: false,
      is_approved: false
    });
    setEditErrors({});
    setSelectedUser(null);
    dispatch(clearUserEditState());
  };

  const filteredUsers = usersList.data.filter(user => {
    const matchesSearch = user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const uniqueRoles = [...new Set(usersList.data.map(user => user.role))];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'subadmin': return 'bg-purple-100 text-purple-800';
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Users</h1>
              <p className="text-sm text-gray-600">Manage system users</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={refreshUsersList}
              className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {showFilters && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {userCreation.success && (
        <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-700 text-sm">User created successfully!</p>
          </div>
        </div>
      )}

      {userEdit.success && (
        <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-700 text-sm">User updated successfully!</p>
          </div>
        </div>
      )}

      {(usersList.error || userCreation.error || userEdit.error) && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">
              {usersList.error || userCreation.error || userEdit.error}
            </p>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="px-4 py-4">
        {usersList.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' ? 'Try adjusting your search criteria.' : 'Get started by creating a new user.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.user_name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.mobile_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-500">ID: {user.user_id}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
                <button
                  onClick={closeCreateModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Username
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={createFormData.user_name}
                  onChange={handleCreateInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    createErrors.user_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter username"
                />
                {createErrors.user_name && (
                  <p className="mt-1 text-sm text-red-600">{createErrors.user_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={createFormData.email}
                  onChange={handleCreateInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    createErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email"
                />
                {createErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{createErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={createFormData.mobile_number}
                  onChange={handleCreateInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    createErrors.mobile_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter mobile number"
                />
                {createErrors.mobile_number && (
                  <p className="mt-1 text-sm text-red-600">{createErrors.mobile_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Role
                </label>
                <select
                  name="role"
                  value={createFormData.role}
                  onChange={handleCreateInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    createErrors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {roleOptions.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                {createErrors.role && (
                  <p className="mt-1 text-sm text-red-600">{createErrors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={createFormData.password}
                  onChange={handleCreateInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    createErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
                {createErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{createErrors.password}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userCreation.isLoading}
                  className="flex-1 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {userCreation.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Username
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={editFormData.user_name}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.user_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter username"
                />
                {editErrors.user_name && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.user_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email"
                />
                {editErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={editFormData.mobile_number}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.mobile_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter mobile number"
                />
                {editErrors.mobile_number && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.mobile_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Role
                </label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {roleOptions.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                {editErrors.role && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter address"
                />
                {editErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={editFormData.district}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter district"
                />
                {editErrors.district && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.district}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Place
                </label>
                <input
                  type="text"
                  name="place"
                  value={editFormData.place}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.place ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter place"
                />
                {editErrors.place && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.place}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="h-4 w-4 inline mr-1" />
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={editFormData.employment_type}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.employment_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select employment type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                </select>
                {editErrors.employment_type && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.employment_type}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Experienced
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="experienced"
                      checked={editFormData.experienced}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, experienced: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    <Bike className="h-4 w-4 inline mr-1" />
                    Has Bike
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_bike"
                      checked={editFormData.has_bike}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, has_bike: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    <CreditCard className="h-4 w-4 inline mr-1" />
                    Has License
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_license"
                      checked={editFormData.has_license}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, has_license: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Active Status
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editFormData.is_active}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 inline mr-1" />
                    Staff Status
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_staff"
                      checked={editFormData.is_staff}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, is_staff: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Approved
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_approved"
                      checked={editFormData.is_approved}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, is_approved: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                />
                {editErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{editErrors.password}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userEdit.isLoading}
                  className="flex-1 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {userEdit.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* User Profile Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedUser.user_name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User ID</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.user_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Username</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.user_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mobile</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.mobile_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Account Status
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Role</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`text-sm font-medium ${selectedUser.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Staff</span>
                      <span className={`text-sm font-medium ${selectedUser.is_staff ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.is_staff ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approved</span>
                      <span className={`text-sm font-medium ${selectedUser.is_approved ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.is_approved ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Address</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.address || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">District</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.district || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Place</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.place || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Employment Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Employment Type</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.employment_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Experienced</span>
                      <span className={`text-sm font-medium ${selectedUser.experienced ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.experienced ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Has Bike</span>
                      <span className={`text-sm font-medium ${selectedUser.has_bike ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.has_bike ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Has License</span>
                      <span className={`text-sm font-medium ${selectedUser.has_license ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.has_license ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Account Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(selectedUser.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Login</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(selectedUser.last_login)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditUser(selectedUser);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;