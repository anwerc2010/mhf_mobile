/**
 * Application Configuration
 *
 * Centralized configuration for the entire application.
 * This file contains environment-specific settings, API endpoints,
 * feature flags, and other app-wide constants.
 */

// Environment Detection
export type Environment = "development" | "staging" | "production";

/**
 * Get current environment
 * Defaults to 'development' if not set
 */
const getEnvironment = (): Environment => {
  // In React Native, you can use __DEV__ to detect development mode
  // For production builds, you might want to use environment variables
  // or a library like react-native-config

  if (__DEV__) {
    return "development";
  }

  // You can also check for environment variables
  // For example, using react-native-config:
  // return (process.env.ENV as Environment) || 'development';

  return "production";
};

export const ENV: Environment = getEnvironment();

/**
 * API Configuration
 */
export const API_CONFIG = {
  // Base API URL - change based on environment
  BASE_URL: __DEV__
    ? "http://13.127.77.119:8080/api" // Development API
    : "https://api.production.com/api", // Production API

  // API Timeouts
  TIMEOUT: 30000, // 30 seconds

  // API Version
  VERSION: "v1",

  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Request Headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

/**
 * App Information
 */
export const APP_CONFIG = {
  NAME: "Patrn",
  VERSION: "0.0.1",
  BUILD_NUMBER: "1",

  // App URLs
  SUPPORT_EMAIL: "support@patrn.com",
  PRIVACY_POLICY_URL: "https://patrn.com/privacy",
  TERMS_OF_SERVICE_URL: "https://patrn.com/terms",

  // App Store Links
  APP_STORE_URL: "https://apps.apple.com/app/patrn",
  PLAY_STORE_URL: "https://play.google.com/store/apps/details?id=com.patrn",

  // Organization contacts
  MHF_WEBSITE_URL: "https://mhfglobal.com/",
  MHF_WHATSAPP_NUMBER_E164: "918331960001",
  MHF_WHATSAPP_DISPLAY_NUMBER: "+91 8331960001",
  MHF_CC_EMAIL: "info@mhfglobal.com", // Update with the actual MHF email address
} as const;

/**
 * Feature Flags
 * Enable/disable features based on environment or configuration
 */
export const FEATURE_FLAGS = {
  // Development features
  ENABLE_LOGGING: __DEV__,
  ENABLE_DEBUG_MENU: __DEV__,
  ENABLE_REDUX_DEVTOOLS: __DEV__,

  // Feature toggles
  ENABLE_ANALYTICS: ENV === "production",
  ENABLE_CRASH_REPORTING: ENV === "production",
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_DARK_MODE: true,
  ENABLE_RTL_SUPPORT: true,

  // Experimental features
  ENABLE_NEW_UI: false,
  ENABLE_BETA_FEATURES: __DEV__,
} as const;

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  // Token storage keys
  TOKEN_STORAGE_KEY: "@patrn:auth_token",
  USER_STORAGE_KEY: "@patrn:user_data",
  REFRESH_TOKEN_STORAGE_KEY: "@patrn:refresh_token",

  // Token expiration
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before actual expiry

  // Session timeout
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours

  // Biometric authentication
  BIOMETRIC_ENABLED: true,
  BIOMETRIC_TIMEOUT: 30 * 1000, // 30 seconds
} as const;

/**
 * Network Configuration
 */
export const NETWORK_CONFIG = {
  // Network check intervals
  CHECK_INTERVAL: 5000, // 5 seconds

  // Offline queue
  MAX_OFFLINE_REQUESTS: 50,
  OFFLINE_QUEUE_STORAGE_KEY: "@patrn:offline_queue",

  // Request caching
  CACHE_ENABLED: true,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  // Debounce delays
  SEARCH_DEBOUNCE: 500, // milliseconds
  INPUT_DEBOUNCE: 300,
  SCROLL_DEBOUNCE: 150,

  // Animation durations
  ANIMATION_DURATION: 300,
  LONG_ANIMATION_DURATION: 500,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Image configuration
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5 MB

  // Toast/Alert durations
  TOAST_DURATION: 3000,
  ALERT_DURATION: 4000,
} as const;

