// src/app/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın

// Kullanıcı giriş yapma thunk'ı
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      console.info("loginUser: Giriş isteği gönderiliyor...", {
        email,
        password,
      });
      const response = await axios.post(
        "/auth/login",
        { email, password },
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

      // Token doğrulama
      const tokenResponse = await axios.post(
        "/auth/verify-token",
        {},
        { withCredentials: true }
      );

      const { valid, user } = tokenResponse.data;
      if (!valid) {
        console.warn("fetchUser: Token geçersiz!");
        throw new Error("Token geçersiz.");
      }

      // Eğer token geçerliyse ve kullanıcı ID'si varsa, güncel bilgileri getir
      if (user && (user._id || user.id)) {
        const userId = user._id || user.id;
        console.info(
          "fetchUser: Kullanıcı ID'si ile güncel bilgiler getiriliyor:",
          userId
        );

        try {
          const userResponse = await axios.get(`/user/${userId}`, {
            withCredentials: true,
          });
          if (userResponse.data && userResponse.data.data) {
            console.info(
              "fetchUser: Kullanıcı bilgisi başarıyla alındı (ID ile):",
              userResponse.data.data
            );
            return { valid, user: userResponse.data.data };
          }
        } catch (userError) {
          console.warn(
            "fetchUser: ID ile kullanıcı bilgisi getirilemedi, token bilgisi kullanılıyor:",
            userError
          );
          // Hata durumunda token'dan gelen bilgileri kullan
        }
      }

      console.info(
        "fetchUser: Kullanıcı bilgisi başarıyla alındı (token ile):",
        user
      );
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
// user register thunk
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ userName, email, password }, thunkAPI) => {
    try {
      console.info("registerUser: Registration request is being sent...", {
        userName,
        email,
        password,
      });
      const response = await axios.post(
        "/auth/register",
        { userName, email, password },
        { withCredentials: true }
      );
      console.info(
        "registerUser: Registration successful! Data from backend:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "registerUser error:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Registration failed."
      );
    }
  }
);

// Kullanıcı profili güncelleme thunk'ı
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, userData }, thunkAPI) => {
    try {
      console.info(
        "updateUserProfile: Profil güncelleme isteği gönderiliyor...",
        {
          userId,
          userData,
        }
      );
      const response = await axios.put(`/user/${userId}`, userData, {
        withCredentials: true,
      });
      console.info(
        "updateUserProfile: Güncelleme başarılı! Backend'den gelen veri:",
        response.data
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "updateUserProfile hata:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profil güncellenemedi."
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
        // Eğer role bilgisi admin kontrolü için kullanılacaksa:
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("loginUser: Giriş başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Giriş başarısız.";
      })
      // register
      .addCase(registerUser.pending, (state) => {
        console.info("registerUser: Registration is in progress...");
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.info(
          "registerUser: Registration successful. Updated state:",
          action.payload
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload.user;
        state.isLoggedIn = true;
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error("registerUser: Registration failed!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Registration failed.";
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
      })
      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        console.info(
          "updateUserProfile: Profil güncelleme işlemi devam ediyor..."
        );
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        console.info(
          "updateUserProfile: Profil güncelleme başarılı. Güncellenen state:",
          action.payload
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        console.error(
          "updateUserProfile: Profil güncelleme başarısız!",
          action.payload
        );
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Profil güncellenemedi.";
      });
  },
});

export const { clearState } = userSlice.actions;
export default userSlice.reducer;
