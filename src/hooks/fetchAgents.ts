'use client';

import { useState } from 'react';
import api from '@/utils/api';

export interface Agent {
  user_id: string;
  username: string;
}

export const useFetchAgents = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [agents, setAgents] = useState<Agent[]>([]);

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users/employees');
      setAgents(response.data?.data || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    agents,
    loadingAgents: loading,
    errorAgents: error,
    fetchAgents,
  };
};
