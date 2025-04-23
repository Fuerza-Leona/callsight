'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl } from '@/constants';

export interface Conversation {
  conversation_id: string;
  start_time: string;
  end_time: string;
  category: string;
}

interface ConversationsResponse {
    conversations?: Conversation[];
}

interface FetchConversationsParams {
  clients: string[] | null;
  categories: string[] | null;
  startDate: string | null;
  endDate: string | null;
  conversation_id: string | null;
}

export const useFetchConversations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async (
    params?: FetchConversationsParams
  ) => {
    setLoading(true);
    setError('');
    try {
      const tokenResponse = await axios.get('/api/getToken', {
        headers: { 'Content-Type': 'application/json' },
      });

      const requestBody = {
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients &&
          params.clients.length > 0 && { clients: params.clients }),
        ...(params?.categories &&
          params.categories.length > 0 && { categories: params.categories }),
          ...(params?.conversation_id && { conversation_id: params.conversation_id }),

      };

      const config = {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.user}`,
          'Content-Type': 'application/json',
          withCredentials: true,
        },
      };

      const conversationsResponse =
        await axios.post<ConversationsResponse>(
          `${apiUrl}/conversations/mine`,
          requestBody,
          config
        );

      setConversations(conversationsResponse.data?.conversations || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    loadingConversations: loading,
    errorConversations: error,
    fetchConversations,
  };
};
