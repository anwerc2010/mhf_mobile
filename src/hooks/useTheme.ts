import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hook';
import { getTheme, Theme } from '../theme';
import { setCurrentTheme } from '../store/slices/themeSlice';

export const useTheme = (): Theme => {
  const dispatch = useAppDispatch();
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  // Determine the actual theme to use
  const actualTheme = useMemo(() => {
    if (themeMode === 'system') {
      const systemTheme = systemColorScheme === 'dark' ? 'dark' : 'light';
      // Sync with Redux if system theme changed
      if (systemTheme !== currentTheme) {
        dispatch(setCurrentTheme(systemTheme));
      }
      return systemTheme;
    }
    return currentTheme;
  }, [themeMode, systemColorScheme, currentTheme, dispatch]);

  return getTheme(actualTheme);
};

export default useTheme;

