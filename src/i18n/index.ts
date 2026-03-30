import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import ur from "../locales/ur.json";
import tel from "../locales/tel.json";

export type AppLanguage = "en" | "ar" | "ur" | "tel";

// Get initial language from storage or default to 'en'
const getInitialLanguage = (): AppLanguage => {
  // You can add AsyncStorage here to persist language preference
  // For now, defaulting to 'en'
  return "en";
};

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
    ur: {
      translation: ur,
    },
    tel: {
      translation: tel,
    },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
});

// Sync i18n with Redux store language
export const syncLanguageWithStore = (language: AppLanguage) => {
  i18n.changeLanguage(language);
};

export default i18n;
