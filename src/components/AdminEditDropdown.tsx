import { useUser } from '@/context/UserContext';
import { Select, MenuItem } from '@mui/material';
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
    return <p>{value}</p>;
  }
  return (
    <Select value={role} onChange={(e) => handleChangeRole(e.target.value)}>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default DropDown;
