import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

interface multipleProps {
    title: string;
    names: string[];
    value: string[];
    onChange: (value: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight: personName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}


export default function MultipleSelectChip(props: multipleProps) {
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<typeof props.value>) => {
        const {
            target: { value },
        } = event;
        props.onChange(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">
                    {props.title}
                </InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={props.value}
                    onChange={handleChange}
                    input={
                        <OutlinedInput
                            id="select-multiple-chip"
                            label={props.title}
                        />
                    }
                    renderValue={(selected) => (
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                            }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}>
                    {props.names && props.names.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, props.value, theme)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
