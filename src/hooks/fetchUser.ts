'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { User } from '@/interfaces/user';

export const useFetchUserInformation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [userFetched, setUser] = useState<User>();
  const fetchUserInformation = async (userID: string) => {
    setLoading(true);
    setError('');
    try {
      const fetchedUser = await api.get(`/users/${userID}`);
      console.log(fetchedUser.data.user);
      setUser(fetchedUser.data.user);
      console.log(userFetched);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, userFetched, fetchUserInformation };
};
