'use client';

import { useState } from 'react';
import api from '@/utils/api';

export interface Company {
  company_id: string;
  name: string;
}

export interface FetchCompanyResponse {
  companies?: Company[];
}

export const useFetchDashboardCompanies = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<FetchCompanyResponse>('/companies');
      setCompanies(response?.data?.companies || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    loadingCompanies: loading,
    errorCompanies: error,
    fetchCompanies,
  };
};
