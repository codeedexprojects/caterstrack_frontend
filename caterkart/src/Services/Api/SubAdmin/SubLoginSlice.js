import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://catershub.pythonanywhere.com';

// Helper functions for localStorage
const getTokensFromStorage = () => {
  try {
    const tokens = localStorage.getItem('subAdminToken');
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Error parsing tokens from localStorage:', error);
    return null;
  }
};

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('subAdminUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const isTokenValid = (tokens) => {
  if (!tokens || !tokens.access) return false;
  
  try {
    const tokenPayload = JSON.parse(atob(tokens.access.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return tokenPayload.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Async thunks with better error handling
export const subAdminLogin = createAsyncThunk(
  'subAdminAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/signin/`, credentials);
      
      if (response.data && response.data.tokens) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Login failed');
      } else if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      } else {
        return rejectWithValue('Something went wrong');
      }
    }
  }
);

export const createUser = createAsyncThunk(
  'subAdminAuth/createUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.post(`${API_BASE_URL}/sub_admin/create/user/`, userData, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const getUsersList = createAsyncThunk(
  'subAdminAuth/getUsersList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.get(`${API_BASE_URL}/sub_admin/sub-admin/users/`, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users list');
    }
  }
);

export const editUser = createAsyncThunk(
  'subAdminAuth/editUser',
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.put(`${API_BASE_URL}/sub_admin/users/${userId}/sub-admin-update/`, userData, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to edit user');
    }
  }
);

