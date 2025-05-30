'use client';

import { useState } from 'react';
import api from '@/utils/api';

interface ApiResponse {
  response: string;
  id: string;
}

export const useChatbotConversationSpecificCall = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postChatbotConversationSpecificCall = async (
    prompt: string,
    specific_conversation_id: string,
    previous_response_id: string
  ): Promise<ApiResponse | null> => {
    console.log('Sending continuation prompt:', {
      prompt,
      specific_conversation_id,
      previous_response_id,
    });
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // Validate inputs
      if (!previous_response_id) {
        throw new Error('Previous response ID is required for continuation');
      }
      if (!specific_conversation_id) {
        throw new Error('Conversation ID is required');
      }

      const response = await api.post<ApiResponse>(
        `/chatbot/continue/specific/${previous_response_id}?specific_conversation_id=${specific_conversation_id}`,
        { prompt }
      );

      console.log('Chatbot continuation response:', response.data);

      // Validate response
      if (!response.data || !response.data.id || !response.data.response) {
        throw new Error('Invalid response structure from server');
      }

      return {
        response: response.data.response,
        id: response.data.id,
      };
    } catch (apiError: unknown) {
      console.error('Chatbot continuation API error:', apiError);

      let errorMessage = 'An unexpected error occurred.';
      if (
        typeof apiError === 'object' &&
        apiError !== null &&
        'message' in apiError
      ) {
        const err = apiError as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postChatbotConversationSpecificCall, loading, error };
};
