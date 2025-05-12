'use client';

import { useState } from 'react';
import api from '@/utils/api';

export const useFetchProfile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [number, setNumber] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const [numResponse, ratingResponse, durationResponse] = await Promise.all(
        [
          api.get(`/conversations/minenumber`),
          api.get(`/conversations/mineratings`),
          api.get(`/conversations/myDuration`),
        ]
      );

      setNumber(numResponse.data.number || 0);
      setRating(ratingResponse.data.rating || 0);
      setDuration(durationResponse.data.duration || 0);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, number, rating, duration, fetchProfile };
};
