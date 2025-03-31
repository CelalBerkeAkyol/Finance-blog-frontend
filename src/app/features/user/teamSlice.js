import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api";
import { logInfo } from "../../../utils/logger";

// FetchTeamMembers fulfilled: Yazarlar ve adminleri state'e aktarır
const handleFetchTeamMembersFulfilled = (state, action) => {
  logInfo(
    "✅ Yazarlar ve Adminler",
    `${action.payload.data.length} kişi alındı`
  );
  state.teamMembers = action.payload.data;
  state.isLoading = false;
  state.isSuccess = true;
};

// Yazarlar ve adminleri getirme thunk'ı
export const fetchTeamMembers = createAsyncThunk(
  "team/fetchTeamMembers",
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

// Team Slice tanımı
const teamSlice = createSlice({
  name: "team",
  initialState: {
    teamMembers: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    clearTeamState: (state) => {
      logInfo("🧹 State", "Team state temizleniyor");
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Team Members (authors and admins)
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchTeamMembers.fulfilled, handleFetchTeamMembersFulfilled)
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Yazarlar ve adminler alınamadı.";
      });
  },
});

export const { clearTeamState } = teamSlice.actions;

// Selectors for easy access to team members
export const selectTeamMembers = (state) => state.team.teamMembers;
export const selectIsTeamLoading = (state) => state.team.isLoading;
export const selectIsTeamError = (state) => state.team.isError;

export default teamSlice.reducer;
