import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBWxJXgKUbhnBu3A3n7AIONvabH_7vHkg0")

// Mock responses for when API key is not configured (updated for actual personalities)
const getMockResponse = (personalityId: string, message: string) => {
  const mockResponses = {
    "legal-advisor":
      "I understand you're seeking legal guidance. While I'd love to provide detailed legal advice, I'm currently running in demo mode without API access. To get real legal insights, please configure the Gemini API key. In the meantime, I recommend consulting with a qualified attorney for your specific legal matters.",
    "medical-consultant":
      "Thank you for your health-related question! I'd love to provide comprehensive medical guidance, but I'm currently in demo mode. To get evidence-based health insights, please set up the Gemini API key. Remember to always consult healthcare professionals for medical advice.",
    "education-tutor":
      "What an excellent learning question! I'm excited to help you understand complex concepts, but I'm currently running without API access. To unlock personalized tutoring and detailed explanations, please configure the Gemini API key. Keep that curiosity alive!",
    "tech-developer":
      "Great technical question! I'd love to dive deep into the code and architecture with you, but I'm currently in demo mode. To get comprehensive development insights and code examples, please set up the Gemini API key. Happy coding!",
    therapist:
      "Thank you for sharing with me. I'm here to listen and support you, though I'm currently in demo mode without full API access. For personalized therapeutic guidance, please set up the Gemini API key. Remember, your feelings are valid and seeking support is a sign of strength.",
    "business-consultant":
      "Excellent business question! I'm eager to help you strategize and grow, but I'm currently running in demo mode. To unlock detailed business insights and strategic guidance, please set up the Gemini API key. Your entrepreneurial spirit is already a great asset!",
  }

  return (
    mockResponses[personalityId as keyof typeof mockResponses] ||
    "Thanks for your message! I'm currently in demo mode without API access. To get personalized responses, please configure the Gemini API key in your environment variables."
  )
}

export async function POST(request: NextRequest) {
  try {
    const { message, personalityId, systemPrompt } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBWxJXgKUbhnBu3A3n7AIONvabH_7vHkg0"

    if (!apiKey || apiKey === "") {
      return NextResponse.json({
        response: getMockResponse(personalityId, message),
        isDemo: true,
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create the full prompt with personality context
    const fullPrompt = `${systemPrompt}

User message: ${message}

Please respond as the AI personality described in the system prompt above. Keep your response helpful, accurate, and in character.`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const aiResponse = response.text()

    return NextResponse.json({
      response: aiResponse,
    })
  } catch (error) {
    console.error("Error in chat API:", error)

    if (error instanceof Error) {
      if (error.message.includes("API_KEY")) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your Gemini API configuration." },
          { status: 401 },
        )
      }
      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "API quota exceeded. Please try again later." }, { status: 429 })
      }
    }

    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
