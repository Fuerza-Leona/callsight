import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface Ticket {
  ticket_id: string;
  subject: string;
  status: string;
  created_at: string;
  // puedes agregar más campos si tienes
}

interface TicketsResponse {
  tickets: Ticket[];
}

export const useTicketsByCompany = (companyId: string | undefined) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<TicketsResponse>(
          `tickets/?company_id=${companyId}`
        );

        // Actualizado para acceder a response.data.tickets
        setTickets(response.data.tickets || []);
        setError(null);
      } catch (err) {
        console.error('Error al obtener tickets:', err);
        setError('No se pudieron obtener los tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [companyId]);

  return { tickets, loading, error };
};
