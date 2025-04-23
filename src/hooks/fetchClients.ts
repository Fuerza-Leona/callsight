'use client';

import axios from 'axios';
import { useState } from 'react';
import { apiUrl } from '@/constants';

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
      const response = await axios.get<ClientsResponse>(
        `${apiUrl}/users/client`
      );
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
