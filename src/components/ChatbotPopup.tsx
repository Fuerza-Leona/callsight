import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { useChatbotSpecificCall } from '@/hooks/useChatbotSpecificCall';
import { useChatbotConversationSpecificCall } from '@/hooks/useChatbotConversationSpecificCall';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotPopupProps {
  open: boolean;
  onClose: () => void;
  conversationId: string;
}

const ChatbotPopup: React.FC<ChatbotPopupProps> = ({
  open,
  onClose,
  conversationId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [lastResponseId, setLastResponseId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    postChatbotSpecificCall,
    loading: loadingInitial,
    error: errorInitial,
  } = useChatbotSpecificCall();

  const {
    postChatbotConversationSpecificCall,
    loading: loadingContinue,
    error: errorContinue,
  } = useChatbotConversationSpecificCall();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      let response;

      if (isFirstMessage) {
        // First message - use useChatbotSpecificCall
        console.log(
          'Sending first message with conversationId:',
          conversationId
        );
        response = await postChatbotSpecificCall(
          userMessage.text,
          conversationId
        );

        if (response && response.id) {
          setIsFirstMessage(false);
          setLastResponseId(response.id);
          console.log('First message successful, response ID:', response.id);
        }
      } else {
        // Subsequent messages - use useChatbotConversationSpecificCall
        if (!lastResponseId) {
          console.error(
            'No previous response ID available for conversation continuation'
          );
          throw new Error('No previous response ID available');
        }

        console.log(
          'Sending continuation message with responseId:',
          lastResponseId,
          'conversationId:',
          conversationId
        );
        response = await postChatbotConversationSpecificCall(
          userMessage.text,
          conversationId,
          lastResponseId
        );

        if (response && response.id) {
          setLastResponseId(response.id);
          console.log(
            'Continuation message successful, new response ID:',
            response.id
          );
        }
      }

      if (response && response.response) {
        const botMessage: Message = {
          id: response.id || `bot-${Date.now()}`,
          text: response.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response received from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Create error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Reset state on error to allow retry
      if (isFirstMessage) {
        setIsFirstMessage(true);
        setLastResponseId(null);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setMessages([]);
    setInputValue('');
    setIsFirstMessage(true);
    setLastResponseId(null);
    onClose();
  };

  const isLoading = loadingInitial || loadingContinue;
  const currentError = errorInitial || errorContinue;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '600px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Asistente para esta llamada</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 0 }}
      >
        <Typography variant="subtitle2" sx={{ pl: 3 }}>
          Este chatbot unicamente tiene contexto para esta llamada. Para obtener
          un mayor contexto use el apartado del chatbot
        </Typography>
        {/* Messages Container */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                ¡Hola! Soy tu asistente para esta llamada. ¿En qué puedo
                ayudarte?
              </Typography>
            </Box>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.isUser ? '#13202A' : '#F5F5F5',
                  color: message.isUser ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    display: 'block',
                    mt: 0.5,
                    fontSize: '0.7rem',
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: '#F5F5F5' }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>
                  Escribiendo...
                </Typography>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Error Display */}
        {currentError && (
          <Box sx={{ p: 2, backgroundColor: '#ffebee' }}>
            <Typography color="error" variant="body2">
              {currentError}
            </Typography>
          </Box>
        )}

        {/* Debug Info */}
        {/* {process.env.NODE_ENV === 'development' && (
          <Box sx={{ p: 1, backgroundColor: '#f0f0f0', fontSize: '0.8rem' }}>
            <Typography variant="caption">
              Debug: isFirstMessage={isFirstMessage.toString()}, lastResponseId={lastResponseId || 'null'}
            </Typography>
          </Box>
        )} */}

        {/* Input Container */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="contained"
              sx={{ minWidth: 'auto', px: 2, backgroundColor: '#13202A' }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotPopup;
