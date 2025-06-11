import { TextField } from '@mui/material';

interface SearchFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
}

export default function SearchField({
  value,
  onChange,
  label = 'Buscar por ID',
  placeholder,
}: SearchFieldProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      fullWidth
    />
  );
}
