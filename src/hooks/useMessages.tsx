'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Messages } from '@/interfaces/messages';

export const useMessages = () => {
  const [data, setData] = useState<Messages[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getMessages = async (call_id: string) => {
    console.log('Fetching messages for call_id:', call_id); // DEBUG
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ messages: Messages[] }>(
        `/conversations/${call_id}/messages`
      );
      console.log('Response:', response.data); // DEBUG
      setData(response.data.messages);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getMessages, data, loading, error };
};
