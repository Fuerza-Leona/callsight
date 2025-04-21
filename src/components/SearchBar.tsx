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
}: SearchBarProps) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      onChange={(_, value) => onSelect(value ? value.label : null)}
      className="border-black"
      sx={{
        width: '100%',
        backgroundColor: '#E5E7Eb',
        border: 'none',
        boxShadow: 'none',
        color: 'black',
        '& .MuiInputLabel-root': {
          border: 'none',
        },
        '& .Mui-focused': {
          color: 'black',
          border: 'none',
        },
        'label + &': {
          border: 'none',
          boxShadow: 'none',
        },
        '& .MuiInputBase-input': {
          backgroundColor: '#E5E7Eb',
          color: 'black',
          border: 'none',
          boxShadow: 'none',
        },
        '&:focus': {
          borderRadius: 4,
          border: 'none',
          boxShadow: 'none',
        },
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
