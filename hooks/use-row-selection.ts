import { type Key } from "react";
import { create } from "zustand";

interface RowSelectionContext {
  key?: Key;
  setKey: (key?: Key) => void;
}

export const useRowSelection = create<RowSelectionContext>((set) => ({
  setKey: (key) => set((state) => ({ ...state, key })),
}));
