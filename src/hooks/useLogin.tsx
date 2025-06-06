'use client';

import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { LoginResponse } from '@/interfaces/login';
import api from '../utils/api';

export const useLogin = () => {
  const { setUser } = useUser();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      setUser(response.data.user);

      // If user is already connected to Teams, redirect immediately
      if (response.data.user.isConnected) {
        const role = response.data.user.role;
        if (role !== 'client') {
          router.push('/calls/dashboard');
        } else {
          router.push('/calls/search');
        }
      }

      // Return user data so component can check isConnected
      return response.data.user;
    } catch (error) {
      setError(
        `Error al Iniciar sesión: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const redirectBasedOnRole = (user: any) => {
    const role = user.role;
    if (role !== 'client') {
      router.push('/calls/dashboard');
    } else {
      router.push('/calls/search');
    }
  };

  return { login, redirectBasedOnRole, loading, error };
};
