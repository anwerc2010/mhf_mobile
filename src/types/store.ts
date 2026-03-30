// Root State - This type should be imported from store/store.ts
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// Note: RootState and AppDispatch are exported from store/store.ts to avoid circular dependencies

// Theme State
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  mode: ThemeMode;
  currentTheme: "light" | "dark";
}

// Language State
export type Language = "en" | "ar" | "ur" | "tel";

export interface LanguageState {
  currentLanguage: Language;
}
