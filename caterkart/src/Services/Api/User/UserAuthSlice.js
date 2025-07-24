import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://catershub.pythonanywhere.com';

// LocalStorage Helpers
const getTokenFromStorage = () => {
  try {
    return localStorage.getItem('access_token') || null;
  } catch (error) {
    console.error('Token fetch error:', error);
    return null;
  }
};

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('User fetch error:', error);
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Initial Auth State
const storedToken = getTokenFromStorage();
const storedUser = getUserFromStorage();
const hasValidToken = storedToken && isTokenValid(storedToken);

const initialState = {
  user: hasValidToken ? storedUser : null,
  token: hasValidToken ? storedToken : null,
  isLoggedIn: hasValidToken,
  isLoading: false,
  error: null,
  profile: null,
  workList: [],
  currentWork: null,
  myWorks: [],
  userCounts: null,
};

// Enhanced error handler
const handleAsyncError = (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return 'Session expired. Please login again.';
  }
  
  return error.response?.data?.message || 
         error.response?.data?.detail ||
         error.message || 
         'An unexpected error occurred';
};

// Async Thunks with improved error handling
export const loginUser = createAsyncThunk(
  'userAuth/loginUser', 
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/users/signin/`, credentials);
      if (data?.tokens?.access) return data;
      return rejectWithValue(data?.message || 'Login failed');
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'userAuth/fetchProfile', 
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().userAuth.token;
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const { data } = await axios.get(`${API_BASE_URL}/users/users/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userAuth/updateProfile', 
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const token = getState().userAuth.token;
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const { data } = await axios.patch(`${API_BASE_URL}/users/update/users-details/`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const fetchWorkList = createAsyncThunk(
  'userAuth/fetchWorkList', 
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().userAuth.token;
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const { data } = await axios.get(`${API_BASE_URL}/admin_panel/catering/published/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const fetchWorkById = createAsyncThunk(
  'userAuth/fetchWorkById', 
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().userAuth.token;
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const { data } = await axios.get(`${API_BASE_URL}/admin_panel/published-work/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const requestWork = createAsyncThunk(
  'userAuth/requestWork', 
  async (requestData, { getState, rejectWithValue }) => {
    try {
      const token = getState().userAuth.token;
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const { data } = await axios.post(`${API_BASE_URL}/users/work-request/create/`, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const fetchMyWorks = createAsyncThunk(
  'userAuth/fetchMyWorks', 
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().userAuth.token;
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const { data } = await axios.get(`${API_BASE_URL}/users/work-request/list/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const fetchUserCounts = createAsyncThunk(
  'userAuth/fetchUserCounts', 
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().userAuth.token;
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const { data } = await axios.get(`${API_BASE_URL}/users/dashboard/stats/user/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

// Slice
const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      Object.assign(state, {
        user: null,
        token: null,
        isLoggedIn: false,
        error: null,
        isLoading: false,
        profile: null,
        workList: [],
        currentWork: null,
        myWorks: [],
        userCounts: null,
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },
    setAuthState: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoggedIn = true;
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearCurrentWork: (state) => {
      state.currentWork = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { tokens, user } = action.payload;
        state.isLoading = false;
        state.token = tokens.access;
        state.user = user;
        state.isLoggedIn = true;
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Auto logout on auth error
        if (action.payload?.includes('Session expired')) {
          state.user = null;
          state.token = null;
          state.isLoggedIn = false;
        }
      })

      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })

      // Fetch Work List
      .addCase(fetchWorkList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workList = action.payload;
      })
      .addCase(fetchWorkList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Work By ID
      .addCase(fetchWorkById.fulfilled, (state, action) => {
        state.currentWork = action.payload;
      })

      // Fetch My Works
      .addCase(fetchMyWorks.fulfilled, (state, action) => {
        state.myWorks = action.payload;
      })

      // Fetch User Counts
      .addCase(fetchUserCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCounts = action.payload;
      })
      .addCase(fetchUserCounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Request Work
      .addCase(requestWork.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestWork.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally update local state or refresh data
      })
      .addCase(requestWork.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, setAuthState, clearAuthError, clearCurrentWork } = userAuthSlice.actions;
export default userAuthSlice.reducer;