'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';

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
      const tokenRes = await fetch('/api/getToken');
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.user) {
        throw new Error('Token missing or invalid');
      }

      const accessToken = tokenData.user;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          withCredentials: true,
        },
      };

      const [numResponse, ratingResponse, durationResponse] = await Promise.all(
        [
          axios.get(`${apiUrl}/conversations/minenumber`, config),
          axios.get(`${apiUrl}/conversations/mineratings`, config),
          axios.get(`${apiUrl}/conversations/myDuration`, config),
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
