import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../api/product.api';

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async () => {
    const response = await productApi.getFeaturedProducts();
    return response.data.products;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    featuredProducts: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default productSlice.reducer;