// src/app/features/blogs/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // kendi axios ayarınız

// Tüm postları sayfalı getirme
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 20 }, thunkAPI) => {
    try {
      const response = await axios.get("/posts", { params: { page, limit } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Postları getirirken hata oluştu."
      );
    }
  }
);

// Post upvote (beğeni) işlemi
export const upvotePost = createAsyncThunk(
  "posts/upvotePost",
  async (postId, thunkAPI) => {
    try {
      console.info("upvotePost: Posta upvote ekleniyor, ID:", postId);
      const response = await axios.put(`/posts/${postId}/upvote`);
      // Backend yanıt formatınızı varsayıyoruz: { success: true, data: { ...post } }
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("upvotePost hata:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Upvote eklenirken hata oluştu."
      );
    }
  }
);

// Post downvote (beğenmeme) işlemi
export const downvotePost = createAsyncThunk(
  "posts/downvotePost",
  async (postId, thunkAPI) => {
    try {
      console.info("downvotePost: Posta downvote ekleniyor, ID:", postId);
      const response = await axios.put(`/posts/${postId}/downvote`);
      return response.data.data;
    } catch (error) {
      console.error(
        "downvotePost hata:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Downvote eklenirken hata oluştu."
      );
    }
  }
);

// Kategoriye göre postları getirme
export const fetchPostsByCategory = createAsyncThunk(
  "posts/fetchPostsByCategory",
  async (category, thunkAPI) => {
    try {
      const response = await axios.get(`/category/${category}`);
      return response.data.posts;
    } catch (error) {
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
      const response = await axios.post("/posts", postData);
      return response.data; // { success: true, post: {...} } gibi döndüğünü varsayıyoruz
    } catch (error) {
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
      const response = await axios.put(`/posts/${id}`, postData);
      return response.data; // { success: true, post: {...} } gibi
    } catch (error) {
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
      await axios.delete(`/posts/${id}`);
      return id; // Sadece silinen ID dönüyoruz
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Post silerken hata oluştu."
      );
    }
  }
);

// Post görüntülenme sayısını artırma
export const incrementPostView = createAsyncThunk(
  "posts/incrementPostView",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/posts/${postId}/view`);
      // { success: true, data: {...} }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "View artırırken hata oluştu."
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    // Post ID -> oy sayısı şeklinde bir dictionary
    votes: {},
    // İsterseniz pagination, total vs. ek alanlar
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
        // response.data'da posts veya data alanını kullandığınızı varsayıyoruz
        state.posts = action.payload.posts || action.payload.data;
        state.pagination = action.payload.pagination || {
          next: null,
          total: 0,
          count: 0,
        };
        // total, count vs. isterseniz
        state.count = action.payload.count || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload || "Postları getirirken hata oluştu.";
      })

      // Upvote
      .addCase(upvotePost.pending, (state) => {
        // Dilerseniz isLoading veya başka state güncellemesi yapabilirsiniz
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost; // Store'daki post'u güncelle
        }
        // votes özelliğini global saklamak istiyorsanız:
        state.votes[updatedPost._id] = updatedPost.votes;
      })
      .addCase(upvotePost.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload || "Upvote eklerken hata oluştu.";
      })

      // Downvote
      .addCase(downvotePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        state.votes[updatedPost._id] = updatedPost.votes;
      })
      .addCase(downvotePost.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload || "Downvote eklerken hata oluştu.";
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
        // backend yanıtında { post: {...} } varsa
        const newPost = action.payload.post || action.payload;
        state.posts.unshift(newPost);
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
          (post) => post._id === updatedPost._id
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
      })

      // incrementPostView
      .addCase(incrementPostView.pending, (state) => {
        // İsteğe göre isLoading vs güncelleyebilirsiniz
      })
      .addCase(incrementPostView.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
      })
      .addCase(incrementPostView.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage =
          action.payload || "Görüntülenme sayısı artırılırken hata oluştu.";
      });
  },
});

export const { clearState, removePost } = postsSlice.actions;
export default postsSlice.reducer;
