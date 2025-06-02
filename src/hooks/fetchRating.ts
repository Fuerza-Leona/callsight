'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useUser } from '@/context/UserContext';

interface RatingResponse {
  rating?: number;
}

export const useFetchRating = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>('');
  const router = useRouter();
  const user = useUser();
  const role = user.user?.role;

  const fetchRating = async (conversation_id: string) => {
    try {
      const response = await api.get<RatingResponse>(
        `/conversations/call/${conversation_id}/rating`
      );
      const rating = response.data?.rating || 0;
      if (rating == 0) {
        setTimeout(() => setShowModal(true), 5000);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.detail;
        console.log('Error:', message);
        if (message == '401: User is not a participant' && role != 'admin') {
          router.push('/perfil');
        } else {
          setError('Ocurrio un error.');
        }
      }
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
