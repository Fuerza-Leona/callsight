import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SxProps } from '@mui/material/styles';


const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 }

]

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
