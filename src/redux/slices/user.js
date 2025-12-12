import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

// initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  count: 0,
  isInitialized: false,
  followingShops: []
};

// slice
const slice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setLogin(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      
      // Save user data to cookies for public routes (without Redux)
      if (typeof document !== 'undefined' && action.payload) {
        // Save essential user data as JSON string
        const userData = {
          id: action.payload._id || action.payload.id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          isVerified: action.payload.isVerified
        };
        document.cookie = `userData=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=31536000`; // 1 year
        document.cookie = `isAuthenticated=true; path=/; max-age=31536000`;
        document.cookie = `userRole=${action.payload.role}; path=/; max-age=31536000`;
      }
    },
    setLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear all auth-related cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },

    setCount(state) {
      state.count = state.count + 1;
    },
    setInitialize(state) {
      state.isInitialized = true;
    },
    updateStatus(state, action) {
      state.user.status = action.payload;
    },
    verifyUser(state) {
      state.user.isVerified = true;
    },
    updateUserRole(state) {
      state.user.role = 'vendor';
    },
    updateFollowShop(state, action) {
      const filtered = state.followingShops.filter((v) => v === action.payload);
      if (filtered.length) {
        const removedShop = state.followingShops.filter((v) => v !== action.payload);
        state.followingShops = removedShop;
      } else {
        state.followingShops = [...state.followingShops, action.payload];
      }
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setLogin,
  setLogout,
  setCount,
  setInitialize,
  updateStatus,
  verifyUser,
  updateUserRole,
  updateFollowShop
} = slice.actions;

// ----------------------------------------------------------------------
