import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to get tokens from localStorage
const getTokensFromStorage = () => {
  try {
    const tokens = localStorage.getItem('adminTokens');
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Error parsing tokens from localStorage:', error);
    return null;
  }
};

// Helper function to get user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('adminUser');
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

export const loginAdmin = createAsyncThunk(
  'adminAuth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://catershub.pythonanywhere.com/admin_panel/login/', credentials);

      if (response.data.status === true) {
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

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.tokens = null;
      state.isLoggedIn = false;
      state.error = null;
      state.isLoading = false;
      localStorage.removeItem('adminTokens');
      localStorage.removeItem('adminUser');
    },
    // Action to manually set auth state (useful for token refresh)
    setAuthState: (state, action) => {
      state.admin = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isLoggedIn = true;
      localStorage.setItem('adminTokens', JSON.stringify(action.payload.tokens));
      localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
    },
    // Clear auth errors
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isLoggedIn = true;
        localStorage.setItem('adminTokens', JSON.stringify(action.payload.tokens));
        localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.admin = null;
        state.tokens = null;
        state.isLoggedIn = false;
      });
  },
});

export const { logoutAdmin, setAuthState, clearAuthError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;