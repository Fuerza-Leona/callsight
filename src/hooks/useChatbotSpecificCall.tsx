'use client';

import { useState } from 'react';
import api from '@/utils/api';

interface ApiResponseWithTitle {
  response: string;
  id: string;
  title: string;
}

export const useChatbotSpecificCall = () => {
  const [data, setData] = useState<ApiResponseWithTitle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postChatbotSpecificCall = async (
    prompt: string,
    specific_conversation_id: string
  ): Promise<ApiResponseWithTitle | null> => {
    console.log('Sending prompt to OpenAI API:', prompt);
    setLoading(true);
    setError(null);

    try {
      // Send specific_conversation_id as query parameter instead of in body
      const response = await api.post<ApiResponseWithTitle>(
        `/chatbot/chat/specific?specific_conversation_id=${encodeURIComponent(specific_conversation_id)}`,
        { prompt } // Only send prompt in body
      );

      console.log('Chatbot response:', response.data);

      if (!response.data || !response.data.id || !response.data.response) {
        throw new Error('Invalid response structure from server');
      }

      setData(response.data);
      return response.data;
    } catch (apiError: unknown) {
      console.error('Chatbot API error:', apiError);

      let errorMessage = 'An unexpected error occurred.';
      if (typeof apiError === 'object' && apiError !== null) {
        const err = apiError as {
          message?: string;
          response?: { data?: { message?: string; detail?: string } };
        };

        if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postChatbotSpecificCall, data, loading, error };
};
