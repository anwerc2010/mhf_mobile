import { lightTheme, LightTheme } from './light';
import { darkTheme, DarkTheme } from './dark';

export type Theme = LightTheme | DarkTheme;
export type ThemeMode = 'light' | 'dark';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (mode: ThemeMode): Theme => {
  return themes[mode];
};

// Export theme types
export type { LightTheme, DarkTheme };

