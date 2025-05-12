import { useEffect, useState } from 'react';
import api from '@/utils/api';

export interface Company {
  company_id: string;
  name: string;
  logo: string;
  category_id: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get(`/tickets/companies`);
        console.log('Fetched companies:', response.data); // Log the response
        setCompanies(response.data.companies || []);
      } catch {
        setError('Error fetching companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
};
