"use client"

import { create } from "zustand"

interface SearchFilterState {
  searchTerm: string
  selectedExpertise: string[]
  setSearchTerm: (term: string) => void
  setSelectedExpertise: (expertise: string[]) => void
}

export const useSearchFilter = create<SearchFilterState>((set) => ({
  searchTerm: "",
  selectedExpertise: [],
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedExpertise: (expertise) => set({ selectedExpertise: expertise }),
}))
