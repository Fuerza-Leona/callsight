'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Summary } from '@/interfaces/summary';

export const useSummary = () => {
  const [data, setData] = useState<Summary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getSummary = async (call_id: string) => {
    console.log('Fetching summary for call_id:', call_id); // DEBUG
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ summary: Summary[] }>(
        `/conversations/call/${call_id}/summary`
      );
      console.log('Response summary:', response.data); // DEBUG
      setData(response.data.summary);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getSummary, data, loading, error };
};
