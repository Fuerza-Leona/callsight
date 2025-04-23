'use client';

import axios from 'axios';
import { UUID } from 'crypto';
import { useState } from 'react';
import { apiUrl } from '@/constants';

export interface Category {
  category_id: UUID;
  name: string;
}

interface CategoriesResponse {
  categories?: Category[];
}

export const useFetchCategories = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get<CategoriesResponse>(
        `${apiUrl}/categories`
      );
      setCategories(response.data?.categories || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    categories,
    loadingCategories: loading,
    errorCategories: error,
    fetchCategories,
  };
};
