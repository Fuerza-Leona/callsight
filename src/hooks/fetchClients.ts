'use client';

import { useState } from 'react';
import api from '@/utils/api';

export interface Client {
  user_id: string;
  username: string;
}

interface ClientsResponse {
  clients?: Client[];
}

export const useFetchClients = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<ClientsResponse>('/users/client');
      setClients(response.data?.clients || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loadingClients: loading,
    errorClients: error,
    fetchClients,
  };
};
