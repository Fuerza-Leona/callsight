import React from 'react';
import Paper from '@mui/material/Paper';

type Props = {
  index: number;
  message: string | React.ReactNode;
  isUser?: boolean;
};

const TextBubble = ({ message, isUser = false, index }: Props) => {
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
      }}
    >
      <div id={`message_${index}`} className="sx:pre-wrap">
        {message}
      </div>
    </Paper>
  );
};

export default TextBubble;
