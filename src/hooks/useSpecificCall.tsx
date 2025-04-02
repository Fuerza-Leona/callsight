'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiURL } from '@/app/constants'
import { Messages } from '@/interfaces/messages'

export const useSpecificCall = () => {
  const [data, setData] = useState<Messages[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getSpecificCall = async (call_id: string) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get<{ messages: Messages[] }>(
        `${apiURL}/conversations/call/${call_id}/summary`
      );
      setData(response.data.messages);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail || "Could not find info related to this call id. Please try again.";
        setError(message);
      } else {
        setError("An unexpected error occurred.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getSpecificCall, data, loading, error }
}