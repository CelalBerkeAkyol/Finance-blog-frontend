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
      console.info("loginUser: Giriş başarılı!", response.data);
      return response.data;
    } catch (error) {
      console.error("loginUser hata:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Giriş başarısız."
      );
    }
  }
);

// Kullanıcı kayıt olma thunk'ı
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, thunkAPI) => {
    try {
      console.info("registerUser: Kayıt isteği gönderiliyor...", userData);
      const response = await axios.post("/auth/register", userData, {
        withCredentials: true,
      });
      console.info("registerUser: Kayıt başarılı!", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "registerUser hata:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Kayıt başarısız."
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

const initialState = {
  userInfo: null,
  token: null,
  isLoggedIn: false,
  isAdmin: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
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
        state.token = action.payload.token || null;
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("loginUser: Giriş başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Giriş başarısız.";
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        console.info("registerUser: Kayıt işlemi devam ediyor...");
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.info(
          "registerUser: Kayıt başarılı. Güncellenen state:",
          action.payload
        );
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.userInfo = action.payload.user;
        state.token = action.payload.token || null;
        state.isAdmin = action.payload.user?.role === "admin";
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error("registerUser: Kayıt başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Kayıt başarısız.";
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
        state.token = null;
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
        state.isAdmin = action.payload.user?.role === "admin";
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
