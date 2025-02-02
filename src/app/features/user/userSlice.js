// src/app/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın

// Kullanıcı giriş yapma thunk'ı
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      console.info("loginUser: Giriş isteği gönderiliyor...", {
        username,
        password,
      });
      const response = await axios.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      console.info(
        "loginUser: Giriş başarılı! Backend'den gelen veri:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("loginUser hata:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Giriş başarısız."
      );
    }
  }
);

// Kullanıcı çıkış yapma thunk'ı
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      console.info("logoutUser: Çıkış işlemi başlatılıyor...");
      // Port 5000'e istek yapılıyorsa, axios yapılandırmanızda baseURL varsa otomatik kullanılır.
      await axios.post("/auth/logout", {}, { withCredentials: true });
      console.info("logoutUser: Çıkış başarılı!");
      return true;
    } catch (error) {
      console.error("logoutUser hata:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue("Çıkış yapılamadı.");
    }
  }
);

// Kullanıcı bilgisi getirme thunk'ı
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      console.info("fetchUser: Kullanıcı bilgisi getiriliyor...");
      const response = await axios.post(
        "/auth/verify-token",
        {},
        { withCredentials: true }
      );
      const { valid, user } = response.data;
      if (!valid) {
        console.warn("fetchUser: Token geçersiz!");
        throw new Error("Token geçersiz.");
      }
      console.info("fetchUser: Kullanıcı bilgisi başarıyla alındı.", user);
      return { valid, user };
    } catch (error) {
      console.error(
        "fetchUser hata:",
        error.response?.data?.error || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Kullanıcı bilgileri alınamadı."
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isLoggedIn: false,
    isAdmin: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      console.info("userSlice: State temizleniyor...");
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        console.info("loginUser: Giriş işlemi devam ediyor...");
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.info(
          "loginUser: Giriş başarılı. Güncellenen state:",
          action.payload
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.userInfo = action.payload.user;
        if (action.payload?.userRole) {
          state.isAdmin = action.payload.userRole === "admin";
        } else {
          console.warn("loginUser: userRole bilgisi eksik!");
          state.isAdmin = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("loginUser: Giriş başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Giriş başarısız.";
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        console.info("logoutUser: Çıkış işlemi devam ediyor...");
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.info("logoutUser: Çıkış başarılı, state sıfırlanıyor.");
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = null;
        state.isLoggedIn = false;
        state.isAdmin = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.error("logoutUser: Çıkış başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Çıkış yapılamadı.";
      })
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        console.info(
          "fetchUser: Kullanıcı bilgisi getirme işlemi devam ediyor..."
        );
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.info(
          "fetchUser: Kullanıcı bilgisi başarıyla alındı.",
          action.payload
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = action.payload.valid;
        state.userInfo = action.payload.user;
        if (action.payload.user?.role) {
          state.isAdmin = action.payload.user.role === "admin";
        } else {
          console.warn("fetchUser: role bilgisi eksik!");
          state.isAdmin = false;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.error(
          "fetchUser: Kullanıcı bilgisi getirme başarısız!",
          action.payload
        );
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Kullanıcı bilgileri alınamadı.";
      });
  },
});

export const { clearState } = userSlice.actions;
export default userSlice.reducer;
