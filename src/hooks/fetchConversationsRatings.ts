'use client';

import { useState } from 'react';
import api from '@/utils/api';

export interface Rating {
  rating: number;
  count: number;
}

interface ConversationsRatingsResponse {
  ratings?: Rating[];
}

interface FetchConversationsRatingsParams {
  clients: string[] | null;
  agents: string[] | null;
  companies: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchConversationsRatings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [ratings, setRatings] = useState<Rating[]>([]);

  const fetchConversationsRatings = async (
    params?: FetchConversationsRatingsParams
  ) => {
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
          params.companies.length > 0 && { agents: params.companies }),
      };

      const ratingsResponse = await api.post<ConversationsRatingsResponse>(
        '/conversations/ratings',
        requestBody
      );

      setRatings(ratingsResponse.data?.ratings || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    ratings,
    loadingRatings: loading,
    errorRatings: error,
    fetchConversationsRatings,
  };
};
