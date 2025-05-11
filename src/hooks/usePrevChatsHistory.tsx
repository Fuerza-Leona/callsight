'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';

export interface HistoryChat {
  chatbot_conversation_id: string;
  title: string;
}

export const usePrevChatsHistory = () => {
  const [data, setData] = useState<HistoryChat[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getChats = async () => {
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
      const response = await axios.get<HistoryChat[]>(
        `${apiUrl}/chatbot/all_chats`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('previous chats history response:', response.data);
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

  return { getChats, data, loading, error };
};
