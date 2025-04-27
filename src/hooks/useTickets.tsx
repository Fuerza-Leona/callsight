import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants';

export interface Ticket {
  ticket_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  company_id: string;
}

interface TicketsResponse {
  tickets: Ticket[];
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketsByCompany = async (companyId: string) => {
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

      const response = await axios.get<TicketsResponse>(`${apiUrl}/tickets/`, {
        params: { company_id: companyId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Fetched tickets:', response.data);
      setTickets(response.data.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err instanceof Error ? err.message : 'Error fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (
    companyId: string,
    subject: string,
    description: string
  ) => {
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

      // New ticket
      const response = await axios.post(
        `${apiUrl}/tickets/companies/${companyId}/tickets`,
        {
          subject,
          description,
          status: 'open',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Created ticket:', response.data);

      // Refresh tickets list
      await fetchTicketsByCompany(companyId);

      return response.data;
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err instanceof Error ? err.message : 'Error creating ticket');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (
    ticketId: string,
    status: 'open' | 'in_progress' | 'closed'
  ) => {
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

      // Update ticket status
      const response = await axios.put(
        `${apiUrl}/tickets/${ticketId}/status`,
        null,
        {
          params: { status },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Updated ticket status:', response.data);

      // Update the local state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticket_id === ticketId ? { ...ticket, status } : ticket
        )
      );

      return response.data;
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError(
        err instanceof Error ? err.message : 'Error updating ticket status'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    fetchTicketsByCompany,
    createTicket,
    updateTicketStatus,
  };
};
