// src/app/features/imageGallery/imageGallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Sayfalı görsel listeleme thunk'ı
export const fetchImages = createAsyncThunk(
  "imageGallery/fetchImages",
  async ({ page = 1, limit = 9 }, thunkAPI) => {
    try {
      // API isteğinde page ve limit’i kullan
      const response = await api.get(`/images?page=${page}&limit=${limit}`);
      return response.data; // { images, page, totalPages, ... }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ?? error.message
      );
    }
  }
);
// Görsel silme işlemi
export const deleteImage = createAsyncThunk(
  "imageGallery/deleteImage",
  async (imageId, thunkAPI) => {
    try {
      const response = await api.delete(`/images/${imageId}`);
      return response.data; // { message, image }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ?? error.message
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
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        // Silme başarıyla bittiğinde, ilgili görseli state'ten çıkarabiliriz
        const deletedId = action.payload.image?._id;
        state.images = state.images.filter((img) => img._id !== deletedId);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default imageGallerySlice.reducer;
