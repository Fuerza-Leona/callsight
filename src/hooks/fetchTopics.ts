'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import { apiUrl } from '@/constants';

export interface topic {
  topic: string;
  amount: number;
}

export interface fetchTopicsParams {
  limit: number | null;
  clients: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchTopics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [topics, setTopics] = useState<topic[]>([]);

  const fetchTopics = async (params?: fetchTopicsParams) => {
    setLoading(true);
    setError('');

    axios
      .get('/api/getToken', { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        const baseParams: Record<string, unknown> = {
          ...(params?.limit && { limit: params.limit }),
          ...(params?.startDate && { startDate: params.startDate }),
          ...(params?.endDate && { endDate: params.endDate }),
        };

        const searchParams = new URLSearchParams();

        Object.entries(baseParams).forEach(([key, value]) => {
          searchParams.append(key, String(value));
        });

        if (params?.clients && params.clients.length > 0) {
          params.clients.forEach((client) => {
            searchParams.append('clients', client);
          });
        }

        const config = {
          headers: {
            Authorization: `Bearer ${response.data.user}`,
            withCredentials: true,
          },
        };

        axios
          .get(`${apiUrl}/topics?${searchParams.toString()}`, config)
          .then((response) => {
            setTopics(response.data.topics);
          })
          .catch((err) => {
            console.error('Error fetching topics:', err);
            setError(err);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error('Error in obtaining token: ' + err);
        setLoading(false);
        setError(err);
      });
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return { topics, loadingTopics: loading, errorTopics: error, fetchTopics };
};
