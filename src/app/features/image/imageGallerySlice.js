// src/app/features/imageGallery/imageGallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Sayfalı görsel listeleme thunk'ı
export const fetchImages = createAsyncThunk(
  "imageGallery/fetchImages",
  async (page = 1, thunkAPI) => {
    try {
      const response = await api.get(`/images?page=${page}&limit=9`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.error
          ? error.response.data.error
          : error.message
      );
    }
  }
);

const imageGallerySlice = createSlice({
  name: "imageGallery",
  initialState: {
    images: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.images;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default imageGallerySlice.reducer;