export const getCateringWorkList = createAsyncThunk(
  'subAdminAuth/getCateringWorkList',
  async (type = 'upcoming', { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.get(`${API_BASE_URL}/admin_panel/catering-works/?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
        },
      });
      
      return { type, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue({ type, error: 'Session expired. Please login again.' });
      }
      return rejectWithValue({ 
        type, 
        error: error.response?.data?.message || 'Failed to fetch catering work list' 
      });
    }
  }
);

// NEW API: Get assigned users for a specific work
export const getAssignedUsers = createAsyncThunk(
  'subAdminAuth/getAssignedUsers',
  async (workId, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.get(`${API_BASE_URL}/admin_panel/assigned-users/${workId}/`, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
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

export const submitAttendanceRating = createAsyncThunk(
  'subAdminAuth/submitAttendanceRating',
  async (ratingData, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.post(`${API_BASE_URL}/sub_admin/rate-boy/`, ratingData, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to submit attendance rating');
    }
  }
);


export const submitBoyWage = createAsyncThunk(
  'subAdminAuth/submitBoyWage',
  async (wageData, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.patch(`${API_BASE_URL}/sub_admin/boy-wage/edit/`, wageData, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to submit boy wage');
    }
  }
);


// Add this new API function to your slice file (paste-2.txt)
// Add it after the submitBoyWage function

export const getBoyRating = createAsyncThunk(
  'subAdminAuth/getBoyRating',
  async (ratingId, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.get(`${API_BASE_URL}/sub_admin/boy-ratings/${ratingId}/`, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch boy rating');
    }
  }
);

export const updateBoyRating = createAsyncThunk(
  'subAdminAuth/updateBoyRating',
  async ({ ratingId, ratingData }, { getState, rejectWithValue }) => {
    try {
      const { subAdminAuth } = getState();
      const response = await axios.patch(`${API_BASE_URL}/sub_admin/boy-ratings/${ratingId}/`, ratingData, {
        headers: {
          'Authorization': `Bearer ${subAdminAuth.tokens?.access}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update boy rating');
    }
  }
);

// Initialize state
const storedTokens = getTokensFromStorage();
const storedUser = getUserFromStorage();
const hasValidTokens = storedTokens && isTokenValid(storedTokens);

const initialState = {
  admin: hasValidTokens ? storedUser : null,
  tokens: hasValidTokens ? storedTokens : null,
  isLoggedIn: hasValidTokens,
  isLoading: false,
  error: null,
  users: [],
  cateringWorks: [],
boyRating: {
  isLoading: false,
  error: null,
  data: null,
  success: false,
},
updateRating: {
  isLoading: false,
  error: null,
  success: false,
},
  userCreation: {
    isLoading: false,
    error: null,
    success: false,
  },
  usersList: {
    isLoading: false,
    error: null,
    data: [],
  },
  userEdit: {
    isLoading: false,
    error: null,
    success: false,
  },
  cateringWorkList: {
    isLoading: false,
    error: null,
    data: [],
  },
  assignedUsers: {
    isLoading: false,
    error: null,
    data: {},
  },
  attendanceRating: {
    isLoading: false,
    error: null,
    success: false,
  },
  selectedWork: null,
  showAttendanceModal: false,
  boyWage: {
  isLoading: false,
  error: null,
  success: false,
},
cateringWorkList: {
    upcoming: {
      data: [],
      isLoading: false,
      error: null
    },
    past: {
      data: [],
      isLoading: false,
      error: null
    }
  }
};

const subAdminAuthSlice = createSlice({
  name: 'subAdminAuth',
  initialState,
  reducers: {
    logoutSubAdmin: (state) => {
      state.admin = null;
      state.tokens = null;
      state.isLoggedIn = false;
      state.error = null;
      state.isLoading = false;
      state.users = [];
      state.boyWage = {
      isLoading: false,
      error: null,
      success: false,
    };
      state.cateringWorks = [];
      state.userCreation = {
        isLoading: false,
        error: null,
        success: false,
      };
      state.usersList = {
        isLoading: false,
        error: null,
        data: [],
      };
      state.userEdit = {
        isLoading: false,
        error: null,
        success: false,
      };
      state.cateringWorkList = {
        isLoading: false,
        error: null,
        data: [],
      };
      state.assignedUsers = {
        isLoading: false,
        error: null,
        data: {},
      };
      state.attendanceRating = {
        isLoading: false,
        error: null,
        success: false,
      };
      localStorage.removeItem('subAdminToken');
      localStorage.removeItem('subAdminUser');
    },
    setAuthState: (state, action) => {
      state.admin = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isLoggedIn = true;
      localStorage.setItem('subAdminToken', JSON.stringify(action.payload.tokens));
      localStorage.setItem('subAdminUser', JSON.stringify(action.payload.user));
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearUserCreationState: (state) => {
      state.userCreation.error = null;
      state.userCreation.success = false;
    },
    clearUserEditState: (state) => {
      state.userEdit.error = null;
      state.userEdit.success = false;
    },
    clearUsersListError: (state) => {
      state.usersList.error = null;
    },
    clearCateringWorkError: (state) => {
      state.cateringWorkList.error = null;
    },
    clearAssignedUsersError: (state) => {
      state.assignedUsers.error = null;
    },
    clearAttendanceRatingState: (state) => {
      state.attendanceRating.error = null;
      state.attendanceRating.success = false;
    },
    setSelectedWork: (state, action) => {
      state.selectedWork = action.payload;
    },
    clearSelectedWork: (state) => {
      state.selectedWork = null;
    },
    toggleAttendanceModal: (state, action) => {
      state.showAttendanceModal = action.payload;
    },
    clearBoyWageState: (state) => {
  state.boyWage.error = null;
  state.boyWage.success = false;
},
clearBoyRatingState: (state) => {
  state.boyRating.error = null;
  state.boyRating.success = false;
  state.boyRating.data = null;
},
clearUpdateRatingState: (state) => {
  state.updateRating.error = null;
  state.updateRating.success = false;
},

  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(subAdminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(subAdminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isLoggedIn = true;
        localStorage.setItem('subAdminToken', JSON.stringify(action.payload.tokens));
        localStorage.setItem('subAdminUser', JSON.stringify(action.payload.user));
      })
      .addCase(subAdminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.admin = null;
        state.tokens = null;
        state.isLoggedIn = false;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.userCreation.isLoading = true;
        state.userCreation.error = null;
        state.userCreation.success = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.userCreation.isLoading = false;
        state.userCreation.success = true;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.userCreation.isLoading = false;
        state.userCreation.error = action.payload;
        if (action.payload === 'Session expired. Please login again.') {
          state.admin = null;
          state.tokens = null;
          state.isLoggedIn = false;
          localStorage.removeItem('subAdminToken');
          localStorage.removeItem('subAdminUser');
        }
      })
      // Get Users List
      .addCase(getUsersList.pending, (state) => {
        state.usersList.isLoading = true;
        state.usersList.error = null;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.usersList.isLoading = false;
        state.usersList.data = action.payload;
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.usersList.isLoading = false;
        state.usersList.error = action.payload;
        if (action.payload === 'Session expired. Please login again.') {
          state.admin = null;
          state.tokens = null;
          state.isLoggedIn = false;
          localStorage.removeItem('subAdminToken');
          localStorage.removeItem('subAdminUser');
        }
      })
      // Edit User
      .addCase(editUser.pending, (state) => {
        state.userEdit.isLoading = true;
        state.userEdit.error = null;
        state.userEdit.success = false;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.userEdit.isLoading = false;
        state.userEdit.success = true;
        // Update the user in the list
        const index = state.usersList.data.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.usersList.data[index] = action.payload;
        }
      })
      .addCase(editUser.rejected, (state, action) => {
        state.userEdit.isLoading = false;
        state.userEdit.error = action.payload;
        if (action.payload === 'Session expired. Please login again.') {
          state.admin = null;
          state.tokens = null;
          state.isLoggedIn = false;
          localStorage.removeItem('subAdminToken');
          localStorage.removeItem('subAdminUser');
        }
      })
      .addCase(getCateringWorkList.pending, (state, action) => {
        const type = action.meta.arg || 'upcoming';
        state.cateringWorkList[type].isLoading = true;
        state.cateringWorkList[type].error = null;
      })
      .addCase(getCateringWorkList.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state.cateringWorkList[type].isLoading = false;
        state.cateringWorkList[type].data = data;
      })
      .addCase(getCateringWorkList.rejected, (state, action) => {
        const { type, error } = action.payload || {};
        const workType = type || action.meta.arg || 'upcoming';
        
        state.cateringWorkList[workType].isLoading = false;
        state.cateringWorkList[workType].error = error || action.error.message;
        
        if (error === 'Session expired. Please login again.') {
          // Handle session expiration
        }
      })
      // Get Assigned Users
      .addCase(getAssignedUsers.pending, (state) => {
        state.assignedUsers.isLoading = true;
        state.assignedUsers.error = null;
      })
      .addCase(getAssignedUsers.fulfilled, (state, action) => {
        state.assignedUsers.isLoading = false;
        state.assignedUsers.data[action.payload.workId] = action.payload.users;
      })
      .addCase(getAssignedUsers.rejected, (state, action) => {
        state.assignedUsers.isLoading = false;
        state.assignedUsers.error = action.payload;
        if (action.payload === 'Session expired. Please login again.') {
          state.admin = null;
          state.tokens = null;
          state.isLoggedIn = false;
          localStorage.removeItem('subAdminToken');
          localStorage.removeItem('subAdminUser');
        }
      })
      // Submit Attendance Rating
      .addCase(submitAttendanceRating.pending, (state) => {
        state.attendanceRating.isLoading = true;
        state.attendanceRating.error = null;
        state.attendanceRating.success = false;
      })
      .addCase(submitAttendanceRating.fulfilled, (state, action) => {
        state.attendanceRating.isLoading = false;
        state.attendanceRating.success = true;
      })
      .addCase(submitAttendanceRating.rejected, (state, action) => {
        state.attendanceRating.isLoading = false;
        state.attendanceRating.error = action.payload;
        if (action.payload === 'Session expired. Please login again.') {
          state.admin = null;
          state.tokens = null;
          state.isLoggedIn = false;
          localStorage.removeItem('subAdminToken');
          localStorage.removeItem('subAdminUser');
        }
      })
      .addCase(submitBoyWage.pending, (state) => {
        state.boyWage.isLoading = true;
        state.boyWage.error = null;
      })
      .addCase(submitBoyWage.fulfilled, (state, action) => {
        state.boyWage.isLoading = false;
        state.boyWage.success = true;
        state.boyWage.error = null;
      })
      .addCase(submitBoyWage.rejected, (state, action) => {
        state.boyWage.isLoading = false;
        state.boyWage.error = action.payload;
        state.boyWage.success = false;
      })
  },
});

export const {
  logoutSubAdmin,
  setAuthState,
  clearAuthError,
  clearUserCreationState,
  clearUserEditState,
  clearUsersListError,
  clearCateringWorkError,
  clearAssignedUsersError,
  clearAttendanceRatingState,
  setSelectedWork,
  clearSelectedWork,
  toggleAttendanceModal
} = subAdminAuthSlice.actions;


export default subAdminAuthSlice.reducer;