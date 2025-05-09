import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api";
import { logInfo, logError, logWarning } from "../../../utils/logger";

// Tüm kullanıcıları getirme thunk'ı
export const fetchUsers = createAsyncThunk(
  "userList/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/user", {
        withCredentials: true,
        signal: thunkAPI.signal,
      });

      if (!response.data.success) {
        throw new Error("Kullanıcılar alınamadı. API false dönüyor.");
      }

      return response.data;
    } catch (error) {
      logError("userListSlice", "fetchUsers hatası", error);
      const errMessage = error.message || "Kullanıcılar alınamadı.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Kullanıcı rolü güncelleme thunk'ı
export const updateUserRole = createAsyncThunk(
  "userList/updateUserRole",
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

// Kullanıcı aktivasyon durumunu değiştirme thunk'ı
export const toggleUserActivation = createAsyncThunk(
  "userList/toggleUserActivation",
  async ({ userId, isActive }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/user/${userId}/toggle-activation`,
        { isActive },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      const errMessage = error.message || "Kullanıcı durumu güncellenemedi.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Kullanıcı silme thunk'ı (soft delete - deaktif etme)
export const deleteUser = createAsyncThunk(
  "userList/deleteUser",
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
      const errMessage = error.message || "Kullanıcı deaktif edilemedi.";
      const errCode = error.code || "UNKNOWN_ERROR";
      return thunkAPI.rejectWithValue({ message: errMessage, code: errCode });
    }
  }
);

// Kullanıcı kalıcı silme thunk'ı (hard delete - veritabanından silme)
export const hardDeleteUser = createAsyncThunk(
  "userList/hardDeleteUser",
  async ({ userId }, thunkAPI) => {
    try {
      // Kullanıcı ID'si sağlanmalı
      if (!userId) {
        throw new Error("Kullanıcı ID'si gereklidir");
      }

      const response = await axios.delete(`/user/${userId}/hard`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const errMessage = error.message || "Kullanıcı kalıcı olarak silinemedi.";
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

// Handle activation toggle success
const handleActivationToggleFulfilled = (state, action) => {
  if (action.payload.success && action.payload.data) {
    const user = action.payload.data;
    const status = user.isActive ? "aktifleştirildi" : "deaktif edildi";
    logInfo(
      "✅ Aktivasyon Güncelleme",
      `${user.userName} kullanıcısı ${status}`
    );
  }
  state.isLoading = false;
  state.isSuccess = true;
};

// Handle user deletion success
const handleDeleteUserFulfilled = (state, action) => {
  if (action.payload.data && action.payload.data.isCurrentUser) {
    logInfo(
      "✅ Deaktif Etme",
      "Admin kendi hesabını deaktif etti veya giriş yapmış kullanıcı deaktif edildi - çıkış yapılıyor"
    );
  } else {
    logInfo(
      "✅ Deaktif Etme",
      `${action.payload.data?.userName || "Kullanıcı"} deaktif edildi`
    );
  }
  state.isLoading = false;
  state.isSuccess = true;
};

// Handle hard deletion success
const handleHardDeleteUserFulfilled = (state, action) => {
  logInfo(
    "✅ Kalıcı Silme",
    `${
      action.payload.data?.userName || "Kullanıcı"
    } veritabanından tamamen silindi`
  );
  state.isLoading = false;
  state.isSuccess = true;
};

// UserList Slice tanımı
const userListSlice = createSlice({
  name: "userList",
  initialState: {
    userList: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    errorCode: "",
    fetched: false, // yeni veri yüklendi mi kontrolü
  },
  reducers: {
    clearUserListState: (state) => {
      logInfo("🧹 State", "UserList state temizleniyor");
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
      state.errorCode = "";
    },
    // Kullanıcı ID'sine göre userList'ten bir kullanıcıyı kaldırmak için reducer
    removeUser: (state, action) => {
      const userId = action.payload;
      if (state.userList && state.userList.length > 0) {
        state.userList = state.userList.filter((user) => user._id !== userId);
        logInfo(
          "✅ Kullanıcı Silindi",
          `${userId} ID'li kullanıcı listeden kaldırıldı`
        );
      }
    },
    // Kullanıcı ID'sine göre userList'teki bir kullanıcıyı güncellemek için reducer
    updateUserInList: (state, action) => {
      const { userId, updates } = action.payload;
      if (state.userList && state.userList.length > 0) {
        state.userList = state.userList.map((user) =>
          user._id === userId ? { ...user, ...updates } : user
        );
        logInfo(
          "✅ Kullanıcı Güncellendi",
          `${userId} ID'li kullanıcı listede güncellendi`
        );
      }
    },
    // Manuel yenilemeyi başlatmak için reducer - isLoading durumunu true yapar
    startManualRefresh: (state) => {
      logInfo(
        "🔄 Manuel Yenileme",
        "Kullanıcı listesi manuel olarak yenileniyor"
      );
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers - Tüm kullanıcıları getirme
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        logInfo(
          "userListSlice",
          "Kullanıcı listesi başarıyla alındı, state güncelleniyor",
          action.payload
        );

        if (!action.payload || !action.payload.data) {
          logWarning(
            "userListSlice",
            "API'den kullanıcı verisi gelmedi veya boş"
          );
          state.userList = [];
        } else {
          // Doğrudan API yanıtını state'e ata
          state.userList = Array.isArray(action.payload.data)
            ? action.payload.data
            : [];

          if (!Array.isArray(action.payload.data)) {
            logWarning(
              "userListSlice",
              "API'den gelen kullanıcı verisi dizi değil",
              action.payload.data
            );
          }

          logInfo(
            "✅ Kullanıcılar",
            `${state.userList.length} kullanıcı alındı`
          );
        }

        // Loading ve error state'lerini güncelle
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.errorMessage = "";
        state.fetched = true; // veri yükleme işlemi tamamlandı
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Kullanıcılar getirilemedi.";
        state.errorCode = action.payload?.code || "UNKNOWN_ERROR";
      })
      // updateUserRole
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUserRole.fulfilled, handleRoleUpdateFulfilled)
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Kullanıcı rolü güncellenemedi.";
        state.errorCode = action.payload?.code || "UNKNOWN_ERROR";
      })
      // toggleUserActivation
      .addCase(toggleUserActivation.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(toggleUserActivation.fulfilled, handleActivationToggleFulfilled)
      .addCase(toggleUserActivation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Kullanıcı durumu güncellenemedi.";
        state.errorCode = action.payload?.code || "UNKNOWN_ERROR";
      })
      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteUser.fulfilled, handleDeleteUserFulfilled)
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Kullanıcı deaktif edilemedi.";
        state.errorCode = action.payload?.code || "UNKNOWN_ERROR";
      })
      // hardDeleteUser
      .addCase(hardDeleteUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(hardDeleteUser.fulfilled, handleHardDeleteUserFulfilled)
      .addCase(hardDeleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Kullanıcı kalıcı olarak silinemedi.";
        state.errorCode = action.payload?.code || "UNKNOWN_ERROR";
      });
  },
});

export const {
  clearUserListState,
  removeUser,
  updateUserInList,
  startManualRefresh,
} = userListSlice.actions;

// Selectors
export const selectUserList = (state) => state.userList.userList;
export const selectIsUserListLoading = (state) => state.userList.isLoading;
export const selectIsUserListError = (state) => state.userList.isError;
export const selectUserListErrorMessage = (state) =>
  state.userList.errorMessage;
export const selectIsUserListFetched = (state) => state.userList.fetched;

export default userListSlice.reducer;
