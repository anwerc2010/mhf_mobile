import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppLanguage, syncLanguageWithStore } from "../../i18n";

export type Language = AppLanguage;

interface LanguageState {
  currentLanguage: Language;
}

const initialState: LanguageState = {
  currentLanguage: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      syncLanguageWithStore(action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
