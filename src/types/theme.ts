import { darkTheme } from '../theme/dark';
import { lightTheme } from '../theme/light';

// Theme Types
export type DarkTheme = typeof darkTheme;
export type LightTheme = typeof lightTheme;
export type Theme = LightTheme | DarkTheme;
export type ThemeMode = 'light' | 'dark';

