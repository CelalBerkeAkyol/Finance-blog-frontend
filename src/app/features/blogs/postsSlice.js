// src/app/features/blogs/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // kendi axios ayarınız
import { logInfo } from "../../../utils/logger";

// Tüm postları sayfalı getirme
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 20 }, thunkAPI) => {
    try {
      const response = await axios.get("/posts", { params: { page, limit } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Postları getirirken hata oluştu."
      );
    }
  }
);
// Tek bir postu ID'ye göre getiren thunk
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(`/posts/one-post/${postId}`);
      // Yeni response yapısına göre post verisini al
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Tekil post getirilirken hata oluştu."
      );
    }
  }
);

// Upvote thunk
export const upvotePost = createAsyncThunk(
  "posts/upvotePost",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.put(`/posts/${postId}/upvote`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Upvote eklenirken hata oluştu."
      );
    }
  }
);

// Downvote thunk
export const downvotePost = createAsyncThunk(
  "posts/downvotePost",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.put(`/posts/${postId}/downvote`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Downvote eklenirken hata oluştu."
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
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Postları getirirken hata oluştu."
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
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Post eklerken hata oluştu."
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
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Post güncellerken hata oluştu."
      );
    }
  }
);

// Post silme
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/posts/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Post silerken hata oluştu."
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
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "View artırırken hata oluştu.");
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

    // İsterseniz pagination, total vs. ek alanlar
    pagination: { next: null, total: 0, count: 0 },
  },
  reducers: {
    clearState: (state) => {
      logInfo("🧹 State", "Post state temizleniyor");
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
    removePost: (state, action) => {
      logInfo("🗑️ Post", `Post siliniyor: ${action.payload}`);
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        logInfo("🔄 Postlar", "Postlar getiriliyor");
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        logInfo(
          "✅ Postlar",
          `${action.payload.data.posts?.length || 0} post başarıyla getirildi`
        );
        state.isLoading = false;
        state.isSuccess = true;
        // Yeni response yapısına göre posts'u al
        state.posts = action.payload.data.posts;
        state.pagination = action.payload.data.pagination || {
          next: null,
          total: 0,
          count: 0,
        };
        // total, count vs. isterseniz
        state.count = action.payload.data.count || 0;
        state.total = action.payload.data.total || 0;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        logInfo("❌ Postlar", `Postlar getirilemedi: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload || "Postları getirirken hata oluştu.";
      })
      // Fetch post by ıd
      .addCase(fetchPostById.fulfilled, (state, action) => {
        if (!action.payload) {
          logInfo("❌ Post", "Post verisi bulunamadı");
          return;
        }

        const fetchedPost = action.payload;
        // posts dizisinde aynı ID var mı?
        const index = state.posts.findIndex((p) => p._id === fetchedPost._id);
        if (index !== -1) {
          // varsa güncelle
          logInfo(
            "✅ Post",
            `Post güncellendi: ${fetchedPost.title || fetchedPost._id}`
          );
          state.posts[index] = fetchedPost;
        } else {
          // yoksa ekle
          logInfo(
            "✅ Post",
            `Yeni post eklendi: ${fetchedPost.title || fetchedPost._id}`
          );
          state.posts.push(fetchedPost);
        }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        logInfo("❌ Post", `Post getirilemedi: ${action.payload}`);
        state.isError = true;
        state.errorMessage = action.payload || "Post getirilirken hata oluştu.";
      })

      // Upvote işlemi sonrası güncellenmiş post objesini store'da güncelle
      .addCase(upvotePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) {
          logInfo(
            "👍 Upvote",
            `Post upvote edildi: ${updatedPost.title || updatedPost._id}`
          );
          state.posts[index] = updatedPost;
        }
      })
      .addCase(upvotePost.rejected, (state, action) => {
        logInfo("❌ Upvote", `Upvote başarısız: ${action.payload}`);
        state.isError = true;
      })

      // Downvote işlemi sonrası güncellenmiş post objesini store'da güncelle
      .addCase(downvotePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) {
          logInfo(
            "👎 Downvote",
            `Post downvote edildi: ${updatedPost.title || updatedPost._id}`
          );
          state.posts[index] = updatedPost;
        }
      })
      .addCase(downvotePost.rejected, (state, action) => {
        logInfo("❌ Downvote", `Downvote başarısız: ${action.payload}`);
        state.isError = true;
      })

      // fetchPostsByCategory
      .addCase(fetchPostsByCategory.pending, (state) => {
        logInfo("🔄 Kategori", "Kategoriye göre postlar getiriliyor");
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        logInfo(
          "✅ Kategori",
          `${action.payload?.length || 0} post kategoriye göre getirildi`
        );
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        logInfo(
          "❌ Kategori",
          `Kategoriye göre postlar getirilemedi: ${action.payload}`
        );
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // addNewPost
      .addCase(addNewPost.pending, (state) => {
        logInfo("🔄 Yeni Post", "Post ekleniyor");
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // backend yanıtında { post: {...} } varsa
        const newPost = action.payload.post || action.payload;
        logInfo(
          "✅ Yeni Post",
          `Post eklendi: ${newPost.title || newPost._id}`
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(newPost);
      })
      .addCase(addNewPost.rejected, (state, action) => {
        logInfo("❌ Yeni Post", `Post eklenemedi: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Post eklerken hata oluştu.";
      })

      // updatePost
      .addCase(updatePost.pending, (state) => {
        logInfo("🔄 Post Güncelleme", "Post güncelleniyor");
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload.post || action.payload;
        logInfo(
          "✅ Post Güncelleme",
          `Post güncellendi: ${updatedPost.title || updatedPost._id}`
        );
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        logInfo("❌ Post Güncelleme", `Post güncellenemedi: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Post güncellerken hata oluştu.";
      })

      // deletePost
      .addCase(deletePost.pending, (state) => {
        logInfo("🔄 Post Silme", "Post siliniyor");
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        logInfo("✅ Post Silme", `Post silindi: ${action.payload}`);
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        logInfo("❌ Post Silme", `Post silinemedi: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Post silerken hata oluştu.";
      })

      // incrementPostView
      .addCase(incrementPostView.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          logInfo(
            "👁️ Görüntülenme",
            `Post görüntülendi: ${updatedPost.title || updatedPost._id}`
          );
          state.posts[index] = updatedPost;
        }
      })
      .addCase(incrementPostView.rejected, (state, action) => {
        logInfo(
          "❌ Görüntülenme",
          `Görüntülenme sayısı artırılamadı: ${action.payload}`
        );
        state.isError = true;
        state.errorMessage =
          action.payload || "Görüntülenme sayısı artırılırken hata oluştu.";
      });
  },
});

export const { clearState, removePost } = postsSlice.actions;
export default postsSlice.reducer;
