'use client';

import { useState } from 'react';
import api from '@/utils/api';

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
  agents: string[] | null;
  companies: string[] | null;
  startDate: string | null;
  endDate: string | null;
  conversation_id: string | null;
}

export const useFetchConversations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async (params?: FetchConversationsParams) => {
    setLoading(true);
    setError('');
    try {
      const requestBody = {
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
        ...(params?.clients &&
          params.clients.length > 0 && { clients: params.clients }),
        ...(params?.agents &&
          params.agents.length > 0 && { categories: params.agents }),
        ...(params?.companies &&
          params.companies.length > 0 && { companies: params.companies }),
        ...(params?.conversation_id && {
          conversation_id: params.conversation_id,
        }),
      };

      const conversationsResponse = await api.post<ConversationsResponse>(
        '/conversations/mine',
        requestBody
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
