import { useState } from 'react';
import api from '@/utils/api';
import { UUID } from 'crypto';

export interface Ticket {
  ticket_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  company_id: string;
  assigned_to: UUID;
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
      const response = await api.get<TicketsResponse>(
        `/tickets?company_id=${companyId}`
      );

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
      const response = await api.post(
        `/tickets/companies/${companyId}/tickets`,
        {
          subject,
          description,
          status: 'open',
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
      // Update ticket status
      const response = await api.put(`/tickets/${ticketId}/status`);

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
