'use client';

import { useState } from 'react';
import api from '@/utils/api';

export interface Topic {
  topic: string;
  amount: number;
}

interface FetchTopicsParams {
  limit: number | null;
  clients: string[] | null;
  categories: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchTopics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [topics, setTopics] = useState<Topic[]>([]);

  const fetchTopics = async (params?: FetchTopicsParams) => {
    setLoading(true);
    setError('');

    try {
      const requestBody = {
        ...(params?.limit && { limit: params.limit }),
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients &&
          params.clients.length > 0 && { clients: params.clients }),
        ...(params?.categories &&
          params.categories.length > 0 && { categories: params.categories }),
      };

      const topicsResponse = await api.post('/topics', requestBody);

      setTopics(topicsResponse.data.topics);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { topics, loadingTopics: loading, errorTopics: error, fetchTopics };
};
