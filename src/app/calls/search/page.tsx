'use client';

import * as React from 'react';
import MultipleSelectChip from '@/components/MultipleSelectChip';
import { useEffect, useRef } from 'react';
import { useFetchClients, Client } from '@/hooks/fetchClients';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import { useFetchCategories, Category } from '@/hooks/fetchCategories';
import { useFetchConversations } from '@/hooks/fetchConversations';
import Tag from '@/components/Tag';
import dayjs from 'dayjs';

export default function Home() {
  const { clients, loadingClients, errorClients, fetchClients } =
    useFetchClients();

  const { conversations, loadingConversations, fetchConversations } =
    useFetchConversations();
  const { categories, loadingCategories, errorCategories, fetchCategories } =
    useFetchCategories();
  const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs>(dayjs());

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [selectedClients, setSelectedClients] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState<string>('');

  const router = useRouter();

  useEffect(() => {
    fetchClients();
    fetchConversations();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      return;
    }

    const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
    const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');

    fetchConversations({
      clients: selectedClients,
      categories: selectedCategories,
      startDate: startDate,
      endDate: endDate,
      conversation_id: search,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedClients, selectedCategories, search]);

  const handleClick = (callId: string) => {
    router.push(`/calls/detail?call_id=${callId}`);
  };

  return (
    <div className="relative lg:left-64 top-32 w-full xl:w-75/100 min-h-screen flex flex-col md:justify-around md:flex-row gap-2 m-2">
      <div className="w-3/10 flex flex-col align-center text-center">
        <div className="text-white bg-[#1E242B] rounded-md mb-5 ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
              }}
              views={['month', 'year']}
              openTo="month"
              className="bg-[#1E242B] rounded-md w-1/1"
            />
          </LocalizationProvider>
        </div>
        <MultipleSelectChip
          title={
            loadingClients
              ? 'Cliente (Cargando...)'
              : errorClients
                ? 'Cliente (Error)'
                : 'Cliente'
          }
          names={(() => {
            if (loadingClients || errorClients || !clients) {
              return [];
            }
            return clients.map((client: Client) => ({
              id: client.user_id,
              name: client.username,
            }));
          })()}
          value={selectedClients}
          onChange={(newClients: string[]) => {
            setSelectedClients(newClients);
          }}
        />
        <MultipleSelectChip
          title={
            loadingCategories
              ? 'Categorías (Cargando...)'
              : errorCategories
                ? 'Categorías (Error)'
                : 'Categorías'
          }
          names={(() => {
            if (loadingCategories || errorCategories || !categories) {
              return [];
            }
            return categories.map((category: Category) => ({
              id: category.category_id,
              name: category.name,
            }));
          })()}
          value={selectedCategories}
          onChange={(newCategories: string[]) => {
            setSelectedCategories(newCategories);
          }}
        />
      </div>
      <div className="w-full md:w-[50%] flex flex-col divide-y-1 divide-solid divide-[#D0D0D0]">
        <TextField
          label="Buscar por ID"
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
          }}
          id="BuscarInput"
        />
        {loadingConversations ? (
          <CircularProgress />
        ) : (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="w-1/3">ID</TableCell>
                  <TableCell className="w-1/3">Fecha</TableCell>
                  <TableCell className="w-1/3">Categoría</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conversations.map((conversation) => (
                  <TableRow
                    key={conversation.conversation_id}
                    onClick={() => handleClick(conversation.conversation_id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>
                      <p>{conversation.conversation_id}</p>
                    </TableCell>
                    <TableCell>
                      <p>
                        {conversation.start_time
                          ? new Date(
                              conversation.start_time.toString()
                            ).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {conversation.category && (
                          <Tag
                            key={conversation.category}
                            text={conversation.category}
                          />
                        )}
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
