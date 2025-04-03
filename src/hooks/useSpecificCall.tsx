'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiURL } from '@/app/constants'
import { SpecificCall } from '@/interfaces/specificCall'

export const useSpecificCall = () => {
  const [data, setData] = useState<SpecificCall[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getSpecificCall = async (call_id: string) => {
    console.log("Fetching call with call_id:", call_id); // DEBUG
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get<{ specificCall: SpecificCall[] }>(
        `${apiURL}/conversations/call/${call_id}`
      );
      console.log("Response summary:", response.data); // DEBUG
      setData(response.data.specificCall);
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

  return { getSpecificCall, data, loading, error }
}