import { useState, useEffect } from 'react';
import axios from 'axios';

export const fetchParticipants = (companyId: string, token: string | null) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipantsData = async () => {
      if (!companyId || !token) {
        setError('Missing companyId or token');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching participants for company ID: ${companyId}`);
        const response = await axios.get(`http://0.0.0.0:8000/api/v1/companies/${companyId}/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Participants Response:', response.data);  // Log the response

        setParticipants(response.data.companies);  // Access participants directly from the response
      } catch (error) {
        console.error('Error fetching participants:', error);  // Log the error
        setError('Error fetching participants');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantsData();
  }, [companyId, token]);

  return { participants, loading, error };
};
