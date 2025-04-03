'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiURL } from '@/constants'
import { Summary } from '@/interfaces/summary'

export const useSummary = () => {
  const [data, setData] = useState<Summary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getSummary = async (call_id: string) => {
    console.log("Fetching summary for call_id:", call_id); // DEBUG
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get<{ summary: Summary[] }>(
        `${apiURL}/conversations/call/${call_id}/summary`
      );
      console.log("Response summary:", response.data); // DEBUG
      setData(response.data.summary);
    } catch (err: any) {
      console.error("Message fetch error:", err); // DEBUG
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

  return { getSummary, data, loading, error }
}