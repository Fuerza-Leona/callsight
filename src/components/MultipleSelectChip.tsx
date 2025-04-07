import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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

type ItemType = string | { id: string; name: string };

interface multipleProps {
    title: string;
    names: ItemType[];
    value: string[];
    onChange: (value: string[]) => void;
    }

function getStyles(item: ItemType, selectedItems: string[], theme: Theme) {
    const itemValue = typeof item === 'string' ? item : item.id;
    return {
        fontWeight: selectedItems.includes(itemValue)
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

    const getItemValue = (item: ItemType): string => {
        return typeof item === 'string' ? item : item.id;
    };

    const getItemLabel = (item: ItemType): string => {
        return typeof item === 'string' ? item : item.name;
    };

    const getItemById = (id: string): ItemType | undefined => {
        return props.names.find(item => 
            typeof item === 'string' ? item === id : item.id === id
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
                            {selected.map((value) => {
                                const item = getItemById(value);
                                return (
                                    <Chip 
                                        key={value} 
                                        label={item ? getItemLabel(item) : value} 
                                    />
                                );
                            })}
                        </Box>
                    )}
                    MenuProps={MenuProps}>
                    {props.names.map((item) => (
                        <MenuItem
                            key={getItemValue(item)}
                            value={getItemValue(item)}
                            style={getStyles(item, props.value, theme)}>
                            {getItemLabel(item)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}