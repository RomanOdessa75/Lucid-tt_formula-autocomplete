import React from "react";
import { AutocompleteItem } from "@/types";

interface AutocompleteProps {
  suggestions: AutocompleteItem[];
  onSelect: (item: AutocompleteItem) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  onSelect,
}) => {
  return (
    <ul className="border rounded-md mt-2 max-h-60 overflow-y-auto">
      {suggestions.length === 0 ? (
        <li className="p-2 text-gray-500">No results found</li>
      ) : (
        suggestions.map((item) => (
          <li
            key={item.id}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelect(item)}
          >
            {item.name} - {item.category}
          </li>
        ))
      )}
    </ul>
  );
};

export default Autocomplete;
