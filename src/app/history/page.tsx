import { ChatHistoryManager } from "../components/chat/chat-history-manager"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Chat History</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View and manage your conversations with different AI personalities.
          </p>
        </div>

        <ChatHistoryManager />
      </div>
    </div>
  )
}
