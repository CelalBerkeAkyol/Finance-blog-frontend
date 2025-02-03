import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Görsel yükleme işlemi için async thunk
export const uploadImage = createAsyncThunk(
  "image/uploadImage",
  async (formData, thunkAPI) => {
    try {
      const response = await api.post("/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

const imageSlice = createSlice({
  name: "imageUpload",
  initialState: {
    loading: false,
    error: null,
    success: false,
    image: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.image = action.payload.image;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default imageSlice.reducer;
