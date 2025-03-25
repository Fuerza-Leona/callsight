"use client";
import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, OutlinedInput, Chip, Button, TextField } from '@mui/material';

interface FormInputsProps {
    onFormSubmit: (data: { cliente: string; participantes: string[]; fecha: string }) => void;
}

// List of predefined participants (can be replaced with API data)
const participantList = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const FormInputs: React.FC<FormInputsProps> = ({ onFormSubmit }) => {
    const [cliente, setCliente] = useState('');
    const [fecha, setFecha] = useState('');
    const [participantes, setParticipantes] = useState<string[]>([]);

    // Handles selection change in the participants dropdown
    const handleParticipantsChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setParticipantes(typeof value === 'string' ? value.split(',') : value);
    };

    // Submits the form data
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onFormSubmit({ cliente, participantes, fecha });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Cliente Input */}
            <TextField
                label="Cliente"
                fullWidth
                margin="normal"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
            />

            {/* Fecha Input */}
            <TextField
                label="Fecha"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
            />

            {/* Multi-Select Participants */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Participantes</InputLabel>
                <Select
                    multiple
                    value={participantes}
                    onChange={handleParticipantsChange}
                    input={<OutlinedInput label="Participantes" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    {participantList.map((name) => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary">
                Guardar
            </Button>
        </form>
    );
};

export default FormInputs;
