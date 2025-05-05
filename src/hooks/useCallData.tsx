'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Call } from '@/interfaces/call';

export const useCallData = () => {
  const [data, setData] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getCallData = async (call_id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<Call>(`/conversations/call/${call_id}`);
      setData(response.data);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getCallData, data, loading, error };
};
