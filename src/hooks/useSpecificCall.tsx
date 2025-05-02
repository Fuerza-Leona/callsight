'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { SpecificCall } from '@/interfaces/specificCall';
import { Conversation } from '@/interfaces/conversation';

// Define an interface that matches the API response structure
interface ApiResponse {
  conversation: Conversation[];
  summary: SpecificCall['summary'];
  messages: SpecificCall['messages'];
  participants: SpecificCall['participants'];
}

export const useSpecificCall = () => {
  const [data, setData] = useState<SpecificCall | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getSpecificCall = async (call_id: string) => {
    console.log('Fetching call with call_id:', call_id);
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse>(
        `/conversations/call/${call_id}`
      );
      console.log('Response summary:', response.data);

      // manually unwrap conversation[0]
      const raw = response.data;
      const cleaned: SpecificCall = {
        ...raw,
        conversation: raw.conversation[0],
      };

      setData(cleaned);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getSpecificCall, data, loading, error };
};
