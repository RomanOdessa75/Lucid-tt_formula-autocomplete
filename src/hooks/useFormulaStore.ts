import { create } from "zustand";

interface FormulaState {
  formula: string[];
  setFormula: (updater: string[] | ((prev: string[]) => string[])) => void;
}

export const useFormulaStore = create<FormulaState>((set) => ({
  formula: [],
  setFormula: (updater) =>
    set((state) => ({
      formula: typeof updater === "function" ? updater(state.formula) : updater,
    })),
}));
