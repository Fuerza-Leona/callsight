'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';

export interface ChatMessage {
  role: string;
  created_at: string;
  content: string;
  previous_response_id: string | null;
}

export const useChatbotConversationHistoryHistory = () => {
  const [data, setData] = useState<ChatMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getChatMessages = async (conversation_id: string) => {
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
      const response = await axios.get<ChatMessage[]>(
        `${apiUrl}/chatbot/chat_history/${conversation_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Chat history response:', response.data);
      setData(response.data);
    } catch (err: unknown) {
      console.error('Chatbot fetch error:', err);
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          'Could not get a chat history. Please try again.';
        setError(message);
      } else {
        setError('An unexpected error occurred.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getChatMessages, data, loading, error };
};
