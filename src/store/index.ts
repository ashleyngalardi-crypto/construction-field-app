import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { webCompatibleStorage } from './webStorage';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import offlineReducer from './slices/offlineSlice';
import webNavigationReducer from './slices/webNavigationSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: webCompatibleStorage,
  whitelist: ['auth', 'admin', 'offline'], // Persist auth, admin data, and offline queue
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    admin: adminReducer,
    offline: offlineReducer,
    webNavigation: webNavigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
