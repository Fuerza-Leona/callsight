'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl } from '@/constants';

export interface Category {
  name: string;
  count: number;
}

interface ConversationsCategoryResponse {
  categories?: Category[];
}

interface FetchConversationsCategoriesParams {
  clients: string[] | null;
  categories: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchConversationsCategories = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [conversationsCategories, setCategories] = useState<Category[]>([]);

  const fetchConversationsCategories = async (
    params?: FetchConversationsCategoriesParams
  ) => {
    setLoading(true);
    setError('');
    try {
      const tokenResponse = await axios.get('/api/getToken', {
        headers: { 'Content-Type': 'application/json' },
      });

      const requestBody = {
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients &&
          params.clients.length > 0 && { clients: params.clients }),
        ...(params?.categories &&
          params.categories.length > 0 && { categories: params.categories }),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.user}`,
          'Content-Type': 'application/json',
          withCredentials: true,
        },
      };

      const categoriesResponse =
        await axios.post<ConversationsCategoryResponse>(
          `${apiUrl}/conversations/categories`,
          requestBody,
          config
        );

      setCategories(categoriesResponse.data?.categories || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    conversationsCategories,
    loadingConversationsCategories: loading,
    errorConversationsCategories: error,
    fetchConversationsCategories,
  };
};
