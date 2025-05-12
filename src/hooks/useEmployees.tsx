import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { UUID } from 'crypto';

export interface Employee {
  user_id: UUID;
  username: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/users/employees');
        console.log('Fetched employees:', response.data); // Log the response
        setEmployees(response.data || []);
        console.log(employees);
      } catch {
        setError('Error fetching employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { employees, loading, error };
};
