import { ChatInterface } from "../../components/chat/chat-interface"
import { personalities } from "../../../lib/personalities"
import { notFound } from "next/navigation"

interface ChatPageProps {
  params: {
    personality: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const personality = personalities.find((p) => p.id === params.personality)

  if (!personality) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatInterface personality={personality} />
    </div>
  )
}
