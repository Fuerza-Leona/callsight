'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiURL } from '@/constants';
import { Call } from '@/interfaces/call';

export const useCallData = () => {
  const [data, setData] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getCallData = async (call_id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<Call>(
        `${apiURL}/conversations/call/${call_id}`
      );

      setData(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          'Could not find info for selected call. Please try again.';
        setError(message);
      } else {
        setError('An unexpected error occurred.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getCallData, data, loading, error };
};
