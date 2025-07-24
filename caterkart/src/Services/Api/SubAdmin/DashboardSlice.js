import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://catershub.pythonanywhere.com';

// Helper function to retrieve token from localStorage
const getSubAdminToken = () => {
  try {
    const tokens = localStorage.getItem('subAdminToken');
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Error parsing tokens:', error);
    return null;
  }
};

// Thunk to fetch upcoming works
export const fetchUpcomingWorks = createAsyncThunk(
  'subDashboard/fetchUpcomingWorks',
  async (_, { rejectWithValue }) => {
    const tokens = getSubAdminToken();

    if (!tokens?.access) {
      return rejectWithValue('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin_panel/catering/upcoming/`, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming works');
    }
  }
);

// Thunk to fetch admin stats
export const fetchAdminStats = createAsyncThunk(
  'subDashboard/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    const tokens = getSubAdminToken();

    if (!tokens?.access) {
      return rejectWithValue('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin_panel/admin/stats/`, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

// Thunk to fetch assigned users for a specific work
export const getAssignedUsers = createAsyncThunk(
  'subDashboard/getAssignedUsers',
  async (workId, { rejectWithValue }) => {
    const tokens = getSubAdminToken();

    if (!tokens?.access) {
      return rejectWithValue('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin_panel/assigned-users/${workId}/`, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });

      return { workId, users: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned users');
    }
  }
);

const initialState = {
  upcomingWorks: [],
  adminStats: {
    total_users: 0,
    total_works_completed: 0,
    total_pending_works: 0,
    total_pending_join_requests: 0,
  },
  loading: {
    upcomingWorks: false,
    adminStats: false,
    assignedUsers: false,
  },
  error: {
    upcomingWorks: null,
    adminStats: null,
    assignedUsers: null,
  },
  // Modal state
  modal: {
    isOpen: false,
    selectedWork: null,
  },
  // Assigned users data
  assignedUsers: {
    data: {},
  },
};

const subDashboardSlice = createSlice({
  name: 'subDashboard',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error.upcomingWorks = null;
      state.error.adminStats = null;
      state.error.assignedUsers = null;
    },
    // Modal actions
    openModal: (state, action) => {
      state.modal.isOpen = true;
      state.modal.selectedWork = action.payload;
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.selectedWork = null;
    },
    // Clear assigned users data
    clearAssignedUsers: (state) => {
      state.assignedUsers.data = {};
      state.error.assignedUsers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upcoming Works
      .addCase(fetchUpcomingWorks.pending, (state) => {
        state.loading.upcomingWorks = true;
        state.error.upcomingWorks = null;
      })
      .addCase(fetchUpcomingWorks.fulfilled, (state, action) => {
        state.loading.upcomingWorks = false;
        state.upcomingWorks = action.payload;
      })
      .addCase(fetchUpcomingWorks.rejected, (state, action) => {
        state.loading.upcomingWorks = false;
        state.error.upcomingWorks = action.payload;
      })

      // Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading.adminStats = true;
        state.error.adminStats = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading.adminStats = false;
        state.adminStats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading.adminStats = false;
        state.error.adminStats = action.payload;
      })

      // Assigned Users
      .addCase(getAssignedUsers.pending, (state) => {
        state.loading.assignedUsers = true;
        state.error.assignedUsers = null;
      })
      .addCase(getAssignedUsers.fulfilled, (state, action) => {
        state.loading.assignedUsers = false;
        state.assignedUsers.data[action.payload.workId] = action.payload.users;
      })
      .addCase(getAssignedUsers.rejected, (state, action) => {
        state.loading.assignedUsers = false;
        state.error.assignedUsers = action.payload;
      });
  },
});

export const { clearErrors, openModal, closeModal, clearAssignedUsers } = subDashboardSlice.actions;
export default subDashboardSlice.reducer;