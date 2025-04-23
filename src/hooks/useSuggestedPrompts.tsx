'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';
import { Suggestions } from '@/interfaces/suggestions';

export const useSuggestedPrompts = () => {
  const [data, setData] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getSuggestions = async () => {
    console.log('Sending prompt to OpenAI API');
    setLoading(true);
    setError(null);

    try {
      const tokenRes = await fetch('/api/getToken');
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.user) {
        throw new Error('Token missing or invalid');
      }

      const accessToken = tokenData.user;

      const response = await axios.post<Suggestions>(
        `${apiUrl}/chatbot/suggestions`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Suggested prompts:', response.data.recommendations);
      setData(response.data.recommendations);
    } catch (err: unknown) {
      console.error('Chatbot fetch error:', err);
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          'Could not get suggested prompts. Please try again.';
        setError(message);
      } else {
        setError('An unexpected error occurred.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getSuggestions, data, loading, error };
};
