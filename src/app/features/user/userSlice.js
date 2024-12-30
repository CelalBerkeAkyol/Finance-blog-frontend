// src/app/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        "/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      ); // Cookie'leri gönderme

      // Backend'den gelen veri yapısına göre ayarlayın
      return response.data;
    } catch (error) {
      // Hata durumunu yönetmek için
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Giriş başarısız."
      );
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true }); // Logout işlemi
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue("Çıkış yapılamadı.");
    }
  }
);

// Async thunk for fetching user info
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await axios.post("/auth/verify-token", {
        withCredentials: true,
      });
      const { valid, user } = response.data;

      if (!valid) {
        throw new Error("Token geçersiz.");
      }

      return { valid, user }; // Redux'a valid ve user gönder
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Kullanıcı bilgileri alınamadı."
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null, // { id, name, role } gibi kullanıcı bilgileri
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload.user; // Backend'den gelen kullanıcı bilgisi
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Giriş başarısız.";
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Çıkış yapılamadı.";
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload.user; // Kullanıcı bilgisi
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Kullanıcı bilgileri alınamadı.";
      });
  },
});

export const { clearState } = userSlice.actions;
export default userSlice.reducer;
