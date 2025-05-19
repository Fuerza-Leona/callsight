import React from 'react';
import Paper from '@mui/material/Paper';
import ReactMarkdown from 'react-markdown';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type Props = {
  message: string;
  isUser?: boolean;
};

const TextBubble = ({ message, isUser = false }: Props) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: isUser ? '#13202A' : 'gray.100',
        color: isUser ? 'white' : 'black',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '75%',
        my: 1,
        overflowWrap: 'break-word',
      }}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <Typography variant="body1" sx={{ mb: 1 }}>
              {children}
            </Typography>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700 }}>{children}</strong>
          ),
          li: ({ children }) => (
            <li>
              <Typography component="span" variant="body1">
                {children}
              </Typography>
            </li>
          ),
          ul: ({ children }) => (
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              {children}
            </Box>
          ),
          ol: ({ children }) => (
            <Box component="ol" sx={{ pl: 3, mb: 2 }}>
              {children}
            </Box>
          ),
        }}
      >
        {message}
      </ReactMarkdown>
    </Paper>
  );
};

export default TextBubble;