/**
 * Validation Configuration
 */
export const VALIDATION_CONFIG = {
  // Email validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Password validation
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  PASSWORD_REQUIRE_UPPERCASE: false,
  PASSWORD_REQUIRE_LOWERCASE: false,
  PASSWORD_REQUIRE_NUMBER: false,
  PASSWORD_REQUIRE_SPECIAL: false,

  // Phone validation
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,

  // Username validation
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
} as const;

/**
 * Storage Configuration
 */
export const STORAGE_CONFIG = {
  // Storage keys
  THEME_STORAGE_KEY: "@patrn:theme",
  LANGUAGE_STORAGE_KEY: "@patrn:language",
  ONBOARDING_STORAGE_KEY: "@patrn:onboarding_completed",
  SETTINGS_STORAGE_KEY: "@patrn:settings",

  // Cache keys
  CACHE_PREFIX: "@patrn:cache:",
  CACHE_EXPIRY_PREFIX: "@patrn:cache_expiry:",
} as const;

/**
 * Error Configuration
 */
export const ERROR_CONFIG = {
  // Error messages
  DEFAULT_ERROR_MESSAGE: "An unexpected error occurred. Please try again.",
  NETWORK_ERROR_MESSAGE:
    "Network error. Please check your internet connection.",
  TIMEOUT_ERROR_MESSAGE: "Request timed out. Please try again.",

  // Error reporting
  ENABLE_ERROR_REPORTING: ENV === "production",
  ERROR_REPORTING_URL: "https://api.patrn.com/errors",

  // Retry configuration
  MAX_ERROR_RETRIES: 3,
} as const;

/**
 * Analytics Configuration
 */
export const ANALYTICS_CONFIG = {
  ENABLED: FEATURE_FLAGS.ENABLE_ANALYTICS,

  // Analytics providers
  GOOGLE_ANALYTICS_ID:
    ENV === "production" ? "GA-PRODUCTION-ID" : "GA-DEVELOPMENT-ID",
  FIREBASE_ANALYTICS_ENABLED: true,

  // Event tracking
  TRACK_SCREEN_VIEWS: true,
  TRACK_USER_ACTIONS: true,
  TRACK_ERRORS: true,
} as const;

/**
 * Development Configuration
 */
export const DEV_CONFIG = {
  // Mock API responses
  USE_MOCK_API: __DEV__ && false, // Set to true to use mock data

  // Logging
  LOG_LEVEL: __DEV__ ? "debug" : "error",
  LOG_NETWORK_REQUESTS: __DEV__,
  LOG_REDUX_ACTIONS: __DEV__,

  // Performance monitoring
  ENABLE_PERFORMANCE_MONITORING: __DEV__,
  SHOW_PERFORMANCE_OVERLAY: __DEV__ && false,
} as const;

/**
 * Export all configuration as a single object
 */
export const CONFIG = {
  ENV,
  API: API_CONFIG,
  APP: APP_CONFIG,
  FEATURES: FEATURE_FLAGS,
  AUTH: AUTH_CONFIG,
  NETWORK: NETWORK_CONFIG,
  UI: UI_CONFIG,
  VALIDATION: VALIDATION_CONFIG,
  STORAGE: STORAGE_CONFIG,
  ERROR: ERROR_CONFIG,
  ANALYTICS: ANALYTICS_CONFIG,
  DEV: DEV_CONFIG,
} as const;

/**
 * Helper function to check if running in development
 */
export const isDevelopment = (): boolean => ENV === "development";

/**
 * Helper function to check if running in production
 */
export const isProduction = (): boolean => ENV === "production";

/**
 * Helper function to get API URL with version
 */
export const getApiUrl = (endpoint: string = ""): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  const version = API_CONFIG.VERSION;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${version}/${cleanEndpoint}`
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
};

/**
 * Helper function to check if a feature is enabled
 */
export const isFeatureEnabled = (
  feature: keyof typeof FEATURE_FLAGS,
): boolean => {
  return FEATURE_FLAGS[feature];
};

export default CONFIG;
