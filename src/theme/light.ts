import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

export const lightTheme = {
  colors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    secondaryDark: colors.secondaryDark,
    secondaryLight: colors.secondaryLight,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    
    // Backgrounds
    background: colors.white,
    backgroundSecondary: colors.backgroundSecondary,
    backgroundTertiary: colors.backgroundTertiary,
    surface: colors.surface,
    surfaceSecondary: colors.surfaceSecondary,
    
    // Text
    text: colors.black,
    textSecondary: colors.grayDark,
    textTertiary: colors.gray,
    textInverse: colors.textInverse,
    
    // Borders
    border: colors.border,
    borderLight: colors.borderLight,
    
    // Overlay
    overlay: colors.overlay,
    
    // Status colors
    successBackground: colors.successBackground,
    errorBackground: colors.errorBackground,
    warningBackground: colors.warningBackground,
    infoBackground: colors.infoBackground,
  },
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export type LightTheme = typeof lightTheme;

