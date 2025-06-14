'use client';

import { useState } from 'react';
import api from '@/utils/api';

interface TeamsResponse {
  meetings: number;
}

export const useFetchTeams = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>('');
  const [meetings, setMeetings] = useState<number>(0);

  const fetchTeams = async () => {
    try {
      const response = await api.get<TeamsResponse>(
        '/teams/meetings_transcripts'
      );
      const count = response.data?.meetings;
      if (count > 0) {
        setMeetings(count);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    meetings,
    loadingTeams: loading,
    errorTeams: error,
    fetchTeams,
  };
};
