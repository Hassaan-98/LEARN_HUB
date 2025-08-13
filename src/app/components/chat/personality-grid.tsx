"use client"

import { useMemo } from "react"
import { PersonalityCard } from "./personality-card"
import { personalities } from "../../../lib/personalities"
import { useSearchFilter } from "../../../hooks/use-search-filter"

export function PersonalityGrid() {
  const { searchTerm, selectedExpertise } = useSearchFilter()

  const filteredPersonalities = useMemo(() => {
    return personalities.filter((personality) => {
      const matchesSearch =
        personality.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personality.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personality.expertise.some((exp) => exp.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesExpertise =
        selectedExpertise.length === 0 || personality.expertise.some((exp) => selectedExpertise.includes(exp))

      return matchesSearch && matchesExpertise
    })
  }, [searchTerm, selectedExpertise])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPersonalities.map((personality) => (
        <PersonalityCard key={personality.id} personality={personality} />
      ))}
    </div>
  )
}
