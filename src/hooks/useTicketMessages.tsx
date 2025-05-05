import { useState, useEffect } from 'react';
import api from '@/utils/api';

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
      // Fetch messages for the ticket
      const response = await api.get<TicketMessagesResponse>(
        `/tickets/${ticketId}/messages`
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
      setError(
        err instanceof Error ? err.message : 'Error fetching ticket messages'
      );

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
      // Add new message to ticket
      const response = await api.post(`/tickets/${ticketId}/messages`, {
        message,
      });

      console.log('Added ticket message response:', response.data);

      // Refresh messages list
      await fetchTicketMessages(ticketId);

      return response.data;
    } catch (err) {
      console.error('Error adding ticket message:', err);
      setError('Error adding ticket message');
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
