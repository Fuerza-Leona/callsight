'use client';

import axios from 'axios';
import { useState } from 'react';
import { apiUrl } from '@/constants';

export interface Summary {
  average_minutes: number;
  conversation_count: number;
}

interface SummaryResponse {
  summary?: Summary;
}

interface FetchConversationsSummaryParams {
  clients: string[] | null;
  categories: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchConversationsSummary = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [summary, setSummary] = useState<Summary | undefined>(undefined);

  const fetchConversationsSummary = async (
    params?: FetchConversationsSummaryParams
  ) => {
    setLoading(true);
    setError('');
    setSummary(undefined);
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

      const summaryResponse = await axios.post<SummaryResponse>(
        `${apiUrl}/conversations/summary`,
        requestBody,
        config
      );

      setSummary(summaryResponse.data?.summary);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    summary,
    loadingSummary: loading,
    errorSummary: error,
    fetchConversationsSummary,
  };
};
