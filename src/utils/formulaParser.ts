export const parseFormula = (formula: string[]): string => {
  const dummyValues: Record<string, number> = {
    price: 100,
    tax: 10,
    discount: 5,
  };
  try {
    const expression = formula
      .map((item) => dummyValues[item] || item)
      .join(" ");
    return eval(expression).toString();
  } catch {
    return "Invalid Formula";
  }
};
