"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatHistory {
  [personalityId: string]: Message[]
}

interface ChatHistoryState {
  chatHistory: ChatHistory
  addMessage: (personalityId: string, message: Message) => void
  getMessages: (personalityId: string) => Message[]
  clearHistory: (personalityId: string) => void
  getAllHistories: () => ChatHistory
}

const useChatHistoryStore = create<ChatHistoryState>()(
  persist(
    (set, get) => ({
      chatHistory: {},

      addMessage: (personalityId: string, message: Message) => {
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [personalityId]: [
              ...(state.chatHistory[personalityId] || []),
              { ...message, timestamp: new Date(message.timestamp) },
            ],
          },
        }))
      },

      getMessages: (personalityId: string) => {
        return get().chatHistory[personalityId] || []
      },

      clearHistory: (personalityId: string) => {
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [personalityId]: [],
          },
        }))
      },

      getAllHistories: () => {
        return get().chatHistory
      },
    }),
    {
      name: "chat-history",
      partialize: (state) => ({ chatHistory: state.chatHistory }),
    },
  ),
)

export function useChatHistory(personalityId: string) {
  const { addMessage: addMessageToStore, getMessages, clearHistory: clearHistoryStore } = useChatHistoryStore()

  const messages = getMessages(personalityId)

  const addMessage = (message: Message) => {
    addMessageToStore(personalityId, message)
  }

  const clearHistory = () => {
    clearHistoryStore(personalityId)
  }

  return {
    messages,
    addMessage,
    clearHistory,
  }
}
