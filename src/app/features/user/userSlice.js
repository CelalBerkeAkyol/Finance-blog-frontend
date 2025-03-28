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

// FetchTeamMembers fulfilled: Yazarlar ve adminleri state'e aktarır
const handleFetchTeamMembersFulfilled = (state, action) => {
  logInfo(
    "✅ Yazarlar ve Adminler",
    `${action.payload.data.length} kişi alındı`
  );
  state.teamMembers = action.payload.data;
  state.isTeamLoading = false;
  state.isTeamSuccess = true;
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

// Kullanıcı silme thunk'ı (admin için)
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ userId }, thunkAPI) => {
    try {
      // Kullanıcı ID'si sağlanmalı
      if (!userId) {
        throw new Error("Kullanıcı ID'si gereklidir");
      }

      const response = await axios.delete(`/user/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const errMessage = error.message || "Kullanıcı silinemedi.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Handle user deletion success
const handleDeleteUserFulfilled = (state, action) => {
  // If the admin deleted their own account or current logged in user
  if (action.payload.data && action.payload.data.isCurrentUser) {
    logInfo(
      "✅ Silme",
      "Admin kendi hesabını sildi veya giriş yapmış kullanıcı silindi - çıkış yapılıyor"
    );
    // Clear all user data
    state.userInfo = null;
    state.isLoggedIn = false;
    state.isAdmin = false;
    state.isAuthor = false;
  } else {
    logInfo(
      "✅ Silme",
      `${action.payload.data?.userName || "Kullanıcı"} silindi`
    );
  }
  state.isLoading = false;
  state.isSuccess = true;
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

// Kullanıcı rolü güncelleme thunk'ı
export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ userId, role }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/user/${userId}/role`,
        { role },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      const errMessage = error.message || "Kullanıcı rolü güncellenemedi.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Yazarlar ve adminleri getirme thunk'ı
export const fetchTeamMembers = createAsyncThunk(
  "user/fetchTeamMembers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/user/team");
      if (!response.data.success) {
        throw new Error("Yazarlar ve adminler alınamadı.");
      }
      return response.data;
    } catch (error) {
      const errMessage = error.message || "Yazarlar ve adminler alınamadı.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Handle role update success
const handleRoleUpdateFulfilled = (state, action) => {
  if (action.payload.success && action.payload.data) {
    const user = action.payload.data;
    logInfo("✅ Rol Güncelleme", `${user.userName} rolü güncellendi`);
  }
  state.isLoading = false;
  state.isSuccess = true;
};

// Tüm kullanıcıları getirme thunk'ı
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/user", { withCredentials: true });
      if (!response.data.success) {
        throw new Error("Kullanıcılar alınamadı.");
      }
      return response.data;
    } catch (error) {
      const errMessage = error.message || "Kullanıcılar alınamadı.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Kullanıcı listesini getirme işlemi başarılı olduğunda
const handleFetchUsersFulfilled = (state, action) => {
  state.userList = action.payload.data;
  state.isLoading = false;
  state.isSuccess = true;
  logInfo("✅ Kullanıcılar", `${action.payload.data.length} kullanıcı alındı`);
};

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
    teamMembers: [],
    isTeamLoading: false,
    isTeamSuccess: false,
    isTeamError: false,
    teamErrorMessage: "",
    userList: [], // Tüm kullanıcılar listesi
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
      // fetchUser
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
      // Fetch Team Members (authors and admins)
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isTeamLoading = true;
        state.isTeamError = false;
        state.teamErrorMessage = "";
      })
      .addCase(fetchTeamMembers.fulfilled, handleFetchTeamMembersFulfilled)
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamError = true;
        state.teamErrorMessage =
          action.payload?.message || "Yazarlar ve adminler alınamadı.";
      })
      // updateUserRole
      .addCase(updateUserRole.pending, handlePending)
      .addCase(updateUserRole.fulfilled, handleRoleUpdateFulfilled)
      .addCase(updateUserRole.rejected, (state, action) =>
        handleRejected(state, action, "Kullanıcı rolü güncellenemedi.")
      )
      // deleteUser
      .addCase(deleteUser.pending, handlePending)
      .addCase(deleteUser.fulfilled, handleDeleteUserFulfilled)
      .addCase(deleteUser.rejected, (state, action) =>
        handleRejected(state, action, "Kullanıcı silinemedi.")
      )
      // fetchUsers
      .addCase(fetchUsers.pending, handlePending)
      .addCase(fetchUsers.fulfilled, handleFetchUsersFulfilled)
      .addCase(fetchUsers.rejected, (state, action) =>
        handleRejected(state, action, "Kullanıcılar getirilemedi.")
      );
  },
});

export const { clearState, clearUserState } = userSlice.actions;
export default userSlice.reducer;

// Selectors for easy access to team members
export const selectTeamMembers = (state) => state.user.teamMembers;
export const selectIsTeamLoading = (state) => state.user.isTeamLoading;
export const selectIsTeamError = (state) => state.user.isTeamError;
