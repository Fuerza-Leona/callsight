import { useUser } from '@/context/UserContext';
import { Select, MenuItem } from '@mui/material';
import { useState } from 'react';

interface DropdownProps {
  options: string[];
  value: string;
}

const DropDown: React.FC<DropdownProps> = ({ options, value }) => {
  const { user } = useUser();

  const [role, changeRole] = useState<string>(value);

  if (user?.role !== 'admin') {
    return <p>{value}</p>;
  }
  return (
    <Select value={role} onChange={(e) => changeRole(e.target.value)}>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default DropDown;
