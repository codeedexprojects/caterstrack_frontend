import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Calendar, ChefHat, ArrowLeft, Phone, CheckCircle, User, Shirt, Truck, Settings, Star, DollarSign, UserCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../../Components/Users/Header';
import Footer from '../../Components/Users/Footer';
import { fetchWorkById, requestWork, clearCurrentWork } from '../../Services/Api/User/UserAuthSlice';
import ConfirmationModal from '../../Components/Users/ConfirnationModal';

const CateringStaffJobDetails = () => {
  const [isApplied, setIsApplied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const rawId = useParams().id;
  const id = rawId?.startsWith('$') ? rawId.slice(1) : rawId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { 
    currentWork: jobDetails, 
    isLoading: loading, 
    error 
  } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const result = await dispatch(fetchWorkById(id)).unwrap();
        
        // Check if user has already requested this work
        const hasUserRequested = result.join_requests && result.join_requests.length > 0;
        setIsApplied(hasUserRequested);

      } catch (err) {
        console.error('Failed to fetch job details:', err);
        toast.error('Failed to load job details. Please try again.');
      }
    };

    fetchJobDetails();

    // Cleanup function to clear current work when component unmounts
    return () => {
      dispatch(clearCurrentWork());
    };
  }, [id, dispatch]);

  const handleBackClick = () => {
    navigate(-1);
  }

  const handleRequestWork = () => {
    setIsModalOpen(true);
  };

  const handleConfirmRequest = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending work request...');

    try {
      const requestBody = {
        work: parseInt(id)
      };

      await dispatch(requestWork(requestBody)).unwrap();
      
      setIsApplied(true);
      setIsModalOpen(false);
      toast.success('Work request sent successfully!', {
        id: loadingToast,
        duration: 4000,
      });
      
      // Refresh the job details to get updated join_requests
      dispatch(fetchWorkById(id));
      
    } catch (error) {
      console.error('Error requesting work:', error);
      toast.error(error || 'Failed to send work request. Please try again.', {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getUrgencyColor = (attendees) => {
    if (attendees > 200) return 'bg-red-100 text-red-800';
    if (attendees > 100) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getUrgencyText = (attendees) => {
    if (attendees > 200) return 'High Priority';
    if (attendees > 100) return 'Medium Priority';
    return 'Low Priority';
  };

  const formatInstructions = (instructions) => {
    const lines = instructions.split('\n').filter(item => item.trim() !== '');
    return lines.map(line => ({
      text: line.replace('*', '').trim(),
      isBullet: line.startsWith('*') || line.startsWith('•')
    }));
  };

  const getRequestStatus = () => {
    if (!jobDetails.join_requests || jobDetails.join_requests.length === 0) {
      return null;
    }

    const request = jobDetails.join_requests[0];
    return {
      status: request.status,
      assigned: request.assigned,
      comment: request.comment,
      requestedAt: request.requested_at,
      updatedAt: request.updated_at
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const StarRating = ({ rating, label }) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 min-w-[80px]">{label}:</span>
        <div className="flex items-center gap-1">
          {rating ? (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          ) : (
            <span className="text-sm text-gray-400">No rating</span>
          )}
        </div>
      </div>
    );
  };

  const WageItem = ({ label, amount, isTotal = false }) => {
    return (
      <div className={`flex justify-between items-center ${isTotal ? 'border-t pt-2 font-semibold' : ''}`}>
        <span className="text-gray-600">{label}</span>
        <span className={`${isTotal ? 'text-lg font-bold text-green-600' : 'text-gray-800'}`}>
          ₹{typeof amount === 'string' ? parseFloat(amount).toFixed(2) : amount.toFixed(2)}
        </span>
      </div>
    );
  };

  // Loading state
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="text-center">
        <div className="inline-block relative">
          <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading job details...</p>
        <p className="mt-1 text-sm text-gray-500">Please wait while we fetch the information</p>
      </div>
    </div>
  );
  
  // Error state
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      <div className="text-center">
        <p className="text-lg font-medium">{error}</p>
        <button 
          onClick={() => dispatch(fetchWorkById(id))}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
  
  // No data state
  if (!jobDetails) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium">No job details found</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const requestStatus = getRequestStatus();
  const hasExtraWork = jobDetails.join_requests && jobDetails.join_requests.length > 0 && jobDetails.join_requests[0].extra_work;
  const hasRatings = jobDetails.ratings && jobDetails.ratings.length > 0;
  const hasDailyWage = jobDetails.daily_wage;
  const hasAssignedSupervisors = jobDetails.assigned_supervisors && jobDetails.assigned_supervisors.length > 0;

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={handleBackClick} className="cursor-pointer p-2 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{jobDetails.Auditorium_name} - {jobDetails.date}</h1>
                <p className="text-orange-100">{jobDetails.work_type.replace(/_/g, ' ')} Event</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Overview */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl font-bold text-gray-800">{jobDetails.date} - {jobDetails.Auditorium_name}</h2>
                    </div>
                    <p className="text-gray-600 font-medium mb-2">{jobDetails.Catering_company}</p>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-sm text-gray-600">Date</div>
                      <div className="font-semibold text-gray-800">{jobDetails.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Reporting Time</div>
                      <div className="font-semibold text-gray-800">{jobDetails.reporting_time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">Staff Needed</div>
                      <div className="font-semibold text-gray-800">{jobDetails.no_of_boys_needed}</div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800">{jobDetails.Auditorium_name}</div>
                    <div className="text-gray-600">{jobDetails.place}</div>
                    <a
                      href={jobDetails.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-orange-600" />
                  Staff Requirements & Instructions
                </h3>
                <div className="space-y-3">
                  {formatInstructions(jobDetails.instructions).map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${instruction.isBullet ? 'text-green-500' : 'text-orange-500'}`} />
                      <span>{instruction.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Work Section */}
              {hasExtraWork && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Extra Work Available
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobDetails.join_requests[0].extra_work.is_loading && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-800">Loading Work</div>
                          <div className="text-sm text-gray-600">Additional loading/unloading tasks available</div>
                        </div>
                      </div>
                    )}
                    {jobDetails.join_requests[0].extra_work.is_setting && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Settings className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-800">Setting Work</div>
                          <div className="text-sm text-gray-600">Event setup and arrangement tasks available</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Performance Ratings */}
              {hasRatings && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Performance Ratings
                  </h3>
                  <div className="space-y-3">
                    {jobDetails.ratings.map((rating, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <StarRating rating={rating.pant} label="Pant" />
                          <StarRating rating={rating.shoe} label="Shoe" />
                          <StarRating rating={rating.timing} label="Timing" />
                          <StarRating rating={rating.neatness} label="Neatness" />
                          <StarRating rating={rating.performance} label="Performance" />
                        </div>
                        {rating.comment && (
                          <div className="mt-3 p-3 bg-white rounded border">
                            <div className="text-sm font-medium text-gray-800">Comment:</div>
                            <div className="text-sm text-gray-600">{rating.comment}</div>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          Rated on: {new Date(rating.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Request Status */}
              {requestStatus && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                    Request Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(requestStatus.status)}`}>
                        {getStatusText(requestStatus.status)}
                      </span>
                      {requestStatus.assigned && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Assigned
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Requested: {new Date(requestStatus.requestedAt).toLocaleDateString()}</div>
                      <div>Updated: {new Date(requestStatus.updatedAt).toLocaleDateString()}</div>
                    </div>
                    {requestStatus.comment && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-800">Comment:</div>
                        <div className="text-sm text-gray-600">{requestStatus.comment}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Daily Wage Information */}
              {hasDailyWage && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Wage Breakdown
                  </h3>
                  <div className="space-y-3">
                    <WageItem label="Base Fare" amount={jobDetails.daily_wage.base_fare} />
                    <WageItem label="Rating Amount" amount={jobDetails.daily_wage.rating_amount} />
                    <WageItem label="Travel Allowance" amount={jobDetails.daily_wage.travel_allowance} />
                    <WageItem label="Over Time" amount={jobDetails.daily_wage.over_time} />
                    <WageItem label="Long Fare" amount={jobDetails.daily_wage.long_fare} />
                    <WageItem label="Bonus" amount={jobDetails.daily_wage.bonus} />
                    <WageItem label="Loading" amount={jobDetails.daily_wage.extra_loading} />
                    <WageItem label="Setting" amount={jobDetails.daily_wage.extra_setting} />
                    <WageItem label="Total Wage" amount={jobDetails.daily_wage.total_wage} isTotal />
                  </div>

                  <div className="mt-4">
                    <span className="font-semibold">Payment Status:</span>{' '}
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {jobDetails.daily_wage.payment_status}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-green-700">Total Earning</div>
                      <div className="text-2xl font-bold text-green-600">₹{jobDetails.total_earning.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assigned Supervisors */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-600" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-gray-800">Captain In Charge</div>
                    <div className="text-sm text-gray-600">Contact for any doubts or emergencies</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Contact number will be shared after confirmation</span>
                    </div>
                  </div>

                  {hasAssignedSupervisors && (
                    <div className="pt-4 border-t">
                      <h4 className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-purple-600" />
                        Assigned Supervisors
                      </h4>
                      <div className="space-y-3">
                        {jobDetails.assigned_supervisors.map((supervisor, index) => (
                          <div key={index} className="p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-800">{supervisor.name}</div>
                                <div className="text-sm text-gray-600 capitalize">{supervisor.role}</div>
                              </div>
                              <div className="flex items-center gap-2 text-purple-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-medium">{supervisor.mobile}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <button
                      className={`w-full py-2 rounded-lg font-semibold transition-colors mb-2 ${isApplied
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                      onClick={handleRequestWork}
                      disabled={isApplied || isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : (isApplied ? 'Already Requested' : 'Send Work Request')}
                    </button>
                    {isApplied && (
                      <div className="text-blue-600 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {requestStatus?.status === 'accepted'
                          ? 'Your request has been accepted!'
                          : requestStatus?.status === 'rejected'
                            ? 'Your request was not accepted.'
                            : 'Your request is under review.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Footer></Footer>

        {/* Toast Container */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmRequest}
          title="Confirm Work Request"
          message={`Are you sure you want to send a work request for ${jobDetails.Auditorium_name} on ${jobDetails.date}?`}
          confirmText="Send Request"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default CateringStaffJobDetails;