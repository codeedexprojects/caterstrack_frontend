import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://catershub.pythonanywhere.com';

// Async thunks for API calls
export const fetchWorks = createAsyncThunk(
  'work/fetchWorks',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/catering-work/create/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`
        },
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch works');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWork = createAsyncThunk(
  'work/createWork',
  async (workData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/catering-work/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
        body: JSON.stringify(workData),
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to create work');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWork = createAsyncThunk(
  'work/updateWork',
  async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/catering-work/${id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
        body: JSON.stringify(data),
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to update work');
      }
      
      const updatedData = await response.json();
      return { id, data: updatedData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const publishWork = createAsyncThunk(
  'work/publishWork',
  async ({ id, is_published }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/catering-work/${id}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
        body: JSON.stringify({ is_published }),
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to publish/unpublish work');
      }
      
      const updatedData = await response.json();
      return { id, is_published, data: updatedData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWork = createAsyncThunk(
  'work/deleteWork',
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/catering-work/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to delete work');
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWorkRequests = createAsyncThunk(
  'work/fetchWorkRequests',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/work-requests/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch work requests');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWorkRequestStatus = createAsyncThunk(
  'work/updateWorkRequestStatus',
  async ({ id, status }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/work-request/${id}/status-update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
        body: JSON.stringify({ status }),
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to update work request status');
      }
      
      const data = await response.json();
      return { id, status, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const assignBoyToWork = createAsyncThunk(
  'work/assignBoyToWork',
  async ({ work, boy }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/assign-boy/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
        body: JSON.stringify({ work, boy }),
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to assign boy to work');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssignedBoys = createAsyncThunk(
  'work/fetchAssignedBoys',
  async (workId, { rejectWithValue, getState, dispatch }) => {
    try {
      const { adminAuth } = getState();
      
      // Check if user is authenticated
      if (!adminAuth.tokens?.access) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await fetch(`${API_BASE_URL}/admin_panel/work/${workId}/assigned-boys/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.tokens.access}`,
        },
      });
      
      // Handle 401 unauthorized errors
      if (response.status === 401) {
        dispatch({ type: 'adminAuth/logoutAdmin' });
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch assigned boys');
      }
      
      const data = await response.json();
      return { workId, boys: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  works: [],
  workRequests: [],
  assignedBoys: {},
  loading: false,
  error: null,
};

// Create slice
const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWorks: (state) => {
      state.works = [];
    },
    clearWorkRequests: (state) => {
      state.workRequests = [];
    },
    clearWorkState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch works
      .addCase(fetchWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.works = action.payload;
      })
      .addCase(fetchWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create work
      .addCase(createWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWork.fulfilled, (state, action) => {
        state.loading = false;
        state.works.push(action.payload);
      })
      .addCase(createWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update work
      .addCase(updateWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWork.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.works.findIndex(work => work.id === action.payload.id);
        if (index !== -1) {
          state.works[index] = action.payload.data;
        }
      })
      .addCase(updateWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete work
      .addCase(deleteWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWork.fulfilled, (state, action) => {
        state.loading = false;
        state.works = state.works.filter(work => work.id !== action.payload);
      })
      .addCase(deleteWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch work requests
      .addCase(fetchWorkRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.workRequests = action.payload;
      })
      .addCase(fetchWorkRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update work request status
      .addCase(updateWorkRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workRequests.findIndex(request => request.id === action.payload.id);
        if (index !== -1) {
          state.workRequests[index].status = action.payload.status;
        }
      })
      .addCase(updateWorkRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign boy to work
      .addCase(assignBoyToWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignBoyToWork.fulfilled, (state, action) => {
        state.loading = false;
        // Update the work with the new assigned boy
        const workIndex = state.works.findIndex(work => work.id === action.payload.work);
        if (workIndex !== -1) {
          if (!state.works[workIndex].assigned_boys) {
            state.works[workIndex].assigned_boys = [];
          }
          state.works[workIndex].assigned_boys.push(action.payload.boy);
        }
      })
      .addCase(assignBoyToWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch assigned boys
      .addCase(fetchAssignedBoys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedBoys.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedBoys[action.payload.workId] = action.payload.boys;
      })
      .addCase(fetchAssignedBoys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearWorks, clearWorkRequests, clearWorkState } = workSlice.actions;
export default workSlice.reducer;