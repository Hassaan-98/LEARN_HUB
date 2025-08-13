import { PersonalityGrid } from "../components/chat/personality-grid"
import { SearchFilter } from "../components/chat/search-filter"


export default function PersonalitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Personality Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our diverse collection of AI personalities, each specialized in different domains and ready to
            assist you.
          </p>
        </div>

        <SearchFilter />
        <PersonalityGrid />
      </div>
    </div>
  )
}
