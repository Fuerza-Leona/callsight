import { useState } from 'react';
import api from '@/utils/api';

export const useInsights = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [errorInsights, setErrorInsights] = useState<string | null>(null);

  const fetchInsights = async (companyId: string) => {
    try {
      setLoadingInsights(true);
      setErrorInsights(null);
      const response = await api.post(`/insights/?company_id=${companyId}`);
      setInsights(response.data.insights);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setErrorInsights(
        err instanceof Error ? err.message : 'Failed to fetch insights'
      );
      setInsights([]);
    } finally {
      setLoadingInsights(false);
    }
  };

  return { insights, loadingInsights, errorInsights, fetchInsights };
};
