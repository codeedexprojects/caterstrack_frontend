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
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
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
    resetUserState: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
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
  resetUserState 
} = usersSlice.actions;

export default usersSlice.reducer;