import { useState, useEffect } from 'react';
import axios from 'axios';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const apiUrl = publicRuntimeConfig.apiUrl;

interface Participant {
  user_id: string;
  username: string;
}

export function useParticipants(companyId: string, token: string | null) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !companyId) {
      setParticipants([]);
      setLoading(false);
      setError(null);
      return;
    }

    const getParticipants = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${apiUrl}/companies/${companyId}/list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('Participants API response:', response.data);

        if (response.data && Array.isArray(response.data.companies)) {
          setParticipants(response.data.companies);
        } else if (response.data && Array.isArray(response.data.participants)) {
          setParticipants(response.data.participants);
        } else {
          setParticipants([]);
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching participants:', err);
        setError('Failed to fetch participants');
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    getParticipants();
  }, [companyId, token]);

  return { participants, loading, error };
}
