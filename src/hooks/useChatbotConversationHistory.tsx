'use client';

import { useState } from 'react';
import api from '@/utils/api';

export interface ChatMessage {
  role: string;
  created_at: string;
  content: string;
  previous_response_id: string | null;
}

export const useChatbotConversationHistoryHistory = () => {
  const [data, setData] = useState<ChatMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getChatMessages = async (conversation_id: string) => {
    setLoading(true);
    setError(null);

    try {
      //Request with Auth header
      const response = await api.get<ChatMessage[]>(
        `chatbot/chat_history/${conversation_id}`
      );

      console.log('Chat history response:', response.data);
      setData(response.data);
    } catch {
      setError('An unexpected error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getChatMessages, data, loading, error };
};
