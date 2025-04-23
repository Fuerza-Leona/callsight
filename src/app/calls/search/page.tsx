'use client';

import * as React from 'react';
import MultipleSelectChip from '@/components/MultipleSelectChip';
import { useEffect } from 'react';
import { useFetchClients } from '@/hooks/fetchClients';
import { useFetchLlamadas } from '@/hooks/fetchLlamadas';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useFetchCategories } from '@/hooks/fetchCategories';
import Tag from '@/components/Tag';

export default function Home() {
  const { clients, fetchClients } = useFetchClients();
  const { dataLlamadas, refetchLlamadas } = useFetchLlamadas();
  const { categories, fetchCategories } = useFetchCategories();
  const router = useRouter();

  useEffect(() => {
    fetchClients();
    refetchLlamadas();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [selectedClients, setSelectedClients] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState<string>('');

  const handleClick = (callId: string) => {
    router.push(`/calls/detail?call_id=${callId}`);
  };

  return (
    <div className="relative lg:left-64 top-32 w-full xl:w-75/100 min-h-screen flex flex-col md:justify-around md:flex-row gap-2 m-2">
      <div className="w-3/10 flex flex-col align-center text-center">
        <p className="text-3xl">Filtros</p>
        <MultipleSelectChip
          title="Cliente"
          names={clients ? clients.map((client) => client.username) : []}
          value={selectedClients}
          onChange={setSelectedClients}
        />
        <MultipleSelectChip
          title="Categorías"
          names={categories ? categories.map((category) => category.name) : []}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>
      <div className="w-full md:w-[50%] flex flex-col divide-y-1 divide-solid divide-[#D0D0D0]">
        <TextField
          className="w-[80%]"
          label="Buscar"
          variant="outlined"
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
          }}
          id="BuscarInput"
        />
        {!dataLlamadas.llamadas ? (
          <CircularProgress />
        ) : (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="w-1/3">Nombre</TableCell>
                  <TableCell className="w-1/3">Fecha</TableCell>
                  <TableCell className="w-1/3">Categorías</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLlamadas.llamadas.map((llamada) => (
                  <TableRow
                    key={llamada.audio_id}
                    onClick={() => handleClick(llamada.conversation_id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>
                      <p>{llamada.conversation_id}</p>
                    </TableCell>
                    <TableCell>
                      <p>
                        {llamada.start_time
                          ? new Date(
                              llamada.start_time.toString()
                            ).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(llamada.categories) &&
                          llamada.categories.map((category: string) => (
                            <Tag key={category} text={category} />
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
