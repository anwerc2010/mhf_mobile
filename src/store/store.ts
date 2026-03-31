import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import languageReducer from "./slices/languageSlice";
import themeReducer from "./slices/themeSlice";
import legalReducer from "./slices/legalSlice";
import { authReducer, authApi } from "@psi/shared-api";
import { listenerMiddleware } from "./listenerMiddleware";

// Type assertion for authApi to access RTK Query properties
const authApiTyped = authApi as any;

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    language: languageReducer,
    theme: themeReducer,
    legal: legalReducer,
    [authApiTyped.reducerPath]: authApiTyped.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(authApiTyped.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
