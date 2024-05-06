import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  compare: []
};

const slice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addCompareProduct(state, action) {
      state.products = [...state.products, action.payload];
    },
    removeCompareProduct(state, action) {
      const filtered = state.products.filter((p) => p._ud !== action.payload);
      state.products = filtered;
    },
    resetCompareProducts(state) {
      state.products = [];
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { addCompareProduct, removeCompareProduct, resetCompareProducts } = slice.actions;

// ----------------------------------------------------------------------
