'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface RatingResponse {
  rating?: number;
}

export const useFetchRating = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const router = useRouter();

  const fetchRating = async (conversation_id: string) => {
    try {
      const response = await api.get<RatingResponse>(
        `/conversations/call/${conversation_id}/rating`
      );
      const rating = response.data?.rating || 0;
      if (rating == 0) {
        setTimeout(() => setShowModal(true), 200);
      }
    } catch (err) {
      let detail = 'Error fetching ticket messages';
      if ((err as AxiosError).isAxiosError) {
        detail =
          (err as AxiosError<{ detail?: string }>).response?.data?.detail ||
          detail;
      }
      if (detail === 'User is not a participant') {
        router.push('/perfil');
      }
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return {
    loadingRating: loading,
    showModal,
    setShowModal,
    errorRating: error,
    fetchRating,
  };
};
