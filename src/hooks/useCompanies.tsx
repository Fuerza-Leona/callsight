import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext'; // Adjust the path if needed

export interface Company {
  company_id: string;
  name: string;
  logo: string;
  category_id: string;
}

export const useCompanies = () => {
  const { token } = useUser(); // 🎯 Get token from context
  const [companies, setCompanies] = useState<Company[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          'http://0.0.0.0:8000/api/v1/tickets/companies',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Fetched companies:', response.data); // Log the response
        setCompanies(response.data.companies || []);
      } catch (err: unknown) {
        console.error('Error fetching companies:', err); // Log the error
        setError('Error fetching companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [token]);

  return { companies, loading, error };
};
