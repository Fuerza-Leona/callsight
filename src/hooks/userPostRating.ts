'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { AxiosError } from 'axios';

export const usePostRating = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>('');

  const postRating = async (conversation_id: string, rating: number) => {
    try {
      await api.post('/conversations/call/rating', {
        rating,
        conversation_id,
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.detail;
        setError(message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loadingPostRating: loading,
    errorPostRating: error,
    postRating,
  };
};
