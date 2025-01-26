// src/app/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın

// Kullanıcı giriş yapma thunk'ı
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      console.log("Login isteği gönderiliyor...", { username, password });

      const response = await axios.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );

      console.log("Login başarılı! Backend'den gelen veri:", response.data);

      return response.data;
    } catch (error) {
      console.error("Login başarısız!", error.response?.data || error.message);

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
      console.log("Çıkış işlemi başlatılıyor...");

      await axios.post("/auth/logout", {}, { withCredentials: true });

      console.log("Çıkış başarılı!");
      return true;
    } catch (error) {
      console.error("Çıkış başarısız!", error.response?.data || error.message);
      return thunkAPI.rejectWithValue("Çıkış yapılamadı.");
    }
  }
);

// Kullanıcı bilgisini getirme thunk'ı
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      console.log("Kullanıcı bilgisi getiriliyor...");

      const response = await axios.post("/auth/verify-token", {
        withCredentials: true,
      });

      const { valid, user } = response.data;

      if (!valid) {
        console.warn("Token geçersiz!");
        throw new Error("Token geçersiz.");
      }

      return { valid, user }; // Redux'a valid ve user gönder
    } catch (error) {
      console.error(
        "fetchUser başarısız!",
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
    userInfo: null, // Kullanıcı bilgileri
    isLoggedIn: false,
    isAdmin: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      console.log("State temizleniyor...");
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Kullanıcı giriş yapıyor
      .addCase(loginUser.pending, (state) => {
        console.log("Login işlemi devam ediyor...");
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login başarılı! Güncellenen Redux state:", action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;

        if (action.payload?.userRole) {
          state.isAdmin = action.payload.userRole === "admin";
        } else {
          console.warn(
            "userRole bilgisi eksik! Backend doğru veri döndürüyor mu?"
          );
          state.isAdmin = false;
        }

        console.log("Son isAdmin state:", state.isAdmin);
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("Login başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Giriş başarısız.";
      })

      // Kullanıcı çıkış yapıyor
      .addCase(logoutUser.pending, (state) => {
        console.log("Çıkış işlemi devam ediyor...");
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log("Çıkış başarılı, Redux state sıfırlanıyor...");
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = null;
        state.isLoggedIn = false;
        state.isAdmin = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.log("Çıkış başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Çıkış yapılamadı.";
      })

      // Kullanıcı bilgisi getiriliyor
      .addCase(fetchUser.pending, (state) => {
        console.log("fetchUser isteği devam ediyor...");
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log(
          "fetchUser başarılı! Güncellenen Redux state:",
          action.payload
        );

        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = action.payload.valid;

        if (action.payload.user?.role) {
          state.isAdmin = action.payload.user.role === "admin";
        } else {
          console.warn(
            "fetchUser: role bilgisi eksik! Backend doğru veri döndürüyor mu?"
          );
          state.isAdmin = false;
        }

        console.log("Son fetchUser isAdmin state:", state.isAdmin);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.log("fetchUser başarısız!", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Kullanıcı bilgileri alınamadı.";
      });
  },
});

export const { clearState } = userSlice.actions;
export default userSlice.reducer;
