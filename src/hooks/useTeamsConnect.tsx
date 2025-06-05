'use client';
import { useState } from 'react';
import api from '../utils/api';

interface AuthUrlResponse {
  auth_url: string;
}

export const useTeamsConnect = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const connectTeams = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await api.get<AuthUrlResponse>('/teams/connect');

      if (response.data.auth_url) {
        setData(response.data.auth_url);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      console.error('Teams connect error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    connectTeams,
    loading,
    error,
    data,
  };
};
