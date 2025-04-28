'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { Divider } from '@mui/material';

type Props = {
  label: string;
  defaultValue?: string;
  sx?: SxProps<Theme>;
  divider?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  value?: string;
};
export default function MultilineTextFields({
  label,
  defaultValue,
  sx,
  divider = true,
  onChange,
  onKeyDown,
  value,
}: Props) {
  return (
    <Paper
      elevation={3}
      sx={{ p: 0, ...sx, display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant="body1" fontWeight={800} sx={{ my: 1, ml: '2rem' }}>
        {label}
      </Typography>
      {divider && <Divider />}
      <Box sx={{ flexGrow: 1, px: '2rem' }}>
        <textarea
          value={value}
          defaultValue={defaultValue}
          autoCapitalize="on"
          autoCorrect="on"
          onChange={onChange}
          onKeyDown={onKeyDown}
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            padding: 0,
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
          }}
        />
      </Box>
    </Paper>
  );
}
