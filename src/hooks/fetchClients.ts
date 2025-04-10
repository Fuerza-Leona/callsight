'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const apiUrl = publicRuntimeConfig.apiUrl;

export interface client {
  user_id: string;
  username: string;
}

export const useFetchClients = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [clients, setClients] = useState<client[]>([]);

  const refetchClients = async () => {
    axios
      .get(`${apiUrl}/users/client`)
      .then((response) => {
        console.log('Response from API:', response.data);
        setClients(response.data);
      })
      .catch((errorA) => {
        console.error('Error fetching summary:', errorA);
        setError(errorA);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refetchClients();
  }, []);

  return {
    clients,
    loadingClients: loading,
    errorClients: error,
    refetchClients,
  };
};
