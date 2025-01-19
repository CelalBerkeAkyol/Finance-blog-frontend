// src/app/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın

// Async thunk for fetching all posts with pagination
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await axios.get("/posts", {
        params: { page, limit },
      });
      return response.data; // Backend'den dönen veri yapısına göre ayarlayın
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Postları getirirken hata oluştu."
      );
    }
  }
);
export const fetchPostsByCategory = createAsyncThunk(
  "posts/fetchPostsByCategory",
  async (category, thunkAPI) => {
    try {
      const response = await axios.get(`/category/${category}`);
      console.log("API yanıtı:", response.data);
      return response.data.posts; // Backend'den dönen veri yapısına göre ayarlayın
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Postları getirirken hata oluştu."
      );
    }
  }
);

// Async thunk for adding a new post
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (postData, thunkAPI) => {
    try {
      const response = await axios.post("/posts", postData);
      return response.data; // Yeni oluşturulan postu döndür
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Post eklerken hata oluştu."
      );
    }
  }
);

// Async thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, thunkAPI) => {
    try {
      const response = await axios.put(`/posts/${id}`, postData);
      return response.data; // Güncellenen postu döndür
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Post güncellerken hata oluştu."
      );
    }
  }
);

// Async thunk for deleting a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/posts/${id}`);
      return id; // Silinen postun ID'sini döndür
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Post silerken hata oluştu."
      );
    }
  }
);

// Redux slice
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    pagination: {
      next: null,
      total: 0,
      count: 0,
    },
  },
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.posts || action.payload.data; // Backend yanıtına bağlı olarak ayarlayın
        state.pagination = action.payload.pagination || {
          next: null,
          total: 0,
          count: 0,
        };
        state.count = action.payload.count || action.payload.total;
        state.total = action.payload.total || action.payload.count;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload || "Postları getirirken hata oluştu.";
      })
      // fetchPostByCategory
      .addCase(fetchPostsByCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload; // Gelen kategori postlarını sakla
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Add New Post
      .addCase(addNewPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload.post || action.payload); // Backend yanıtına bağlı olarak ayarlayın
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Post eklerken hata oluştu.";
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedPost = action.payload.post || action.payload;
        const index = state.posts.findIndex(
          (post) => post.id === updatedPost.id
        );
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Post güncellerken hata oluştu.";
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Post silerken hata oluştu.";
      });
  },
});

export const { clearState } = postsSlice.actions;
export default postsSlice.reducer;
