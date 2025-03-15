// src/app/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın
import { logInfo } from "../../../utils/logger";

// Kullanıcı giriş yapma thunk'ı
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Giriş başarısız.");
    }
  }
);

// Kullanıcı çıkış yapma thunk'ı
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Çıkış yapılamadı.");
    }
  }
);

// Kullanıcı bilgisi getirme thunk'ı
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      // Token doğrulama
      const tokenResponse = await axios.post(
        "/auth/verify-token",
        {},
        { withCredentials: true }
      );

      if (!tokenResponse.data.success) {
        throw new Error("Token geçersiz.");
      }

      const userData = tokenResponse.data.data;
      if (!userData || !userData.user) {
        throw new Error("Kullanıcı bilgisi bulunamadı.");
      }

      // Eğer kullanıcı ID'si varsa, güncel bilgileri getir
      if (userData.user.id || userData.user._id) {
        const userId = userData.user.id || userData.user._id;

        try {
          const userResponse = await axios.get(`/user/${userId}`, {
            withCredentials: true,
          });
          if (userResponse.data.success && userResponse.data.data) {
            return { valid: true, user: userResponse.data.data };
          }
        } catch (userError) {
          // Hata durumunda token'dan gelen bilgileri kullan
        }
      }

      return { valid: true, user: userData.user };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Kullanıcı bilgileri alınamadı."
      );
    }
  }
);

// user register thunk
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ userName, email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        "/auth/register",
        { userName, email, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Registration failed.");
    }
  }
);

// Kullanıcı profili güncelleme thunk'ı
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await axios.put(`/user/${userId}`, userData, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Profil güncellenemedi."
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
      logInfo("🧹 State", "Kullanıcı state temizleniyor");
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
        logInfo("🔄 Giriş", "Giriş işlemi başlatıldı");
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        logInfo(
          "✅ Giriş",
          `${
            action.payload.user?.userName || action.payload.user?.email
          } kullanıcısı giriş yaptı`
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.userInfo = action.payload.user;
        // Eğer role bilgisi admin kontrolü için kullanılacaksa:
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(loginUser.rejected, (state, action) => {
        logInfo("❌ Giriş", `Giriş başarısız: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Giriş başarısız.";
      })
      // register
      .addCase(registerUser.pending, (state) => {
        logInfo("🔄 Kayıt", "Kayıt işlemi başlatıldı");
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        logInfo(
          "✅ Kayıt",
          `${
            action.payload.user?.userName || action.payload.user?.email
          } kullanıcısı kaydedildi`
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload.user;
        state.isLoggedIn = true;
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(registerUser.rejected, (state, action) => {
        logInfo("❌ Kayıt", `Kayıt başarısız: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Registration failed.";
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        logInfo("🔄 Çıkış", "Çıkış işlemi başlatıldı");
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        logInfo("✅ Çıkış", "Kullanıcı çıkış yaptı");
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = null;
        state.isLoggedIn = false;
        state.isAdmin = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        logInfo("❌ Çıkış", `Çıkış başarısız: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Çıkış yapılamadı.";
      })
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        logInfo("🔄 Kullanıcı", "Kullanıcı bilgisi getiriliyor");
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        if (action.payload.valid && action.payload.user) {
          logInfo(
            "✅ Kullanıcı",
            `${
              action.payload.user?.userName ||
              action.payload.user?.email ||
              "Kullanıcı"
            } bilgisi alındı`
          );
        } else {
          logInfo("✅ Kullanıcı", "Kullanıcı bilgisi alındı (oturum yok)");
        }
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = action.payload.valid;
        state.userInfo = action.payload.user;
        if (action.payload.user?.role) {
          state.isAdmin = action.payload.user.role === "admin";
        } else {
          state.isAdmin = false;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        logInfo(
          "❌ Kullanıcı",
          `Kullanıcı bilgisi alınamadı: ${action.payload}`
        );
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Kullanıcı bilgileri alınamadı.";
      })
      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        logInfo("🔄 Profil", "Profil güncelleme başlatıldı");
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        logInfo(
          "✅ Profil",
          `${
            action.payload?.userName || action.payload?.email || "Kullanıcı"
          } profili güncellendi`
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        logInfo("❌ Profil", `Profil güncelleme başarısız: ${action.payload}`);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Profil güncellenemedi.";
      });
  },
});

export const { clearState } = userSlice.actions;
export default userSlice.reducer;
