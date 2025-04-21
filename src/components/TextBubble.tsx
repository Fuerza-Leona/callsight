import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

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
        bgcolor: isUser ? '#13202A' : 'grey.200',
        color: isUser ? 'white' : 'black',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '75%',
        my: 1,
      }}
    >
      <Typography>{message}</Typography>
    </Paper>
  );
};

export default TextBubble;
