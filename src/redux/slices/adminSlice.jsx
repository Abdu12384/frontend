import { createSlice } from '@reduxjs/toolkit';

const adminInitialState = {
  isAuthenticated: false,
  admin: null, 
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: adminInitialState,
  reducers: {
    adminLoginSuccess: (state, action) => {
      const { admin } = action.payload;
      state.isAuthenticated = true;
      state.admin = admin;
      console.log('Admin logged in:', admin);
    },
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
    },
  },
});

export const { adminLoginSuccess, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
