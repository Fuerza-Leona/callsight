'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';
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
      const response = await axios.get<{ messages: Messages[] }>(
        `${apiUrl}/conversations/${call_id}/messages`
      );
      console.log('Response:', response.data); // DEBUG
      setData(response.data.messages);
    } catch (err: unknown) {
      console.error('Message fetch error:', err); // DEBUG
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          'Could not find messages. Please try again.';
        setError(message);
      } else {
        setError('An unexpected error occurred.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getMessages, data, loading, error };
};
