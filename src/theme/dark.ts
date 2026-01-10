import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

export const darkTheme = {
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
    background: colors.darkBackground,
    backgroundSecondary: colors.darkBackgroundSecondary,
    backgroundTertiary: colors.darkBackgroundTertiary,
    surface: colors.darkSurface,
    surfaceSecondary: colors.darkSurfaceSecondary,
    
    // Text
    text: colors.darkText,
    textSecondary: colors.darkTextSecondary,
    textTertiary: colors.darkTextTertiary,
    textInverse: colors.darkTextInverse,
    
    // Borders
    border: colors.darkBorder,
    borderLight: colors.darkBorderLight,
    
    // Overlay
    overlay: colors.darkOverlay,
    
    // Status colors
    successBackground: colors.darkSuccessBackground,
    errorBackground: colors.darkErrorBackground,
    warningBackground: colors.darkWarningBackground,
    infoBackground: colors.darkInfoBackground,
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
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export type DarkTheme = typeof darkTheme;

