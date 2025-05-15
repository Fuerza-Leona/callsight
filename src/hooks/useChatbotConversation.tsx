'use client';

import { useState } from 'react';
import api from '@/utils/api';

interface ApiResponse {
  response: string;
}

export const useChatbotConversation = () => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postChatbotConversation = async (
    conversation_id: string,
    prompt: string
  ) => {
    console.log('Sending prompt to OpenAI API:', prompt);
    setLoading(true);
    setError(null);

    try {
      //Request with Auth header
      const response = await api.post<ApiResponse>(
        `/chatbot/continue/${conversation_id}`,
        { prompt }
      );

      console.log('Chatbot response:', response.data);
      setData(response.data.response);
      return response.data.response;
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postChatbotConversation, data, loading, error };
};
