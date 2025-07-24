import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, 
  ChefHat, 
  Home, 
  Briefcase,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { fetchUserCounts, fetchProfile, logoutUser } from '../../Services/Api/User/UserAuthSlice';
import avatar from '../../assets/avatar.png';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    user, 
    userCounts, 
    profile, 
    isLoading 
  } = useSelector((state) => state.userAuth);

  const navigationItems = [
    { icon: Home, label: "Home", path: "/user/home" },
    { icon: Briefcase, label: "My Work", path: "/user/my-works" },
    { icon: User, label: "Profile", path: "/user/profile" }
  ];

  useEffect(() => {
    // Fetch user profile and counts when component mounts
    dispatch(fetchUserCounts());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/user/login');
    toast.success('Logged out successfully');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user data from either profile or user state
  const userData = profile || user || {};
  const userName = userData.name || userData.first_name || userData.username || "User";
  const userAvatar = userData.avatar || userData.profile_picture || avatar;

  return (
    <>
      <Toaster position="top-center" />
      {/* Top header */}
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  CaterKart
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Catering Solutions</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.slice(0, 2).map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
              
              {/* Profile and Logout */}
              <div className="flex items-center space-x-2">
                <Link
                  to="/user/profile"
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isActive('/user/profile')
                      ? 'bg-orange-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-orange-200"
                    onError={(e) => {
                      e.target.src = avatar;
                    }}
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {isLoading ? "Loading..." : userName}
                    </p>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center h-14 md:hidden">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center text-xs ${
              isActive(item.path)
                ? 'text-orange-600'
                : 'text-gray-500 hover:text-orange-600'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            {item.label}
          </Link>
        ))}
        
        {/* Mobile Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-xs text-gray-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 mb-1" />
          Logout
        </button>
      </nav>
    </>
  );
};

export default Header;