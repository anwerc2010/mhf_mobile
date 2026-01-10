import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  currentTheme: 'light' | 'dark';
}

// Get system theme
const getSystemTheme = (): 'light' | 'dark' => {
  // This will be set on app initialization
  return 'light';
};

const initialState: ThemeState = {
  mode: 'system',
  currentTheme: getSystemTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (action.payload !== 'system') {
        state.currentTheme = action.payload;
      }
    },
    setCurrentTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.currentTheme = action.payload;
    },
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      if (state.mode === 'system') {
        state.mode = state.currentTheme;
      }
    },
  },
});

export const { setThemeMode, setCurrentTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

