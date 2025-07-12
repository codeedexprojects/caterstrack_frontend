import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFaresList, createFare, updateFare, deleteFare, clearFaresError } from '../../Services/Api/Admin/FareSlice';

const FaresList = () => {
  const dispatch = useDispatch();
  const { 
    fares, 
    isLoading, 
    error, 
    createLoading, 
    createError, 
    updateLoading, 
    updateError, 
    deleteLoading, 
    deleteError 
  } = useSelector(state => state.fares);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFare, setEditingFare] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fareToDelete, setFareToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fare_type: '',
    amount: ''
  });

  useEffect(() => {
    dispatch(getFaresList());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      await dispatch(createFare(formData)).unwrap();
      setShowCreateModal(false);
      setFormData({ fare_type: '', amount: '' });
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleEditFare = (fare) => {
    setEditingFare(fare);
    setFormData({
      fare_type: fare.fare_type,
      amount: fare.amount.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdateFare = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateFare({
        fare_type: editingFare.fare_type, // Original fare_type for the API endpoint
        fareData: {
          fare_type: formData.fare_type, // New fare_type value
          amount: parseFloat(formData.amount)
        }
      })).unwrap();
      setShowEditModal(false);
      setEditingFare(null);
      setFormData({ fare_type: '', amount: '' });
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleDeleteFare = (fare) => {
    setFareToDelete(fare);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (fareToDelete) {
      try {
        await dispatch(deleteFare(fareToDelete.id)).unwrap();
        setShowDeleteModal(false);
        setFareToDelete(null);
      } catch (error) {
        // Error handled by Redux
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingFare(null);
    setFormData({ fare_type: '', amount: '' });
    dispatch(clearFaresError());
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({ fare_type: '', amount: '' });
    dispatch(clearFaresError());
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setFareToDelete(null);
    dispatch(clearFaresError());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fares Management</h2>
          <p className="text-gray-600">Manage fare pricing and routes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add New Fare
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {deleteError}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fares.map((fare) => (
                <tr key={fare.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fare.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fare.fare_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{fare.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleEditFare(fare)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteFare(fare)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Fare Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Fare</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {createError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {createError}
              </div>
            )}

            <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fare Type
              </label>
              <input
                type="text"
                name="fare_type"
                value={formData.fare_type}
                onChange={handleInputChange}
                required
                placeholder="Enter fare type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Fare'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fare Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Fare</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {updateError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {updateError}
              </div>
            )}

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fare Type
                </label>
                <select
                  name="fare_type"
                  value={formData.fare_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select fare type</option>
                  <option value="boys">Boys</option>
                  <option value="Head_Boy">Head Boy</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="captain">Captain</option>
                  <option value="setting">Setting</option>
                  <option value="loading">Loading</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateFare}
                  disabled={updateLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {updateLoading ? 'Updating...' : 'Update Fare'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Fare</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete the fare for "{fareToDelete?.fare_type}"? This action cannot be undone.
              </p>
              
              {deleteError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {deleteError}
                </div>
              )}
              
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaresList;