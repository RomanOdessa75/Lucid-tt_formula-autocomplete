import { AutocompleteItem } from "@/types";

export const evaluateFormula = (
  formula: string[],
  items: AutocompleteItem[]
) => {
  const valuesMap: Record<string, number> = items.reduce((acc, item) => {
    if (typeof item.value === "number") acc[item.name] = item.value;
    return acc;
  }, {} as Record<string, number>);
  const expression = formula
    .map((token) => (valuesMap[token] !== undefined ? valuesMap[token] : token))
    .join(" ");

  try {
    return new Function(`return ${expression}`)();
  } catch {
    return "Invalid Formula";
  }
};
