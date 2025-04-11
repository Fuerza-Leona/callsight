'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import { apiUrl } from '@/constants';

export interface topic {
  topic: string;
  amount: number;
}

export interface fetchTopicsParams {
  limit: number | null;
  clients: string[] | null;
  categories: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchTopics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [topics, setTopics] = useState<topic[]>([]);

  const fetchTopics = async (params?: fetchTopicsParams) => {
    setLoading(true);
    setError("");
    
    try {
      const tokenResponse = await axios.get("/api/getToken", { 
        headers: { "Content-Type": "application/json" } 
      });
      
      const requestBody = {
        ...(params?.limit && { limit: params.limit }),
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients && params.clients.length > 0 && { clients: params.clients }),
        ...(params?.categories && params.categories.length > 0 && { categories: params.categories }),

      };
      
      const config = {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.user}`,
          "Content-Type": "application/json",
          withCredentials: true,
        }
      };
      
      const topicsResponse = await axios.post(
        "http://127.0.0.1:8000/api/v1/topics",
        requestBody,
        config
      );
      
      setTopics(topicsResponse.data.topics);
    } catch (err) {
      console.error("Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return { topics, loadingTopics: loading, errorTopics: error, fetchTopics };
};
