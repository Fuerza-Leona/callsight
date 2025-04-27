import React from 'react';
import { TicketMessage } from '@/hooks/useTicketMessages';
import { useUser } from '@/context/UserContext';
import {
  CircularProgress,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface TicketMessagesListProps {
  messages: TicketMessage[];
  loading: boolean;
  error: string | null;
  ticketDescription?: string;
}

const TicketMessagesList: React.FC<TicketMessagesListProps> = ({
  messages,
  loading,
  error,
  ticketDescription,
}) => {
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        height="100%"
      >
        <CircularProgress size={30} sx={{ color: 'var(--neoris-blue)' }} />
        <Typography variant="body1" ml={2} color="text.secondary">
          Cargando mensajes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bgcolor="#ffebee" borderRadius={2} m={2}>
        <Typography color="error" align="center" fontWeight="medium">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Box
        p={4}
        bgcolor="#f5f5f5"
        borderRadius={2}
        m={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="calc(100% - 32px)"
      >
        <SupportAgentIcon
          sx={{
            fontSize: 48,
            color: 'var(--neoris-blue)',
            mb: 2,
            opacity: 0.7,
          }}
        />
        <Typography color="text.secondary" align="center" fontSize={16}>
          No hay mensajes disponibles
        </Typography>
        <Typography color="text.secondary" align="center" fontSize={14} mt={1}>
          Sé el primero en responder a este ticket
        </Typography>
      </Box>
    );
  }

  // Group messages by date
  const groupedMessages: { [key: string]: TicketMessage[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.created_at).toLocaleDateString('es-ES');
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        p: 2,
        bgcolor: '#f9f9f9',
        borderRadius: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cccccc',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#999999',
        },
      }}
    >
      {Object.entries(groupedMessages).map(
        ([date, dateMessages], groupIndex) => (
          <Box key={date} mb={3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Divider sx={{ flexGrow: 1, mr: 2 }} />
              <Box
                display="flex"
                alignItems="center"
                bgcolor="var(--jonquil)"
                px={2}
                py={0.5}
                borderRadius={10}
              >
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="caption" fontWeight="medium">
                  {date}
                </Typography>
              </Box>
              <Divider sx={{ flexGrow: 1, ml: 2 }} />
            </Box>

            {groupIndex === 0 && (
              <Box
                sx={{
                  mb: 4,
                  mt: 1,
                  mx: 'auto',
                  maxWidth: '90%',
                  bgcolor: '#f0f0f0',
                  borderRadius: 2,
                  p: 2,
                  border: '1px dashed #ccc',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  Descripción del ticket:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticketDescription || 'Sin descripción disponible'}
                </Typography>
              </Box>
            )}

            {dateMessages.map((message, index) => {
              const isAgent =
                message.sender_role === 'agent' ||
                message.sender_role === 'admin';
              const isCurrentUser = message.user_id === user?.user_id;

              return (
                <Box
                  key={message.message_id || `${groupIndex}-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                      gap: 1.5,
                      maxWidth: '85%',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: isAgent
                          ? 'var(--neoris-blue)'
                          : 'var(--persian-pink)',
                        width: 38,
                        height: 38,
                      }}
                    >
                      {isAgent ? <SupportAgentIcon /> : <PersonIcon />}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="caption"
                        component="div"
                        fontWeight="bold"
                        color={
                          isAgent ? 'var(--neoris-blue)' : 'var(--persian-pink)'
                        }
                        mb={0.5}
                        ml={isAgent ? 0.5 : 0}
                      >
                        {message.username ||
                          (isAgent
                            ? 'Soporte'
                            : isCurrentUser
                              ? user?.username
                              : 'Cliente')}
                      </Typography>

                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isAgent ? 'white' : '#f7e9f3',
                          border: '1px solid',
                          borderColor: isAgent
                            ? 'var(--sky-blue)'
                            : 'var(--persian-pink)',
                          borderBottomLeftRadius: isAgent ? 0 : 2,
                          borderBottomRightRadius: isAgent ? 2 : 0,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            [isCurrentUser ? 'right' : 'left']: -8,
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            borderWidth: isCurrentUser
                              ? '0 0 8px 8px'
                              : '0 8px 8px 0',
                            borderColor: isCurrentUser
                              ? 'transparent transparent var(--persian-pink) transparent'
                              : 'transparent var(--sky-blue) transparent transparent',
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {message.message}
                        </Typography>
                      </Paper>

                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        mt={0.5}
                        textAlign={isCurrentUser ? 'right' : 'left'}
                        pr={isCurrentUser ? 1 : 0}
                        pl={isCurrentUser ? 0 : 1}
                      >
                        {formatDate(message.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )
      )}
    </Box>
  );
};

export default TicketMessagesList;
