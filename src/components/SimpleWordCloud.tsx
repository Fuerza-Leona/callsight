import React from 'react';
import { Box, Chip } from '@mui/material';

interface WordCloudProps {
  words: {
    text: string;
    value: number;
  }[];
  maxWords?: number;
}

const SimpleWordCloud: React.FC<WordCloudProps> = ({
  words = [],
  maxWords = 30,
}) => {
  // Handle empty or invalid input
  if (!Array.isArray(words) || words.length === 0) {
    return <Box>No hay temas disponibles</Box>;
  }

  // Take only the top N words
  const displayWords = words
    .slice(0, maxWords)
    .sort((a, b) => b.value - a.value);

  // Find the max value for scaling
  const maxValue = Math.max(...displayWords.map((word) => word.value));

  return (
    <div
      id="word-cloud"
      className="flex justify-content-left flex-wrap gap-2 mt-5"
    >
      {displayWords.map((word, index) => {
        // Calculate the relative importance (0-1 range)
        const importance = word.value / maxValue;

        // Updated colors to match the image exactly
        const backgroundColor = '#f0f5fe'; // Lighter blue-gray background

        // Text color based on importance - matching the image
        const textColor =
          importance > 0.7
            ? '#0e47a1' // Dark blue for important items
            : importance > 0.4
              ? '#4169e1' // Medium blue for average items
              : '#333333'; // Dark gray/near black for less important items

        // Font size differences based on importance but with smaller variations
        const fontSize = 0.9 + importance * 0.1;

        // Font weight
        const fontWeight =
          importance > 0.7 ? 600 : importance > 0.4 ? 500 : 400;

        return (
          <Chip
            key={index}
            label={word.text}
            sx={{
              fontSize: `${fontSize}rem`,
              fontWeight: fontWeight,
              backgroundColor: backgroundColor,
              color: textColor,
              borderRadius: '20px', // More rounded to match the image
              padding: '4px 0',
              height: 'auto',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)', // Adding subtle shadow to match image
              '& .MuiChip-label': {
                padding: '6px 14px', // Slight adjustment to padding
                whiteSpace: 'normal',
                lineHeight: 1.5,
              },
            }}
            title={`${word.text}: ${word.value}`}
            onClick={() => {}}
          />
        );
      })}
    </div>
  );
};

export default SimpleWordCloud;
