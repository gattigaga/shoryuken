import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LanguageSlice, createLanguageSlice } from "./slices/language.slice";

export const useStore = create<LanguageSlice>()(
  persist(
    (...a) => ({
      ...createLanguageSlice(...a),
    }),
    {
      name: "main-storage",
    }
  )
);
