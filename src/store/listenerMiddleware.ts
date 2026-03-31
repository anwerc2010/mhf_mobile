import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { loginSuccess, logout, setAuth, clearAuth } from "@psi/shared-api";
import { storageService } from "../services/storageService";
import type { RootState } from "./store";

export const listenerMiddleware = createListenerMiddleware();

// Persist auth to AsyncStorage whenever the user successfully logs in
listenerMiddleware.startListening({
  matcher: isAnyOf(loginSuccess, setAuth),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { token, refreshToken, expiryTimestamp, user } = state.auth as any;
    if (token) {
      await storageService.saveAuthSession({
        token,
        refreshToken: refreshToken ?? null,
        expiryTimestamp: expiryTimestamp ?? null,
        user: user ?? null,
      });
    }
  },
});

// Clear AsyncStorage whenever the user logs out or auth is cleared
listenerMiddleware.startListening({
  matcher: isAnyOf(logout, clearAuth),
  effect: async () => {
    await storageService.clearAuthSession();
  },
});
