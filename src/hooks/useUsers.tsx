'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { User } from '@/interfaces/user';

export const useUsers = () => {
  const [data, setData] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      //Request with Auth header
      const response = await api.get<User[]>('users');
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
