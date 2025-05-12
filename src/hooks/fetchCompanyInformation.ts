'use client';

import { useState } from 'react';
import api from '@/utils/api';

export const useFetchCompanyInformation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [rows, setSizes] = useState<{ name: string; size: number }[]>([]);
  const fetchCompanyInformation = async () => {
    setLoading(true);
    setError('');
    try {
      const [sizeResponse] = await Promise.all([
        api.get(`/companies/companySize`),
      ]);
      console.log('Company Sizes:', rows);
      setSizes(sizeResponse.data.info || [{ name: 'No data', sizes: 0 }]);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, rows, fetchCompanyInformation };
};
