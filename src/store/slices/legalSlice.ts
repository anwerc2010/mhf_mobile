import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LegalState {
  termsRequired: boolean;
  serverTermsVersion: string | null;
}

const initialState: LegalState = {
  termsRequired: false,
  serverTermsVersion: null,
};

const legalSlice = createSlice({
  name: "legal",
  initialState,
  reducers: {
    setLegalTermsRequired: (
      state,
      action: PayloadAction<{ required: boolean; serverVersion?: string }>,
    ) => {
      state.termsRequired = action.payload.required;
      if (action.payload.serverVersion !== undefined) {
        state.serverTermsVersion = action.payload.serverVersion;
      }
    },
    clearLegalState: (state) => {
      state.termsRequired = false;
      state.serverTermsVersion = null;
    },
  },
});

export const { setLegalTermsRequired, clearLegalState } = legalSlice.actions;
export default legalSlice.reducer;
