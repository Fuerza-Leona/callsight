import { useUser } from '@/context/UserContext';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';

import { useFetchAgentRoles } from '@/hooks/useFetchRoles';

interface DropdownProps {
  options: string[];
  value: string;
  appliedUser: string;
}

const DropDown: React.FC<DropdownProps> = ({ options, value, appliedUser }) => {
  const { user } = useUser();

  const [role, changeRole] = useState<string>(value);

  const { changeRole: changeRoleDB, loading, error } = useFetchAgentRoles();

  const handleChangeRole = (role: string) => {
    changeRoleDB(appliedUser, role);
    if (!loading && !error) {
      changeRole(role);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Typography
        variant="body1"
        sx={{
          padding: '8px 12px',
          borderRadius: 1,
          bgcolor: 'grey.100',
          display: 'inline-block',
        }}
      >
        {value}
      </Typography>
    );
  }

  return (
    <Box component="div" sx={{ minWidth: 100, position: 'relative' }}>
      <FormControl fullWidth disabled={loading}>
        <InputLabel id="role-select-label">Role</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={role}
          label="Role"
          onChange={(e: SelectChangeEvent<string>) =>
            handleChangeRole(e.target.value)
          }
          sx={{
            '& .MuiSelect-select': {
              paddingY: '12px',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              sx={{
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            position: 'absolute',
            right: -28,
            top: '50%',
            marginTop: '-10px',
          }}
        />
      )}
      {typeof error === 'string' && (
        <Typography
          color="error"
          variant="caption"
          sx={{
            position: 'absolute',
            left: 0,
            bottom: -20,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DropDown;
