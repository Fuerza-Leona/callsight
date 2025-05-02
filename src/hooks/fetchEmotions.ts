'use client';

import { useState } from 'react';
import api from '@/utils/api';

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
      const requestBody = {
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients &&
          params.clients.length > 0 && { clients: params.clients }),
        ...(params?.categories &&
          params.categories.length > 0 && { categories: params.categories }),
      };

      const emotionsResponse = await api.post<EmotionsResponse>(
        '/conversations/myClientEmotions',
        requestBody
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
