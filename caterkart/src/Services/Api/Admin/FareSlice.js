import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get fares list
export const getFaresList = createAsyncThunk(
  'fares/getFaresList',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }

      const response = await axios.get('https://catershub.pythonanywhere.com/admin_panel/list-base-fares/', {
        headers: {
          'Authorization': `Bearer ${adminAuth.tokens.access}`
        }
      });
      
      return response.data;
    } catch (error) {
      // Handle 401 unauthorized errors
      if (error.response?.status === 401) {
        // Token might be expired, logout user
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      console.error('Get fares error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to fetch fares'
      );
    }
  }
);

// Create fare
export const createFare = createAsyncThunk(
  'fares/createFare',
  async (fareData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }

      const response = await axios.post(
        'https://catershub.pythonanywhere.com/admin_panel/base-fares/', 
        fareData, 
        {
          headers: {
            'Authorization': `Bearer ${adminAuth.tokens.access}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      // Handle 401 unauthorized errors
      if (error.response?.status === 401) {
        // Token might be expired, logout user
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      console.error('Create fare error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.detail ||
        'Failed to create fare'
      );
    }
  }
);

// Update fare
export const updateFare = createAsyncThunk(
  'fares/updateFare',
  async ({ id, fareData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }

      const response = await axios.put(
        `https://catershub.pythonanywhere.com/admin_panel/base-fares/${id}/`,
        fareData,
        {
          headers: {
            'Authorization': `Bearer ${adminAuth.tokens.access}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.detail ||
        'Failed to update fare'
      );
    }
  }
);

// Delete fare
export const deleteFare = createAsyncThunk(
  'fares/deleteFare',
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }

      await axios.delete(
        `https://catershub.pythonanywhere.com/admin_panel/base-fares/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${adminAuth.tokens.access}`
          }
        }
      );
      
      return id;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.detail ||
        'Failed to delete fare'
      );
    }
  }
);

const initialState = {
  fares: [],
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

const faresSlice = createSlice({
  name: 'fares',
  initialState,
  reducers: {
    clearFaresError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearFaresState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get fares list
      .addCase(getFaresList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFaresList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fares = action.payload;
      })
      .addCase(getFaresList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create fare
      .addCase(createFare.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createFare.fulfilled, (state, action) => {
        state.createLoading = false;
        state.fares.push(action.payload);
      })
      .addCase(createFare.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // Update fare
      .addCase(updateFare.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateFare.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.fares.findIndex(fare => fare.id === action.payload.id);
        if (index !== -1) {
          state.fares[index] = action.payload;
        }
      })
      .addCase(updateFare.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Delete fare
      .addCase(deleteFare.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteFare.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.fares = state.fares.filter(fare => fare.id !== action.payload);
      })
      .addCase(deleteFare.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { clearFaresError, clearFaresState } = faresSlice.actions;
export default faresSlice.reducer;