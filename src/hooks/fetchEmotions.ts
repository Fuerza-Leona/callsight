'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Emotions } from '@/interfaces/emotions';

interface EmotionsResponse {
  emotions?: Emotions;
}

interface FetchConversationsEmotionsParams {
  clients: string[] | null;
  agents: string[] | null;
  companies: string[] | null;
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
        ...(params?.agents &&
          params.agents.length > 0 && { agents: params.agents }),
        ...(params?.companies &&
          params.companies.length > 0 && { companies: params.companies }),
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
