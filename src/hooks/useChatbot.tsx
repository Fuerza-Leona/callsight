'use client';

import { useState } from 'react';
import api from '@/utils/api';

interface ApiResponse {
  response: string;
  conversation_id: string;
}

export const useChatbot = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postChatbot = async (prompt: string): Promise<ApiResponse | null> => {
    console.log('Sending prompt to OpenAI API:', prompt);
    setLoading(true);
    setError(null);

    try {
      //Request with Auth header
      const response = await api.post<ApiResponse>('/chatbot/chat', { prompt });

      console.log('Chatbot response:', response.data);
      setData(response.data);
      return response.data;
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postChatbot, data, loading, error };
};
