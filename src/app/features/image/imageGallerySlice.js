// src/app/features/imageGallery/imageGallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { logInfo } from "../../../utils/logger";

// Sayfalı görsel listeleme thunk'ı
export const fetchImages = createAsyncThunk(
  "imageGallery/fetchImages",
  async ({ page = 1, limit = 9 }, thunkAPI) => {
    try {
      // API isteğinde page ve limit'i kullan
      const response = await api.get(`/images?page=${page}&limit=${limit}`);
      return response.data.data; // Backend'den gelen data.data yapısını kullan
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Görseller yüklenemedi."
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
      return response.data.data; // Backend'den gelen data.data yapısını kullan
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Görsel silinemedi.");
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
  reducers: {
    clearImageErrors: (state) => {
      state.error = null;
    },
    resetImageGallery: (state) => {
      state.images = [];
      state.loading = false;
      state.error = null;
      state.page = 1;
      state.totalPages = 1;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        logInfo("🔄 Görseller", "Görseller getiriliyor");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        logInfo(
          "✅ Görseller",
          `${action.payload.images?.length || 0} görsel başarıyla getirildi`
        );
        state.loading = false;
        state.images = action.payload.images;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        logInfo(
          "❌ Görseller",
          `Görseller getirilemedi: ${action.payload || action.error.message}`
        );
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteImage.pending, (state) => {
        logInfo("🔄 Görsel Silme", "Görsel siliniyor");
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        // Silme başarıyla bittiğinde, ilgili görseli state'ten çıkarabiliriz
        const deletedId = action.payload.image?._id;
        logInfo("✅ Görsel Silme", `Görsel silindi: ${deletedId}`);
        state.images = state.images.filter((img) => img._id !== deletedId);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        logInfo(
          "❌ Görsel Silme",
          `Görsel silinemedi: ${action.payload || action.error.message}`
        );
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearImageErrors, resetImageGallery } =
  imageGallerySlice.actions;
export default imageGallerySlice.reducer;
