'use client';

import { useState } from 'react';
import api from '@/utils/api';

interface ApiResponse {
  chatbot_conversation_id: string;
  title: string;
}

export const usePrevChatsHistory = () => {
  const [data, setData] = useState<ApiResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getChats = async () => {
    setLoading(true);
    setError(null);

    try {
      //Request with Auth header
      const response = await api.get<ApiResponse[]>('/chatbot/all_chats');

      console.log('previous chats history response:', response.data);
      setData(response.data);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getChats, data, loading, error };
};
