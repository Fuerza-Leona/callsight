import { useState, useEffect } from 'react';
import axios from 'axios';

import { apiUrl } from '@/constants';

interface Company {
  company_id: string;
  name: string;
  logo?: string;
  category_id?: string;
}

export function useFetchCompanies(token: string | null) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if no token is available
    if (!token) {
      setLoading(true);
      return;
    }

    const getCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${apiUrl}/companies/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Companies API response:', response.data);

        if (response.data && Array.isArray(response.data)) {
          setCompanies(response.data);
        } else if (response.data && Array.isArray(response.data.companies)) {
          // Handle if the API returns an object with a companies property
          setCompanies(response.data.companies);
        } else {
          setCompanies([]);
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to fetch companies');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    getCompanies();
  }, [token]);

  return { companies, loading, error };
}
