import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchTerm: ''
};

export const searchProductSlice = createSlice({
  name: 'searchProduct',
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSearch: state => {
      state.searchTerm = '';
    }
  }
});

export const { searchProduct, clearSearch } = searchProductSlice.actions;

export default searchProductSlice.reducer;
