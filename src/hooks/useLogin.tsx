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

      router.push('/perfil');
    } catch (error) {
      setError(
        `Error al Iniciar sesión: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
