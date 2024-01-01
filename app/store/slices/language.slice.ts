import { StateCreator } from "zustand";

type Language = "en" | "id";

export type LanguageSlice = {
  language: Language;
  setLanguage: (value: Language) => void;
};

export const createLanguageSlice: StateCreator<
  LanguageSlice,
  [],
  [],
  LanguageSlice
> = (set) => ({
  language: "en",
  setLanguage: (language) => set({ language }),
});
