'use client';

import * as React from 'react';
import MultipleSelectChip from '@/components/MultipleSelectChip';
import { useEffect, useRef, useState } from 'react';
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
import 'dayjs/locale/es';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  const { clients, loadingClients, errorClients, fetchClients } =
    useFetchClients();
  const { conversations, loadingConversations, fetchConversations } =
    useFetchConversations();
  const { categories, loadingCategories, errorCategories, fetchCategories } =
    useFetchCategories();

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  // Track if filters have been changed by user
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const initialFetchDone = useRef<boolean>(false);
  const initialLoadCompleted = useRef<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    fetchClients();

    fetchCategories();
    initialLoadCompleted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate effect for initial conversations fetch - runs only once
  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchConversations();
      initialFetchDone.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes after initial load
  useEffect(() => {
    if (!initialLoadCompleted.current) return;
    if (!filtersChanged) return;

    const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
    const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');

    fetchConversations({
      clients: selectedClients,
      categories: selectedCategories,
      startDate: startDate,
      endDate: endDate,
      conversation_id: search,
    });

    setFiltersChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersChanged]);

  const handleClick = (callId: string) => {
    router.push(`/calls/detail?call_id=${callId}`);
  };

  const handleDateChange = (newDate: dayjs.Dayjs) => {
    setSelectedDate(newDate);
    setFiltersChanged(true);
  };

  const handleClientsChange = (newClients: string[]) => {
    setSelectedClients(newClients);
    setFiltersChanged(true);
  };

  const handleCategoriesChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
    setFiltersChanged(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setFiltersChanged(true);
  };

  return (
    <ProtectedRoute>
      <div className="relative lg:left-64 top-32 w-full xl:w-75/100 flex flex-col md:justify-around md:flex-row gap-2">
        <div className="w-3/10 flex flex-col align-center text-center">
          <div className="text-white bg-[#1E242B] rounded-md mb-5 ">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
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
            onChange={handleClientsChange}
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
            onChange={handleCategoriesChange}
          />
        </div>
        <div className="w-full md:w-[50%] flex flex-col divide-y-1 divide-solid divide-[#D0D0D0]">
          <TextField
            label="Buscar por ID"
            value={search}
            onChange={handleSearchChange}
          />
          {loadingConversations ? (
            <div className="flex justify-center items-center w-full h-[400px]">
              <CircularProgress size={100} thickness={4} />
            </div>
          ) : (
            <div
              className="overflow-auto mt-8"
              style={{
                maxHeight: '500px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#1E242B',
              }}
            >
              <style jsx global>{`
                /* Webkit browsers (Chrome, Safari) */
                .overflow-auto::-webkit-scrollbar {
                  width: 10px;
                }
                .overflow-auto::-webkit-scrollbar-track {
                  background: #f3f4f6;
                  border-radius: 10px;
                }
                .overflow-auto::-webkit-scrollbar-thumb {
                  background: #1e242b;
                  border-radius: 10px;
                  border: 2px solid #f3f4f6;
                }
                .overflow-auto::-webkit-scrollbar-thumb:hover {
                  background: #1e242b;
                }
              `}</style>

              <Table stickyHeader>
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
    </ProtectedRoute>
  );
}
