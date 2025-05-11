'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { Divider, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useUser } from '@/context/UserContext';

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
  const [age, setAge] = React.useState('');
  const [person, setPerson] = React.useState('');
  const { user } = useUser();
  const isClient = user?.role === 'client';

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  const handleChangePerson = (event: SelectChangeEvent) => {
    setPerson(event.target.value);
  };
  return (
    <Paper
      elevation={3}
      sx={{ p: 0, ...sx, display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex justify-around items-center">
        <Typography variant="body1" fontWeight={800} sx={{ my: 1, ml: '2rem' }}>
          {label}
        </Typography>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={age}
          label="Estado"
          onChange={handleChange}
          className="w-[30%] h-[80%]"
          disabled={isClient}
        >
          <MenuItem value={10}>Activo</MenuItem>
          <MenuItem value={20}>En progreso</MenuItem>
          <MenuItem value={30}>Cerrado</MenuItem>
        </Select>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={person}
          label="Assigned to"
          onChange={handleChangePerson}
          className="w-[30%] h-[80%]"
          disabled={isClient}
        >
          <MenuItem value="">Unassigned</MenuItem>
          <MenuItem value={10}>Juan</MenuItem>
          <MenuItem value={20}>Sofia</MenuItem>
          <MenuItem value={30}>Cerrado</MenuItem>
        </Select>
      </div>
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
