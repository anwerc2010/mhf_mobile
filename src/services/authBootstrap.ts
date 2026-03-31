import { AppDispatch } from "../store/store";
import { loginSuccess, logout, sessionRestored } from "@psi/shared-api";
import { storageService } from "./storageService";
import { getApiBaseUrl } from "@psi/shared-api";

/**
 * Bootstraps authentication on app startup:
 * 1. Read persisted session from AsyncStorage
 * 2. If valid token → restore session immediately
 * 3. If token expired but refresh token present → call refresh API
 * 4. Otherwise → dispatch logout to clear state and show login
 */
export async function bootstrapAuth(dispatch: AppDispatch): Promise<void> {
  try {
    const session = await storageService.getAuthSession();

    if (!session?.token) {
      dispatch(sessionRestored());
      return;
    }

    const now = Date.now();
    const isTokenValid =
      session.expiryTimestamp != null && session.expiryTimestamp > now;

    if (isTokenValid) {
      dispatch(
        loginSuccess({
          token: session.token,
          refreshToken: session.refreshToken,
          expiryTimestamp: session.expiryTimestamp,
          user: session.user,
        }),
      );
      return;
    }

    if (session.refreshToken) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/customer/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: session.refreshToken }),
        });

        if (response.ok) {
          const data: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            refresh_expires_in?: number;
          } = await response.json();

          dispatch(
            loginSuccess({
              token: data.access_token,
              refreshToken: data.refresh_token,
              expiryTimestamp: Date.now() + data.expires_in * 1000,
              user: session.user,
            }),
          );
          return;
        }
      } catch {
        // Refresh network error — fall through to logout
      }
    }

    // Token expired and refresh failed or unavailable
    await storageService.clearAuthSession();
    dispatch(logout());
  } catch {
    // Storage read error — cannot determine session state
    dispatch(sessionRestored());
  }
}
