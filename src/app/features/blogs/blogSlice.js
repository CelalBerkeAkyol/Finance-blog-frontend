// src/features/blogs/blogsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api";

// API'den blog verilerini alacak asenkron thunk
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (page = 1, limit = 20) => {
    const response = await axios.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  }
);

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
    pagination: {
      next: null,
      total: 0,
      count: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload.data;
        state.pagination = action.payload.pagination;
        state.count = action.payload.count;
        state.total = action.payload.total;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default blogsSlice.reducer;
