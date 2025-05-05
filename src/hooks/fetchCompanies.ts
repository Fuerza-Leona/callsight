import { useState, useEffect } from 'react';
import api from '@/utils/api';

interface Company {
  company_id: string;
  name: string;
  logo?: string;
  category_id?: string;
}

export function useFetchCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/companies/');

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
  }, []);

  return { companies, loading, error };
}
