import { AutocompleteItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete";

export const useAutocomplete = (searchTerm: string) => {
  return useQuery<AutocompleteItem[]>({
    queryKey: ["autocomplete", searchTerm],
    queryFn: async () => {
      const { data } = await axios.get<AutocompleteItem[]>(API_URL);
      return data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    staleTime: 5000,
  });
};
