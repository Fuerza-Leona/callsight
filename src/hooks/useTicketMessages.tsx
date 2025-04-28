import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';

export interface TicketMessage {
  message_id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  created_at: string;
  username?: string; // User who sent the message
  sender_role?: 'agent' | 'client' | string; // Added field
}

interface TicketMessagesResponse {
  messages: TicketMessage[];
}

export const useTicketMessages = () => {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);

  const fetchTicketMessages = async (ticketId: string) => {
    console.log('Fetching messages for ticket:', ticketId);
    setCurrentTicketId(ticketId);
    setLoading(true);
    setError(null);
    try {
      // Get auth token
      const tokenRes = await fetch('/api/getToken');
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.user) {
        throw new Error('Token missing or invalid');
      }

      const accessToken = tokenData.user;

      // Fetch messages for the ticket
      const response = await axios.get<TicketMessagesResponse>(
        `${apiUrl}/tickets/${ticketId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('API Response for ticket messages:', response);

      // Check if the response has the expected structure
      if (response.data && Array.isArray(response.data.messages)) {
        console.log('Setting messages:', response.data.messages);
        setMessages(response.data.messages);
      } else if (response.data && Array.isArray(response.data)) {
        // Alternative API response format - direct array
        console.log('Setting messages from direct array:', response.data);
        setMessages(response.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setMessages([]);
        setError('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching ticket messages:', err);
      if (axios.isAxiosError(err)) {
        // Log detailed error information
        console.error('Axios error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
        });
        setError(
          `Error ${err.response?.status || ''}: ${err.response?.data?.detail || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : 'Error fetching ticket messages'
        );
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const addTicketMessage = async (ticketId: string, message: string) => {
    console.log('Adding message to ticket:', ticketId, message);
    setLoading(true);
    setError(null);
    try {
      // Get auth token
      const tokenRes = await fetch('/api/getToken');
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.user) {
        throw new Error('Token missing or invalid');
      }

      const accessToken = tokenData.user;

      // Add new message to ticket
      const response = await axios.post(
        `${apiUrl}/tickets/${ticketId}/messages`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Added ticket message response:', response.data);

      // Refresh messages list
      await fetchTicketMessages(ticketId);

      return response.data;
    } catch (err) {
      console.error('Error adding ticket message:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        });
        setError(
          `Error ${err.response?.status || ''}: ${err.response?.data?.detail || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : 'Error adding ticket message'
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Use an effect to monitor the messages state for debugging
  useEffect(() => {
    console.log('Current messages state:', messages);
  }, [messages]);

  return {
    messages,
    loading,
    error,
    currentTicketId,
    fetchTicketMessages,
    addTicketMessage,
  };
};
