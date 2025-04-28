import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext'; // Adjust the path if needed
import { apiUrl } from '@/constants';
import { UUID } from 'crypto';

export interface Employee {
  user_id: UUID;
  username: string;
}

export const useEmployees = () => {
  const { token } = useUser(); // 🎯 Get token from context
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const tokenRes = await fetch('/api/getToken');
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.user) {
          throw new Error('Token missing or invalid');
        }

        const accessToken = tokenData.user;
        const response = await axios.get(`${apiUrl}/users/employees`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Fetched employees:', response.data); // Log the response
        setEmployees(response.data || []);
        console.log(employees);
      } catch (err: unknown) {
        console.error('Error fetching employees:', err); // Log the error
        setError('Error fetching employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return { employees, loading, error };
};
