'use client';
import SelectableCheckboxList, {
  ItemData,
} from '@/components/SelectableCheckboxList';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useTicketMessages } from '@/hooks/useTicketMessages';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import TicketMessagesList from '@/components/TicketMessagesList';

const Tickets = () => {
  const [textFieldHeight, setTextFieldHeight] = useState(500);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicketSubject, setSelectedTicketSubject] =
    useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get('company_id');
  const companyName = searchParams.get('company_name') || 'Cliente';

  // Custom hooks for tickets and messages
  const {
    tickets,
    loading: loadingTickets,
    error: ticketsError,
    fetchTicketsByCompany,
    createTicket,
  } = useTickets();

  const {
    messages,
    loading: loadingMessages,
    error: messagesError,
    fetchTicketMessages,
    addTicketMessage,
  } = useTicketMessages();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 500;
      const scrollY = window.scrollY;
      const newHeight = 500 + Math.min(200, (scrollY / maxScroll) * 200); // max 700
      setTextFieldHeight(newHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch tickets only when companyId changes
  useEffect(() => {
    if (companyId) {
      fetchTicketsByCompany(companyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // Fetch messages only when selectedTicketId changes
  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketMessages(selectedTicketId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicketId]);

  const handleTicketSelect = (item: ItemData) => {
    const ticketId = item.id.toString();
    const ticketSubject = item.label || '';

    setSelectedTicketId(ticketId);
    setSelectedTicketSubject(ticketSubject);
  };

  const handleSaveMessage = async () => {
    if (selectedTicketId && messageText.trim()) {
      await addTicketMessage(selectedTicketId, messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveMessage();
    }
  };

  const handleOpenNewTicketModal = () => {
    setIsNewTicketModalOpen(true);
  };

  const handleCloseNewTicketModal = () => {
    setIsNewTicketModalOpen(false);
    setNewTicketSubject('');
    setNewTicketDescription('');
  };

  const handleCreateNewTicket = async () => {
    if (companyId && newTicketSubject && newTicketDescription) {
      await createTicket(companyId, newTicketSubject, newTicketDescription);
      handleCloseNewTicketModal();
    }
  };

  // Transform tickets for SelectableCheckboxList
  const ticketItems = tickets.map((ticket) => ({
    id: ticket.ticket_id,
    label: ticket.subject,
    daysOpen: Math.ceil(
      (new Date().getTime() - new Date(ticket.created_at).getTime()) /
        (1000 * 3600 * 24)
    ),
    text: ticket.description,
  }));

  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  return (
    <div className="relative w-full min-h-screen flex flex-col lg:pl-[256px] pt-[140px] md:pt-28 lg:pt-[150px]">
      {/* 🔙 Botón de Regresar */}
      <div className="pl-3 mb-4">
        <button
          className="bg-[#13202A] text-white px-4 py-2 rounded-lg hover:bg-[#1b2c3d] transition-colors"
          onClick={() => router.push('/companies')}
        >
          ← Regresar
        </button>
      </div>

      {/* 🧾 Título centrado */}
      <div className="w-full text-center mb-6">
        <div className="bg-[#13202A] rounded-2xl mx-20 p-6 inline-block shadow-md">
          <p className="text-white text-3xl font-semibold">
            Portal de Soporte para {companyName}
          </p>
        </div>
      </div>

      <div className="w-full flex justify-between px-4">
        {/* Left column - Tickets list */}
        <div className="flex flex-col w-96 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with action buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              bgcolor: 'var(--neoris-blue)',
              color: 'white',
              p: 2,
            }}
          >
            <Typography fontWeight="medium">
              Tickets ({openTicketsCount})
            </Typography>
            <Box>
              <IconButton
                size="small"
                sx={{ color: 'white', mr: 1 }}
                title="Filtrar tickets"
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
                onClick={handleOpenNewTicketModal}
                title="Nuevo ticket"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Tickets list */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 350px)',
            }}
          >
            {loadingTickets ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                }}
              >
                <CircularProgress
                  size={30}
                  sx={{ color: 'var(--neoris-blue)' }}
                />
                <Typography variant="body2" ml={2} color="text.secondary">
                  Cargando tickets...
                </Typography>
              </Box>
            ) : ticketsError ? (
              <Box sx={{ p: 3, color: 'error.main' }}>
                <Typography>Error: {ticketsError}</Typography>
              </Box>
            ) : ticketItems.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  height: '200px',
                }}
              >
                <Typography align="center">
                  No hay tickets disponibles
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenNewTicketModal}
                  sx={{
                    mt: 2,
                    bgcolor: 'var(--neoris-blue)',
                    '&:hover': { bgcolor: '#1b2c3d' },
                  }}
                >
                  Crear ticket
                </Button>
              </Box>
            ) : (
              <SelectableCheckboxList
                items={ticketItems}
                onSelect={handleTicketSelect}
              />
            )}
          </Box>
        </div>

        {/* Right column - Chat area */}
        <Box
          sx={{
            width: 'calc(100% - 420px)',
            height: `${textFieldHeight}px`,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            overflow: 'hidden',
            transition: 'height 0.02s ease-in-out',
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              bgcolor: selectedTicketId ? 'var(--jonquil)' : '#f5f5f5',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography fontWeight="medium" variant="subtitle1">
              {selectedTicketId
                ? `Ticket: ${selectedTicketSubject}`
                : 'Seleccione un ticket para ver los mensajes'}
            </Typography>
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: '#f9f9f9',
              position: 'relative',
            }}
          >
            {selectedTicketId ? (
              <Box
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <TicketMessagesList
                  messages={messages || []}
                  loading={loadingMessages}
                  error={messagesError}
                  ticketDescription={
                    tickets.find(
                      (ticket) => ticket.ticket_id === selectedTicketId
                    )?.description
                  }
                />
                <div ref={messagesEndRef} />
              </Box>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                  bgcolor: '#f5f5f5',
                }}
              >
                <Box
                  component="img"
                  src="/assets/messages-empty.svg"
                  alt="No messages"
                  sx={{ width: 120, height: 120, opacity: 0.7, mb: 3 }}
                  onError={(e) => {
                    // Fallback in case image doesn't exist
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <Typography variant="h6" color="text.secondary" align="center">
                  Seleccione un ticket para ver la conversación
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  Los mensajes aparecerán aquí
                </Typography>
              </Box>
            )}
          </Box>

          {/* Message input area */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #e0e0e0',
              bgcolor: '#f5f5f5',
            }}
          >
            <Paper
              component="form"
              elevation={1}
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 30,
                border: '1px solid #e0e0e0',
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={
                  selectedTicketId
                    ? 'Escriba su mensaje aquí...'
                    : 'Seleccione un ticket para enviar mensajes'
                }
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={!selectedTicketId}
                multiline
                maxRows={4}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                color="primary"
                sx={{
                  p: '10px',
                  color:
                    !selectedTicketId || !messageText.trim()
                      ? 'grey.400'
                      : 'var(--neoris-blue)',
                  '&:hover': {
                    bgcolor:
                      !selectedTicketId || !messageText.trim()
                        ? 'transparent'
                        : 'rgba(19, 32, 42, 0.04)',
                  },
                }}
                onClick={handleSaveMessage}
                disabled={!selectedTicketId || !messageText.trim()}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      </div>

      {/* New Ticket Modal */}
      <Dialog
        open={isNewTicketModalOpen}
        onClose={handleCloseNewTicketModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'var(--neoris-blue)', color: 'white' }}>
          Crear Nuevo Ticket
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Asunto"
            fullWidth
            variant="outlined"
            value={newTicketSubject}
            onChange={(e) => setNewTicketSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newTicketDescription}
            onChange={(e) => setNewTicketDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseNewTicketModal}
            sx={{ color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateNewTicket}
            variant="contained"
            disabled={!newTicketSubject || !newTicketDescription}
            sx={{
              bgcolor: 'var(--neoris-blue)',
              '&:hover': { bgcolor: '#1b2c3d' },
              '&.Mui-disabled': { bgcolor: '#e0e0e0' },
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Tickets;
