import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkAnalyticsList, getWorkAnalyticsDetails } from '../../Services/Api/Admin/WorkSlice';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Search,
  Filter,
  Eye,
  X,
  BarChart3
} from 'lucide-react';

const WorkAnalytics = () => {
  const dispatch = useDispatch();
  const { analyticsList, analyticsDetails, loading, error } = useSelector((state) => state.work);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWork, setSelectedWork] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getWorkAnalyticsList());
  }, [dispatch]);

  const handleRowClick = (workId) => {
    dispatch(getWorkAnalyticsDetails(workId));
    setSelectedWork(workId);
  };

  const closeDetails = () => {
    setSelectedWork(null);
  };

  // Filter and search functionality
  const filteredAnalytics = analyticsList?.filter(item => {
    const matchesSearch = item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.work_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  }) || [];

  // Calculate summary statistics
  const totalRevenue = analyticsList?.reduce((sum, item) => sum + (item.payment_amount || 0), 0) || 0;
  const totalProfit = analyticsList?.reduce((sum, item) => 
    sum + (item.status === 'Profit' ? (item.profit_or_loss || 0) : 0), 0) || 0;
  const totalLoss = analyticsList?.reduce((sum, item) => 
    sum + (item.status === 'Loss' ? Math.abs(item.profit_or_loss || 0) : 0), 0) || 0;
  const profitableWorks = analyticsList?.filter(item => item.status === 'Profit').length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Work Analytics</h1>
        <p className="text-gray-600 mt-1">Monitor your business performance and profitability</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or work type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="profit">Profit</option>
              <option value="loss">Loss</option>
            </select>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Error loading data</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit/Loss
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalytics.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(item.id)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.customer_name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {item.date}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.work_type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{item.payment_amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Wages: ₹{item.total_wages_paid?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Extra: ₹{item.total_extra_expense?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        item.status === 'Profit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.status === 'Profit' ? '+' : '-'}₹{Math.abs(item.profit_or_loss || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Profit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'Profit' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Work Details Modal */}
      {analyticsDetails && selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Work Details</h3>
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Work Date</label>
                  <p className="text-base font-semibold text-gray-900">{analyticsDetails.work_date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Auditorium</label>
                  <p className="text-base font-semibold text-gray-900">{analyticsDetails.auditorium}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Amount</label>
                  <p className="text-base font-semibold text-gray-900">₹{analyticsDetails.work_payment_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Wage Paid</label>
                  <p className="text-base font-semibold text-gray-900">₹{analyticsDetails.total_wage_paid?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    analyticsDetails.status === 'Profit' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {analyticsDetails.status === 'Profit' ? (
                      <TrendingUp className="h-4 w-4 mr-2" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-2" />
                    )}
                    {analyticsDetails.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Profit / Loss</label>
                  <p className={`text-base font-semibold ${
                    analyticsDetails.status === 'Profit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {analyticsDetails.status === 'Profit' ? '+' : '-'}₹{Math.abs(analyticsDetails.amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAnalytics.length === 0 && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'No results found for your search criteria.' 
              : 'Start by adding some work records to see analytics here.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkAnalytics;