import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Initial user state
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // Set user data on login
    },
    logout: (state) => {
      state.user = null; // Clear user data on logout
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
