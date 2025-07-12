import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get users list
export const getUsersList = createAsyncThunk(
  'users/getUsersList',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { adminAuth } = getState();
      const response = await axios.get('https://catershub.pythonanywhere.com/admin_panel/admin/users/', {
        headers: {
          'Authorization': `Bearer ${adminAuth.tokens?.access}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Get user details
export const getUserDetails = createAsyncThunk(
  'users/getUserDetails',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { adminAuth } = getState();
      const response = await axios.get(`https://catershub.pythonanywhere.com/users/users/${userId}/admin-update/`, {
        headers: {
          'Authorization': `Bearer ${adminAuth.tokens?.access}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// Update user details
export const updateUserDetails = createAsyncThunk(
  'users/updateUserDetails',
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const { adminAuth } = getState();
      const response = await axios.post(`https://catershub.pythonanywhere.com/users/users/${userId}/admin-update/`, userData, {
        headers: {
          'Authorization': `Bearer ${adminAuth.tokens?.access}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user details');
    }
  }
);

// Create new user - Updated to use correct endpoint
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { adminAuth } = getState();
      const response = await axios.post('https://catershub.pythonanywhere.com/users/create-user/', userData, {
        headers: {
          'Authorization': `Bearer ${adminAuth.tokens?.access}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const { adminAuth } = getState();
      const response = await axios.put(`https://catershub.pythonanywhere.com/admin_panel/admin/users/${userId}/`, userData, {
        headers: {
          'Authorization': `Bearer ${adminAuth.tokens?.access}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { adminAuth } = getState();
      await axios.delete(`https://catershub.pythonanywhere.com/admin_panel/admin/users/${userId}/`, {
        headers: {
          'Authorization': `Bearer ${adminAuth.tokens?.access}`
        }
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const initialState = {
  users: [],
  userDetails: null,
  isLoading: false,
  isLoadingDetails: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  detailsError: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearDetailsError: (state) => {
      state.detailsError = null;
    },
    resetUserState: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.detailsError = null;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users List
      .addCase(getUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get User Details
      .addCase(getUserDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.detailsError = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.userDetails = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.detailsError = action.payload;
      })
      
      // Update User Details
      .addCase(updateUserDetails.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update user details in state
        state.userDetails = action.payload;
        // Also update in users list if present
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreating = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload;
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload;
      });
  },
});

export const { 
  clearUsersError, 
  clearCreateError, 
  clearUpdateError, 
  clearDeleteError,
  clearDetailsError,
  resetUserState,
  clearUserDetails
} = usersSlice.actions;

export default usersSlice.reducer;