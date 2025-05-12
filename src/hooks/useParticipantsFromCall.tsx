'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Participant } from '@/interfaces/participants';

export const useParticipants = () => {
  const [data, setData] = useState<Participant[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getParticipants = async (call_id: string) => {
    console.log('Fetching participants for call_id:', call_id); // DEBUG
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ participants: Participant[] }>(
        `/conversations/call/${call_id}/participants`
      );
      console.log('Response participants:', response.data); // DEBUG
      setData(response.data.participants);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getParticipants, data, loading, error };
};
