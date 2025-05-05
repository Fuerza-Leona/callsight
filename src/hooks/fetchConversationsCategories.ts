'use client';

import { useState } from 'react';
import api from '@/utils/api';

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
      const requestBody = {
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients &&
          params.clients.length > 0 && { clients: params.clients }),
        ...(params?.categories &&
          params.categories.length > 0 && { categories: params.categories }),
      };

      const categoriesResponse = await api.post<ConversationsCategoryResponse>(
        '/conversations/categories',
        requestBody
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
