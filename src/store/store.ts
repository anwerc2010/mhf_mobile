import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import languageReducer from './slices/languageSlice';
import themeReducer from './slices/themeSlice';
import { authReducer, authApi } from '@psi/shared-api';

// Type assertion for authApi to access RTK Query properties
const authApiTyped = authApi as any;

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: authReducer,
        language: languageReducer,
        theme: themeReducer,
        [authApiTyped.reducerPath]: authApiTyped.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApiTyped.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;