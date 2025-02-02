// src/app/features/blogs/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın

// Tüm postları sayfalı getirme
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      console.info(
        `fetchPosts: Postlar getiriliyor (sayfa: ${page}, limit: ${limit})`
      );
      const response = await axios.get("/posts", { params: { page, limit } });
      console.info("fetchPosts: Postlar başarıyla getirildi.");
      return response.data; // Backend yanıtına göre ayarlayın
    } catch (error) {
      console.error("fetchPosts hata:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Postları getirirken hata oluştu."
      );
    }
  }
);

// Kategoriye göre postları getirme
export const fetchPostsByCategory = createAsyncThunk(
  "posts/fetchPostsByCategory",
  async (category, thunkAPI) => {
    try {
      console.info(
        `fetchPostsByCategory: "${category}" kategorisine ait postlar getiriliyor.`
      );
      const response = await axios.get(`/category/${category}`);
      console.info(
        "fetchPostsByCategory: Postlar başarıyla getirildi.",
        response.data
      );
      return response.data.posts;
    } catch (error) {
      console.error(
        "fetchPostsByCategory hata:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Postları getirirken hata oluştu."
      );
    }
  }
);

// Yeni post ekleme
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (postData, thunkAPI) => {
    try {
      console.info(
        "addNewPost: Yeni post ekleme işlemi başlatılıyor.",
        postData
      );
      const response = await axios.post("/posts", postData);
      console.info("addNewPost: Post başarıyla eklendi.", response.data);
      return response.data; // Backend yanıtına göre ayarlayın
    } catch (error) {
      console.error("addNewPost hata:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Post eklerken hata oluştu."
      );
    }
  }
);

// Post güncelleme
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, thunkAPI) => {
    try {
      console.info("updatePost: Post güncelleme işlemi başlatılıyor. ID:", id);
      const response = await axios.put(`/posts/${id}`, postData);
      console.info("updatePost: Post güncellendi.", response.data);
      return response.data;
    } catch (error) {
      console.error("updatePost hata:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Post güncellerken hata oluştu."
      );
    }
  }
);

// Post silme
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, thunkAPI) => {
    try {
      console.info("deletePost: Post silme işlemi başlatılıyor. ID:", id);
      await axios.delete(`/posts/${id}`);
      console.info("deletePost: Post başarıyla silindi. ID:", id);
      return id;
    } catch (error) {
      console.error("deletePost hata:", error.response?.data || error.message);
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
    pagination: { next: null, total: 0, count: 0 },
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
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.posts || action.payload.data;
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
      // fetchPostsByCategory
      .addCase(fetchPostsByCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // addNewPost
      .addCase(addNewPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload.post || action.payload);
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Post eklerken hata oluştu.";
      })
      // updatePost
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
      // deletePost
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

export const { clearState, removePost } = postsSlice.actions;
export default postsSlice.reducer;
