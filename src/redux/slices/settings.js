import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

// initial state
const initialState = {
  themeMode: 'light',
  openSidebar: false,
  currency: process.env.BASE_CURRENCY || 'AED',
  rate: 1,
  selectedCountry: 'GB'
};

// slice
const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode(state, action) {
      state.themeMode = action.payload;
      // Save to cookie for public routes
      if (typeof document !== 'undefined') {
        document.cookie = `themeMode=${action.payload}; path=/; max-age=31536000; SameSite=Lax`; // 1 year
      }
    },
    toggleSidebar(state, action) {
      state.openSidebar = action.payload;
    },
    handleChangeCurrency(state, action) {
      state.currency = action.payload.currency;
      state.rate = action.payload.rate;
      state.selectedCountry = action.payload.selectedCountry;
      
      // Save to cookies for public routes (without Redux)
      if (typeof document !== 'undefined') {
        document.cookie = `currency=${action.payload.currency}; path=/; max-age=31536000`; // 1 year
        document.cookie = `rate=${action.payload.rate}; path=/; max-age=31536000`;
        document.cookie = `selectedCountry=${action.payload.selectedCountry}; path=/; max-age=31536000`;
      }
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { setThemeMode, toggleSidebar, handleChangeCurrency } = slice.actions;

// ----------------------------------------------------------------------
