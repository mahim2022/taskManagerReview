import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";


// Async actions
export const loginUser = createAsyncThunk("auth/loginUser", async (data) => {
  const response = await API.post("/auth/login", data);
  localStorage.setItem("token", response.data.token);
  return jwtDecode(response.data.token);
});

export const registerUser = createAsyncThunk("auth/registerUser", async (data) => {
  await API.post("/auth/register", data);
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
