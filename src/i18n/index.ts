import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import ur from "../locales/ur.json";
import tel from "../locales/tel.json";
import hi from "../locales/hi.json";
import mr from "../locales/mr.json";
import ta from "../locales/ta.json";
import pa from "../locales/pa.json";
import kn from "../locales/kn.json";
import bn from "../locales/bn.json";
import gu from "../locales/gu.json";

export type AppLanguage = "en" | "ar" | "ur" | "tel" | "hi" | "mr" | "ta" | "pa" | "kn" | "bn" | "gu";

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
    en: { translation: en },
    ar: { translation: ar },
    ur: { translation: ur },
    tel: { translation: tel },
    hi: { translation: hi },
    mr: { translation: mr },
    ta: { translation: ta },
    pa: { translation: pa },
    kn: { translation: kn },
    bn: { translation: bn },
    gu: { translation: gu },
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
