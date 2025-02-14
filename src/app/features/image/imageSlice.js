import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Çoklu görsel yükleme
export const uploadImages = createAsyncThunk(
  "image/uploadImages",
  async (formData, thunkAPI) => {
    try {
      // /images/multiple => back-end’de çoklu yükleme rotası
      const response = await api.post("/images/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; // { message, images: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ?? error.message
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.images = action.payload.images; // Array
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default imageSlice.reducer;
