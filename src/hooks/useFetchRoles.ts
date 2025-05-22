'use client';

import { useState } from 'react';
import api from '@/utils/api';

export const useFetchAgentRoles = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');

  const changeRole = async (user_id: string, role: string) => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/users/${user_id}/${role}`);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    changeRole,
    loading,
    error,
  };
};
