import { createSlice } from "@reduxjs/toolkit";

// Initialize user from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null, // Use localStorage for initial state
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save to localStorage
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Remove from localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null, // Initial user state
//   },
//   reducers: {
//     login: (state, action) => {
//       state.user = action.payload; // Set user data on login
//     },
//     logout: (state) => {
//       state.user = null; // Clear user data on logout
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;

// export default authSlice.reducer;
