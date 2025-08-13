"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Search, X } from "lucide-react"
import { useSearchFilter } from "../../../hooks/use-search-filter"
import { personalities } from "../../../lib/personalities"

export function SearchFilter() {
  const { searchTerm, selectedExpertise, setSearchTerm, setSelectedExpertise } = useSearchFilter()
  const [showAllExpertise, setShowAllExpertise] = useState(false)

  // Get all unique expertise areas
  const allExpertise = Array.from(new Set(personalities.flatMap((p) => p.expertise))).sort()

  const displayedExpertise = showAllExpertise ? allExpertise : allExpertise.slice(0, 8)

  const toggleExpertise = (expertise: string) => {
    if (selectedExpertise.includes(expertise)) {
      setSelectedExpertise(selectedExpertise.filter((e) => e !== expertise))
    } else {
      setSelectedExpertise([...selectedExpertise, expertise])
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedExpertise([])
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search personalities, skills, or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-input border-input focus:ring-ring"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Expertise Filter */}
      <div className="text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {displayedExpertise.map((expertise) => (
            <Badge
              key={expertise}
              variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => toggleExpertise(expertise)}
            >
              {expertise}
              {selectedExpertise.includes(expertise) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {allExpertise.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllExpertise(!showAllExpertise)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showAllExpertise ? "Show Less" : `Show All (${allExpertise.length})`}
            </Button>
          )}

          {(searchTerm || selectedExpertise.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
