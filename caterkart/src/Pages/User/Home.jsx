import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../Components/Users/Header';
import Footer from '../../Components/Users/Footer';
import UserStatsSection from '../../Components/Users/UserStatsSection';
import AvailableWorkSection from '../../Components/Users/AvailableWorkSection';

import { fetchUserCounts, fetchWorkList, clearAuthError } from '../../Services/Api/User/UserAuthSlice';

const CaterKartHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    userCounts,
    workList,
    isLoading,
    error,
    isLoggedIn
  } = useSelector((state) => state.userAuth);

  // Initial data fetch
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserCounts());
      dispatch(fetchWorkList());
    }
  }, [dispatch, isLoggedIn]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleCardClick = (workId) => {
    navigate(`/work-details/${workId}`);
  };

  const handleRequestWork = () => {
    toast.success("Request logic will be implemented here.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <Toaster position="top-right" />

      <main className="container mx-auto px-4 py-8">
        {/* User Stats Section */}
        {!userCounts && isLoading ? (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <UserStatsSection 
            userProfile={{
              name: userCounts?.user_name || 'User',
              totalJobs: userCounts?.published_work_count || 0,
              completedJobs: userCounts?.accepted_requests || 0,
              activeRequests: userCounts?.pending_requests || 0,
            }}
          />
        )}

        {/* Available Work Section - Remove duplicate fetch logic */}
        <AvailableWorkSection 
          handleCardClick={handleCardClick}
          handleRequestWork={handleRequestWork}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CaterKartHomePage;