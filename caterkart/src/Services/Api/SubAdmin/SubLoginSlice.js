import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getTokensFromStorage = () => {
  try {
    const tokens = localStorage.getItem('subAdminToken');
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Error parsing tokens from localStorage:', error);
    return null;
  }
};

// Helper function to get user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('subAdminToken');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Check if tokens are still valid (you can customize this logic)
const isTokenValid = (tokens) => {
  if (!tokens || !tokens.access) return false;
  
  try {
    // Decode JWT token to check expiration (basic check)
    const tokenPayload = JSON.parse(atob(tokens.access.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return tokenPayload.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const subAdminLogin = createAsyncThunk(
  'SubAdminAuth/subAdminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://catershub.pythonanywhere.com/users/signin/', credentials);

      if (response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Initialize state with data from localStorage
const storedTokens = getTokensFromStorage();
const storedUser = getUserFromStorage();
const hasValidTokens = storedTokens && isTokenValid(storedTokens);

const initialState = {
  admin: hasValidTokens ? storedUser : null,
  tokens: hasValidTokens ? storedTokens : null,
  isLoggedIn: hasValidTokens,
  isLoading: false,
  error: null,
};

const SubAdminAuthSlice = createSlice({
  name: 'SubAdminAuth',
  initialState,
  reducers: {
    logoutSubAdmin: (state) => {
      state.SubAdmin = null;
      state.tokens = null;
      state.isLoggedIn = false;
      state.error = null;
      state.isLoading = false;
      localStorage.removeItem('subAdminToken');
      localStorage.removeItem('SubAdminUser');
    },
    // Action to manually set auth state (useful for token refresh)
    setAuthState: (state, action) => {
      state.SubAdmin = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isLoggedIn = true;
      localStorage.setItem('subAdminToken', JSON.stringify(action.payload.tokens));
      localStorage.setItem('SubAdminUser', JSON.stringify(action.payload.user));
    },
    // Clear auth errors
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        localStorage.setItem('SubAdminUser', JSON.stringify(action.payload.user));
      })
      .addCase(subAdminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.admin = null;
        state.tokens = null;
        state.isLoggedIn = false;
      });
  },
});

export const { logoutSubAdmin, setAuthState, clearAuthError } = SubAdminAuthSlice.actions;
export default SubAdminAuthSlice.reducer;