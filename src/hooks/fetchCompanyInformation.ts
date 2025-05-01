'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';

export const useFetchCompanyInformation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [rows, setSizes] = useState<{ name: string; size: number }[]>([]);
  const fetchCompanyInformation = async () => {
    setLoading(true);
    setError('');
    try {
      const tokenRes = await fetch('/api/getToken');
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.user) {
        throw new Error('Token missing or invalid');
      }

      const accessToken = tokenData.user;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          withCredentials: true,
        },
      };

      const [sizeResponse] = await Promise.all([
        axios.get(`${apiUrl}/companies/companySize`, config),
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
