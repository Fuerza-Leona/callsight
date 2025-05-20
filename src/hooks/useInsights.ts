import { useState, useEffect } from 'react';
import api from '@/utils/api';

export const useInsights = (companyId: string) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post(
          `/insights/?company_id=${companyId}`,
          {}
        );

        // const response = await api.post('/insights/', { company_id: companyId });

        console.log('Insights API response:', response.data);
        if (response.data && Array.isArray(response.data.insights)) {
          setInsights(response.data.insights);
        } else {
          setInsights([]);
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch insights'
        );
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [companyId]);

  return { insights, loading, error };
};
