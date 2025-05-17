'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { UUID } from 'crypto';

export interface Users {
  user_id: UUID;
  username: string;
  email: string;
  role: string;
  company_id: UUID;
}

export const useUsers = () => {
  const [data, setData] = useState<Users[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      //Request with Auth header
      const response = await api.get<Users[]>('users');
      setData(response.data);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getUsers, data, loading, error };
};
