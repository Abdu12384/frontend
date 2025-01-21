

// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import adminReducer from './slices/adminSlice';
import userReducer from './slices/authSlice'

// Admin persist configuration
const adminPersistConfig = {
  key: 'admin',
  storage,
};

// User persist configuration
const userPersistConfig = {
  key: 'user',
  storage,
};

// Create persisted reducers
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Combine reducers in the store
const store = configureStore({
  reducer: {
    admin: persistedAdminReducer,
    user: persistedUserReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
