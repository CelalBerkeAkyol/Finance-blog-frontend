// src/app/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api"; // Axios yapılandırmanızı kullanın
import { logInfo } from "../../../utils/logger";

/* =====================
   Yardımcı Fonksiyonlar
===================== */

// Pending durumunda ortak ayarlar
const handlePending = (state) => {
  state.isLoading = true;
};

// Rejected durumunda ortak ayarlar (defaultMessage: ilgili mesaj)
const handleRejected = (state, action, defaultMessage) => {
  state.isLoading = false;
  state.isError = true;
  state.errorMessage = action.payload?.message || defaultMessage;
  state.errorCode = action.payload?.code || "UNKNOWN_ERROR";
};

// Login fulfilled: API yanıtından gelen kullanıcı bilgisini state'e aktarır.
const handleLoginFulfilled = (state, action) => {
  const user = action.payload.data.user;
  const userName = user.userName || user.email || "Kullanıcı";
  logInfo("✅ Giriş", `${userName} kullanıcısı giriş yaptı`);
  state.userInfo = user;
  state.isAdmin = user.role === "admin";
  state.isAuthor = user.role === "author";
  state.isLoggedIn = true;
  state.isLoading = false;
  state.isSuccess = true;
};

// Register fulfilled: Girişe benzer şekilde kullanıcı bilgilerini aktarır.
const handleRegisterFulfilled = (state, action) => {
  if (action.payload.success && action.payload.data?.user) {
    const user = action.payload.data.user;
    const userName = user.userName || user.email || "Kullanıcı";
    logInfo("✅ Kayıt", `${userName} kullanıcısı kaydedildi`);
    state.userInfo = user;
    state.isAdmin = user.role === "admin";
    state.isAuthor = user.role === "author" || user.role === "admin";
    state.isLoggedIn = true;
  } else {
    logInfo("⚠️ Kayıt", "Kayıt başarılı ancak kullanıcı bilgisi eksik");
    state.isLoggedIn = false;
  }
  state.isLoading = false;
  state.isSuccess = true;
};

// Logout fulfilled: Kullanıcı çıkışı sonrası state sıfırlanır.
const handleLogoutFulfilled = (state) => {
  logInfo("✅ Çıkış", "Kullanıcı çıkış yaptı");
  state.isLoading = false;
  state.isSuccess = true;
  state.userInfo = null;
  state.isLoggedIn = false;
  state.isAdmin = false;
  state.isAuthor = false;
};

// FetchUser fulfilled: Kullanıcı bilgisi güncel bilgileri state'e aktarır.
const handleFetchUserFulfilled = (state, action) => {
  const user = action.payload.user;
  logInfo("✅ Kullanıcı", `${user.userName} bilgisi alındı`);
  state.userInfo = user;
  state.isAdmin = user.role === "admin";
  state.isAuthor = user.role === "author";
  state.isLoggedIn = true;
  state.isLoading = false;
  state.isSuccess = true;
};

// UpdateUserProfile fulfilled: Profil güncellemesi sonrası state'i günceller.
const handleUpdateProfileFulfilled = (state, action) => {
  if (action.payload.success && action.payload.data) {
    const user = action.payload.data;
    const userName = user.userName || user.email || "Kullanıcı";
    logInfo("✅ Profil", `${userName} profili güncellendi`);
    state.userInfo = user;
    state.isAdmin = user.role === "admin";
    state.isAuthor = user.role === "author" || user.role === "admin";
  } else {
    logInfo("⚠️ Profil", "Profil güncelleme başarılı ancak veri eksik");
  }
  state.isLoading = false;
  state.isSuccess = true;
};

// DeleteAccount fulfilled: Kullanıcı hesabı silindikten sonra state sıfırlanır.
const handleDeleteAccountFulfilled = (state, action) => {
  logInfo("✅ Hesap Silme", "Kullanıcı hesabı silindi");

  // LocalStorage ve sessionStorage temizle (çift kontrol)
  localStorage.removeItem("userInfo");
  sessionStorage.removeItem("userInfo");

  // State'i tamamen sıfırla
  state.isLoading = false;
  state.isSuccess = true;
  state.userInfo = null;
  state.isLoggedIn = false;
  state.isAdmin = false;
  state.isAuthor = false;
};

