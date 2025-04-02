import { useState, useEffect } from 'react';
import axios from 'axios';

export const fetchCompanies = (token: string | null) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching companies...');
        const response = await axios.get('http://0.0.0.0:8000/api/v1/companies/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response:', response.data);  // Log the response

        setCompanies(response.data.companies);  // Access companies directly from the response
      } catch (error) {
        console.error('Error fetching companies:', error);  // Log the error
        setError('Error fetching companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesData();
  }, [token]);

  return { companies, loading, error };
};
