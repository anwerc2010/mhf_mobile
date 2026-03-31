import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  TOKEN: "@auth/token",
  REFRESH_TOKEN: "@auth/refresh_token",
  EXPIRY_TIMESTAMP: "@auth/expiry_timestamp",
  USER: "@auth/user",
} as const;

export interface AuthSession {
  token: string;
  refreshToken: string | null;
  expiryTimestamp: number | null;
  user: any | null;
}

const storageService = {
  async saveAuthSession(session: AuthSession): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(KEYS.TOKEN, session.token),
      AsyncStorage.setItem(KEYS.REFRESH_TOKEN, session.refreshToken ?? ""),
      AsyncStorage.setItem(
        KEYS.EXPIRY_TIMESTAMP,
        session.expiryTimestamp != null ? String(session.expiryTimestamp) : "",
      ),
      AsyncStorage.setItem(
        KEYS.USER,
        session.user != null ? JSON.stringify(session.user) : "",
      ),
    ]);
  },

  async getAuthSession(): Promise<AuthSession | null> {
    const [token, refreshToken, expiryRaw, userRaw] = await Promise.all([
      AsyncStorage.getItem(KEYS.TOKEN),
      AsyncStorage.getItem(KEYS.REFRESH_TOKEN),
      AsyncStorage.getItem(KEYS.EXPIRY_TIMESTAMP),
      AsyncStorage.getItem(KEYS.USER),
    ]);
    if (!token) return null;
    return {
      token,
      refreshToken: refreshToken || null,
      expiryTimestamp: expiryRaw ? Number(expiryRaw) : null,
      user: userRaw ? JSON.parse(userRaw) : null,
    };
  },

  async clearAuthSession(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(KEYS.TOKEN),
      AsyncStorage.removeItem(KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(KEYS.EXPIRY_TIMESTAMP),
      AsyncStorage.removeItem(KEYS.USER),
    ]);
  },
};

export { storageService };
