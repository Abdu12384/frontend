
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   isAuthenticated: false,
//   user: null,
//   role: null, 
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       const { user, role } = action.payload; 
//       state.isAuthenticated = true;
//       state.user = user;
//       state.role = role; 
//       console.log(user,role);
      
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.role = null; 
//    },
   
// },
// });


// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const userInitialState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    userLoginSuccess: (state, action) => {
      const { user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      console.log('User logged in:', user);
    },
    userLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { userLoginSuccess, userLogout } = userSlice.actions;
export default userSlice.reducer;
