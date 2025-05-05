'use client';

import { useState } from 'react';
import api from '@/utils/api';
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
      const response = await api.post<Suggestions>('/chatbot/suggestions', {});

      console.log('Suggested prompts:', response.data.recommendations);
      setData(response.data.recommendations);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getSuggestions, data, loading, error };
};
