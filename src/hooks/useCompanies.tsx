import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext'; // Adjust the path if needed
import { apiUrl } from '@/constants';

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
    console.log('🧭 You are in useCompanies and hook has been called.');

    const fetchCompanies = async () => {
      try {
        const tokenRes = await fetch('/api/getToken');
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.user) {
          throw new Error('Token missing or invalid');
        }

        const accessToken = tokenData.user;
        const response = await axios.get(`${apiUrl}/tickets/companies`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
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
