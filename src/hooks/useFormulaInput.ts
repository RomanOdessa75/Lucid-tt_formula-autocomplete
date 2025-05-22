"use client";

import { useState } from "react";
import { useFormulaStore, useAutocomplete } from "@/hooks";

const OPERATORS = ["+", "-", "*", "/", "^", "(", ")"];

export const useFormulaInput = () => {
  const { formula, setFormula } = useFormulaStore();
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const { data: suggestions = [], isLoading } = useAutocomplete(inputValue);

  const handleSelect = (value: string) => {
    setFormula([...formula, value]);
    setInputValue("");
    setOpen(false);
  };

  const handleChange = (values: string[]) => {
    setFormula(values);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && OPERATORS.includes(inputValue.trim())) {
      handleSelect(inputValue.trim());
    }
  };

  return {
    formula,
    inputValue,
    setInputValue,
    open,
    setOpen,
    handleSelect,
    handleChange,
    handleKeyDown,
    suggestions,
    isLoading,
  };
};
