'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';

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
      //Get access_token
      const tokenRes = await fetch('/api/getToken');
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.user) {
        throw new Error('Token missing or invalid');
      }

      const accessToken = tokenData.user;

      //Request with Auth header
      const response = await axios.post<ApiResponse>(
        `${apiUrl}/chatbot/continue/${conversation_id}`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Chatbot response:', response.data);
      setData(response.data.response);
      return response.data.response;
    } catch (err: unknown) {
      console.error('Chatbot fetch error:', err);
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          'Could not get a chatbot response. Please try again.';
        setError(message);
      } else {
        setError('An unexpected error occurred.');
      }
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postChatbotConversation, data, loading, error };
};