/* =====================
   Thunk İşlemleri
===================== */

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
      const errMessage = error.message || "Giriş başarısız.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
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
      const errMessage = error.message || "Çıkış yapılamadı.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Kullanıcı bilgisi getirme thunk'ı
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
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
          // Hata durumunda token'dan gelen bilgileri kullanmaya devam edelim
        }
      }
      return { valid: true, user: userData.user };
    } catch (error) {
      const errMessage = error.message || "Kullanıcı bilgileri alınamadı.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Kullanıcı kayıt thunk'ı
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
      const errMessage = error.message || "Registration failed.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
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
      return response.data;
    } catch (error) {
      const errMessage = error.message || "Profil güncellenemedi.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Kullanıcı hesabını silme thunk'ı
export const deleteUserAccount = createAsyncThunk(
  "user/deleteUserAccount",
  async (userId, thunkAPI) => {
    try {
      // userId parametresi ve kullanıcı state'i için güvenlik kontrolleri
      if (!userId) {
        console.error(
          "deleteUserAccount: Silme işlemi için kullanıcı ID'si belirtilmedi"
        );
        throw new Error(
          "Kullanıcı silme işlemi için geçerli bir ID belirtilmelidir"
        );
      }

      logInfo(
        "deleteUserAccount: Kullanıcı silme işlemi başlatıldı, ID =",
        userId
      );

      const response = await axios.delete(`/user/${userId}/hard`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      const errMessage = error.message || "Hesap silinemedi.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

/* =====================
   Slice Tanımı
===================== */

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isLoggedIn: false,
    isAdmin: false,
    isAuthor: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    errorCode: "",
  },
  reducers: {
    clearState: (state) => {
      logInfo(
        "🧹 State",
        "Geçici durumlar temizleniyor (kullanıcı bilgileri korunuyor)"
      );
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
      state.errorCode = "";
    },
    clearUserState: (state) => {
      logInfo("🧹 State", "Kullanıcı state tamamen temizleniyor");
      state.userInfo = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.isAuthor = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
      state.errorCode = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleLoginFulfilled)
      .addCase(loginUser.rejected, (state, action) =>
        handleRejected(state, action, "Giriş başarısız.")
      )
      // registerUser
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleRegisterFulfilled)
      .addCase(registerUser.rejected, (state, action) =>
        handleRejected(state, action, "Registration failed.")
      )
      // logoutUser
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, handleLogoutFulfilled)
      .addCase(logoutUser.rejected, (state, action) =>
        handleRejected(state, action, "Çıkış yapılamadı.")
      )
      // fetchUser - Tekil kullanıcı bilgileri (oturum açmış kullanıcı)
      .addCase(fetchUser.pending, handlePending)
      .addCase(fetchUser.fulfilled, handleFetchUserFulfilled)
      .addCase(fetchUser.rejected, (state, action) =>
        handleRejected(state, action, "Kullanıcı bilgileri alınamadı.")
      )
      // updateUserProfile
      .addCase(updateUserProfile.pending, handlePending)
      .addCase(updateUserProfile.fulfilled, handleUpdateProfileFulfilled)
      .addCase(updateUserProfile.rejected, (state, action) =>
        handleRejected(state, action, "Profil güncellenemedi.")
      )
      // deleteUserAccount
      .addCase(deleteUserAccount.pending, handlePending)
      .addCase(deleteUserAccount.fulfilled, handleDeleteAccountFulfilled)
      .addCase(deleteUserAccount.rejected, (state, action) =>
        handleRejected(state, action, "Hesap silinemedi.")
      );
  },
});

export const { clearState, clearUserState } = userSlice.actions;
export default userSlice.reducer;
