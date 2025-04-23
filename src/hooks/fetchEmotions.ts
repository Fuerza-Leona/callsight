'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl } from '@/constants';

interface EmotionsResponse {
  emotions?: Emotions;
}

interface Emotions {
  positive: number | undefined;
  negative: number | undefined;
  neutral: number | undefined;
}

interface FetchConversationsEmotionsParams {
  clients: string[] | null;
  categories: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchEmotions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [emotions, setEmotions] = useState<Emotions>();

  const fetchEmotions = async (params?: FetchConversationsEmotionsParams) => {
    setLoading(true);
    setError('');

    try {
      const tokenResponse = await axios.get('/api/getToken', {
        headers: { 'Content-Type': 'application/json' },
      });

      const requestBody = {
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients &&
          params.clients.length > 0 && { clients: params.clients }),
        ...(params?.categories &&
          params.categories.length > 0 && { categories: params.categories }),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.user}`,
          'Content-Type': 'application/json',
          withCredentials: true,
        },
      };

      const emotionsResponse = await axios.post<EmotionsResponse>(
        `${apiUrl}/conversations/myClientEmotions`,
        requestBody,
        config
      );

      setEmotions(emotionsResponse.data?.emotions);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  

  return {
    emotions,
    loadingEmotions: loading,
    errorEmotions: error,
    fetchEmotions,
  };
};
