import React from 'react';
import { Box, Typography } from '@mui/material';

interface WordCloudProps {
  words: {
    text: string;
    value: number;
  }[];
  maxWords?: number;
}

const SimpleWordCloud: React.FC<WordCloudProps> = ({ words = [], maxWords = 30 }) => {
  // Handle empty or invalid input
  if (!Array.isArray(words) || words.length === 0) {
    return <Box>No hay temas disponibles</Box>;
  }

  // Take only the top N words
  const displayWords = words
    .slice(0, maxWords)
    .sort((a, b) => b.value - a.value);

  // Find the max value for scaling
  const maxValue = Math.max(...displayWords.map(word => word.value));
  
  // Set of colors to make the cloud more visually interesting
  const colors = ['#1976d2', '#2196f3', '#64b5f6', '#0d47a1', '#42a5f5'];
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        padding: 2,
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {displayWords.map((word, index) => {
        // Calculate font size based on frequency (between 1 and 5 rem)
        const fontSize = 1 + ((word.value / maxValue) * 3);
        // Randomly select rotation angle for some words
        // Get a color from our palette based on index
        const color = colors[index % colors.length];
        
        return (
          <Typography
            key={index}
            sx={{
              fontSize: `${fontSize}rem`,
              padding: '0.3rem',
              fontWeight: word.value > maxValue/2 ? 'bold' : 'normal',
              color: color,
              margin: '0.2rem',
              lineHeight: 1,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)',
                color: '#ff5722'
              },
            }}
            title={`${word.text}: ${word.value}`}
          >
            {word.text}
          </Typography>
        );
      })}
    </Box>
  );
};

export default SimpleWordCloud;