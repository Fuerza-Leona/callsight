'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiURL } from '@/constants'
import { SpecificCall } from '@/interfaces/specificCall'
import { Conversation } from '@/interfaces/conversation'

// Define an interface that matches the API response structure
interface ApiResponse {
  conversation: Conversation[];
  summary: SpecificCall['summary'];
  messages: SpecificCall['messages'];
  participants: SpecificCall['participants'];
}

export const useSpecificCall = () => {
  const [data, setData] = useState<SpecificCall | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getSpecificCall = async (call_id: string) => {
    console.log("Fetching call with call_id:", call_id)
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get<ApiResponse>(`${apiURL}/conversations/call/${call_id}`)
      console.log("Response summary:", response.data)

      // manually unwrap conversation[0]
      const raw = response.data
      const cleaned: SpecificCall = {
        ...raw,
        conversation: raw.conversation[0], 
      }

      setData(cleaned)
    } catch (err: unknown) {
      console.error("Message fetch error:", err)
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail || "Could not find info related to this call id. Please try again."
        setError(message)
      } else {
        setError("An unexpected error occurred.")
      }
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return { getSpecificCall, data, loading, error }
}