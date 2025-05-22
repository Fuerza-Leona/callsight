import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SxProps } from '@mui/material/styles';

interface SearchBarProps {
  options: { label: string | null }[];
  label?: string;
  placeholder?: string;
  onSelect: (value: string | null) => void;
  sx?: SxProps;
}

//Combo box
export default function SearchBar({
  options,
  label,
  placeholder,
  onSelect,
}: SearchBarProps) {
  return (
    <Autocomplete
      id="search-bar"
      disablePortal
      options={options}
      onChange={(_, value) => onSelect(value ? value.label : null)}
      sx={{
        width: '100%',
        backgroundColor: '#E5E7Eb',
        border: 'none',
        boxShadow: 'none',
        color: 'black',
        borderRadius: '0.5rem',
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
          color: '#374151',
          border: 'none',
          boxShadow: 'none',
          '&::placeholder': {
            color: '#374151',
            opacity: 1,
          },
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '0.5rem',
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            style: { color: '#374151' },
            placeholder: placeholder,
          }}
        />
      )}
    />
  );
}
