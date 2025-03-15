import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { logInfo } from "../../../utils/logger";

// Çoklu görsel yükleme
export const uploadImages = createAsyncThunk(
  "image/uploadImages",
  async (formData, thunkAPI) => {
    try {
      // /images/multiple => back-end'de çoklu yükleme rotası
      const response = await api.post("/images/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; // { message, images: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Görsel yükleme başarısız."
      );
    }
  }
);

const imageSlice = createSlice({
  name: "imageUpload",
  initialState: {
    loading: false,
    error: null,
    success: false,
    images: [], // Birden fazla görsel döneceği için array tutmak mantıklı
  },
  reducers: {
    clearImageState: (state) => {
      logInfo("🧹 Görsel", "Görsel state temizleniyor");
      state.loading = false;
      state.error = null;
      state.success = false;
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        logInfo("🔄 Görsel Yükleme", "Görseller yükleniyor");
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        logInfo(
          "✅ Görsel Yükleme",
          `${action.payload.images?.length || 0} görsel başarıyla yüklendi`
        );
        state.loading = false;
        state.success = true;
        state.images = action.payload.images; // Array
      })
      .addCase(uploadImages.rejected, (state, action) => {
        logInfo(
          "❌ Görsel Yükleme",
          `Görsel yüklenemedi: ${action.payload || action.error.message}`
        );
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearImageState } = imageSlice.actions;
export default imageSlice.reducer;
