import { useState, useCallback } from 'react';
import axios from 'axios';

import { apiUrl } from '@/constants';

interface Participant {
  user_id: string;
  username: string;
}

interface ParticipantsResponse {
  participants?: Participant[];
}

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async (companyId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<ParticipantsResponse>(
        `${apiUrl}/companies/${companyId}/list`
      );
      setParticipants(response.data?.participants || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Error');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    participants,
    loadingParticipants: loading,
    errorParticipants: error,
    fetchParticipants,
  };
};
