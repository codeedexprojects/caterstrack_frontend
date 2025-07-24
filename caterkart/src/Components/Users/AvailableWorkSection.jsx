import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, Users, Calendar, ChefHat, Building } from 'lucide-react';
import { fetchWorkList, requestWork } from '../../Services/Api/User/UserAuthSlice';
import toast from 'react-hot-toast';

const AvailableWorkSection = ({ handleCardClick, handleRequestWork: parentHandleRequestWork }) => {
  const dispatch = useDispatch();
  const { workList: availableWork, isLoading, error } = useSelector((state) => state.userAuth);

  // Remove the useEffect that was causing duplicate API calls
  // The parent component now handles initial data fetching

  const handleRequestWork = async (workId, e) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    
    const loadingToast = toast.loading('Sending work request...');

    try {
      const requestBody = {
        work: parseInt(workId)
      };

      await dispatch(requestWork(requestBody)).unwrap();
      
      toast.success('Work request sent successfully!', {
        id: loadingToast,
        duration: 4000,
      });

      // Refresh the work list to get updated data
      dispatch(fetchWorkList());
      
    } catch (error) {
      console.error('Error requesting work:', error);
      toast.error(error || 'Failed to send work request. Please try again.', {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  const handleRefresh = () => {
    dispatch(fetchWorkList());
  };

  // Loading state
  if (isLoading && (!availableWork || availableWork.length === 0)) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Available Catering Work</h2>
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            Loading...
          </div>
        </div>
        
        <div className="grid gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && (!availableWork || availableWork.length === 0)) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Available Catering Work</h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!availableWork || availableWork.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Available Catering Work</h2>
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
            0 Available
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Work Available</h3>
          <p className="text-gray-500 mb-4">Check back later for new catering opportunities.</p>
          <button 
            onClick={handleRefresh}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Available Catering Work</h2>
        <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
          {availableWork.length} New
        </div>
        <button 
          onClick={handleRefresh}
          className="ml-auto text-orange-600 hover:text-orange-700 font-medium text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {availableWork.map((work) => (
          <div
            key={work.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={() => handleCardClick(work.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                   {work.date} - {work.Auditorium_name}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <Building className="inline-block w-4 h-4 text-orange-500 mr-1" />
                    <span className="font-semibold">{work.Auditorium_name}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold">Place: {work.place}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm"> Reporting Time: {work.reporting_time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    Boys Needed: {work.no_of_boys_needed}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    Work Type: {work.work_type}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${work.is_published ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                  <span className={`text-sm ${work.is_published ? 'text-green-600' : 'text-gray-500'} font-medium`}>
                    {work.is_published ? 'Published' : 'Unpublished'}
                  </span>
                </div>
                <button
                  onClick={(e) => handleRequestWork(work.id, e)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Request Work
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableWorkSection;