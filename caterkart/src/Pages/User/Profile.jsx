import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Edit3,
  Camera,
  User,
  Briefcase,
  Scale,
  Ruler,
  LogOut,
  Smartphone,
  Home,
  Map,
  Award,
  FileText
} from 'lucide-react';
import Header from '../../Components/Users/Header';
import Footer from '../../Components/Users/Footer';
import { useNavigate } from 'react-router-dom';
import avatar from '../../assets/avatar.png'
import { fetchProfile, updateUserProfile, logoutUser } from '../../Services/Api/User/UserAuthSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { user, profile, isLoading, error } = useSelector((state) => state.userAuth);
  
  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    role: '',
    mobile_number: '',
    user_id: '',
    address: '',
    district: '',
    place: '',
    experienced: false,
    employment_type: '',
    has_bike: false,
    has_license: false,
    license_image: null
  });
  const [licensePreview, setLicensePreview] = useState(null);

  // Get profile data from either profile or user state
  const profileData = profile || user;

  useEffect(() => {
    // Fetch profile data when component mounts
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    // Update form data when profile data changes
    if (profileData) {
      setFormData({
        user_name: profileData.user_name || '',
        role: profileData.role || '',
        mobile_number: profileData.mobile_number || '',
        user_id: profileData.user_id || '',
        address: profileData.address || '',
        district: profileData.district || '',
        place: profileData.place || '',
        experienced: profileData.experienced || false,
        employment_type: profileData.employment_type || '',
        has_bike: profileData.has_bike || false,
        has_license: profileData.has_license || false,
        license_image: profileData.license_image || null
      });
      
      if (profileData.license_image) {
        setLicensePreview(profileData.license_image);
      }
    }
  }, [profileData]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLicenseImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          license_image: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('place', formData.place);
      formDataToSend.append('experienced', formData.experienced);
      formDataToSend.append('employment_type', formData.employment_type);
      formDataToSend.append('has_bike', formData.has_bike);
      formDataToSend.append('has_license', formData.has_license);
      
      if (formData.license_image instanceof File) {
        formDataToSend.append('license_image', formData.license_image);
      }

      const result = await dispatch(updateUserProfile(formDataToSend));
      
      if (updateUserProfile.fulfilled.match(result)) {
        setIsEditing(false);
        // Show success message (you can add a toast notification here)
        console.log('Profile updated successfully');
      } else {
        // Handle error (you can add error toast notification here)
        console.error('Failed to update profile:', result.payload);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Show loading spinner while fetching data
  if (isLoading && !profileData) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error message if no profile data
  if (!profileData) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load profile data</p>
            <button 
              onClick={() => dispatch(fetchProfile())}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 h-32 relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <button
                onClick={handleLogout}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
            
            <div className="relative px-6 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 relative z-10">
                <div className="relative">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 md:ml-6 mt-4 md:mt-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{profileData.user_name}</h1>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {profileData.employment_type}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center mt-4 md:mt-0"
                      disabled={isLoading}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mt-8">
            {/* Profile Information */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 flex-1 ${isEditing ? 'md:w-1/2' : 'w-full'}`}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-orange-600" />
                    Contact Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="text-gray-800 font-medium capitalize">{profileData.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Smartphone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Mobile</p>
                        <p className="text-gray-800 font-medium">{profileData.mobile_number}</p>
                      </div>
                    </div>
                    
                    {profileData.user_id && (
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">User ID</p>
                          <p className="text-gray-800 font-medium">{profileData.user_id}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-orange-600" />
                    Address Details
                  </h3>
                  
                  <div className="space-y-4">
                    {profileData.address && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-gray-800 font-medium">{profileData.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {profileData.district && (
                      <div className="flex items-start">
                        <Map className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">District</p>
                          <p className="text-gray-800 font-medium">{profileData.district}</p>
                        </div>
                      </div>
                    )}
                    
                    {profileData.place && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Place</p>
                          <p className="text-gray-800 font-medium">{profileData.place}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-orange-600" />
                    Personal Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Employment Type</p>
                        <p className="text-gray-800 font-medium capitalize">
                          {profileData.employment_type?.replace('_', ' ') || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="text-gray-800 font-medium">
                          {profileData.experienced ? "Experienced" : "Beginner"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Scale className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Has Bike</p>
                        <p className="text-gray-800 font-medium">
                          {profileData.has_bike ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Has License</p>
                        <p className="text-gray-800 font-medium">
                          {profileData.has_license ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* License Image */}
                {profileData.has_license && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-orange-600" />
                      License Details
                    </h3>
                    
                    {profileData.license_image ? (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">License Image</p>
                        <img 
                          src={profileData.license_image} 
                          alt="License" 
                          className="max-w-full h-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500">No license image uploaded</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Form (shown when editing) */}
            {isEditing && (
              <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent bg-gray-100"
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent bg-gray-100"
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                      <input
                        type="tel"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent bg-gray-100"
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                      <input
                        type="text"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Place</label>
                      <input
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                      <select
                        name="employment_type"
                        value={formData.employment_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      >
                        <option value="">Select employment type</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="experienced"
                        checked={formData.experienced}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Experienced
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="has_bike"
                        checked={formData.has_bike}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Has Bike
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="has_license"
                        checked={formData.has_license}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Has License
                      </label>
                    </div>

                    {/* License Image Upload */}
                    {formData.has_license && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          License Image
                        </label>
                        <div className="mt-1 flex items-center">
                          <label className="inline-block w-full overflow-hidden rounded-lg bg-white border border-gray-300">
                            <div className="px-4 py-6 text-center">
                              {licensePreview ? (
                                <img 
                                  src={licensePreview} 
                                  alt="License preview" 
                                  className="max-w-full h-auto max-h-48 mx-auto mb-4 rounded-lg"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FileText className="w-10 h-10 text-gray-400 mb-3" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, JPEG (MAX. 5MB)
                                  </p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLicenseImageChange}
                                className="hidden"
                                id="license-upload"
                              />
                              <label
                                htmlFor="license-upload"
                                className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors inline-block"
                              >
                                {licensePreview ? 'Change Image' : 'Upload Image'}
                              </label>
                              {licensePreview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLicensePreview(null);
                                    setFormData(prev => ({
                                      ...prev,
                                      license_image: null
                                    }));
                                  }}
                                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;