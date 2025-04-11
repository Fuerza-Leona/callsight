import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SxProps } from '@mui/material/styles';

interface SearchBarProps {
  options: { label: string }[];
  label: string;
  onSelect: (value: string | null) => void;
  sx?: SxProps;
}

//Combo box
export default function SearchBar({
  options,
  label,
  onSelect,
  sx = {},
}: SearchBarProps) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      onChange={(_, value) => onSelect(value ? value.label : null)}
      sx={sx}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
