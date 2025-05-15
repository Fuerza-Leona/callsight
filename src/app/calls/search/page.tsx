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
import { useFetchConversations } from '@/hooks/fetchConversations';
import Tag from '@/components/Tag';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Agent, useFetchAgents } from '@/hooks/fetchAgents';
import {
  Company,
  useFetchDashboardCompanies,
} from '@/hooks/fetchDashboardCompanies';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const { clients, loadingClients, errorClients, fetchClients } =
    useFetchClients();
  const { agents, loadingAgents, errorAgents, fetchAgents } = useFetchAgents();

  const { companies, loadingCompanies, errorCompanies, fetchCompanies } =
    useFetchDashboardCompanies();

  const { conversations, loadingConversations, fetchConversations } =
    useFetchConversations();

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const initialFetchDone = useRef<boolean>(false);
  const initialLoadCompleted = useRef<boolean>(false);

  useEffect(() => {
    const loadAllData = async () => {
      const promises = [];

      if (user?.role !== 'client') {
        promises.push(fetchClients());
      }

      if (user?.role === 'admin') {
        promises.push(fetchAgents());
      }

      if (user?.role !== 'client') {
        promises.push(fetchCompanies());
      }

      await Promise.all(promises);
    };

    loadAllData();

    initialLoadCompleted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchConversations();
      initialFetchDone.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialLoadCompleted.current) return;
    if (!filtersChanged) return;

    const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
    const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');

    fetchConversations({
      clients: selectedClients,
      agents: selectedAgents,
      companies: selectedCompanies,
      startDate: startDate,
      endDate: endDate,
      conversation_id: search,
    });

    setFiltersChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersChanged]);

  const handleClick = (callId: string) => {
    window.open(`/calls/detail?call_id=${callId}`, '_blank');
  };

  const handleDateChange = (newDate: dayjs.Dayjs) => {
    setSelectedDate(newDate);
    setFiltersChanged(true);
  };

  const handleClientsChange = (newClients: string[]) => {
    setSelectedClients(newClients);
    setFiltersChanged(true);
  };

  const handleAgentsChange = (newAgents: string[]) => {
    setSelectedAgents(newAgents);
    setFiltersChanged(true);
  };

  const handleCompaniesChange = (newCompanies: string[]) => {
    setSelectedCompanies(newCompanies);
    setFiltersChanged(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setFiltersChanged(true);
  };

  return (
    <ProtectedRoute>
      <div className="relative lg:left-64 top-8 w-[96%] lg:w-[calc(100%-17rem)]  flex flex-col md:justify-around md:flex-row gap-3  pl-3">
        <div className="flex flex-col align-center text-center gap-2">
          <button
            className=" bg-[#13202A] text-white w-[200px] mt-2 py-2 rounded-lg hover:bg-[#1b2c3d] transition-colors cursor-pointer"
            onClick={() => router.push('/calls/dashboard')}
          >
            ← Regresar al tablero
          </button>

          <div className="text-white bg-[#1E242B] rounded-md mb-5 mt-4">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                views={['month']}
                openTo="month"
                className="bg-[#1E242B] rounded-md w-1/1"
              />
            </LocalizationProvider>
          </div>
          {user?.role !== 'client' && (
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
          )}

          {user?.role === 'admin' && (
            <div className="">
              <MultipleSelectChip
                title={
                  loadingAgents
                    ? 'Empleados (Cargando...)'
                    : errorAgents
                      ? 'Empleados (Error)'
                      : 'Empleados'
                }
                names={(() => {
                  if (loadingAgents || errorAgents || !agents) {
                    return [];
                  }
                  return agents.map((agent: Agent) => ({
                    id: agent.user_id,
                    name: agent.username,
                  }));
                })()}
                value={selectedAgents}
                onChange={handleAgentsChange}
              />
            </div>
          )}

          {user?.role !== 'client' && (
            <div className="">
              <MultipleSelectChip
                title={
                  loadingCompanies
                    ? 'Empresas (Cargando...)'
                    : errorCompanies
                      ? 'Empresas (Error)'
                      : 'Empresas'
                }
                names={(() => {
                  if (loadingCompanies || errorCompanies || !companies) {
                    return [];
                  }
                  return companies.map((company: Company) => ({
                    id: company.company_id,
                    name: company.name,
                  }));
                })()}
                value={selectedCompanies}
                onChange={handleCompaniesChange}
              />
            </div>
          )}
        </div>
        <div className="w-full md:w-[80%] flex flex-col divide-y-1 divide-solid divide-[#D0D0D0]">
          <TextField
            label="Buscar por ID"
            value={search}
            onChange={handleSearchChange}
          />
          {loadingConversations ? (
            <div className="flex justify-center items-center w-full pt-20">
              <CircularProgress size={100} thickness={4} />
            </div>
          ) : (
            <div
              className="overflow-auto mt-4"
              style={{
                maxHeight: 'calc(100vh - 12rem)',
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
                    <TableCell className="w-2/6">
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell align="center" className="w-1/12">
                      <strong>Fecha</strong>
                    </TableCell>
                    <TableCell align="center" className="w-1/12">
                      <strong>Participantes</strong>
                    </TableCell>
                    <TableCell align="center" className="w-1/6">
                      <strong>Empresa</strong>
                    </TableCell>
                    <TableCell align="center" className="w-1/6">
                      <strong>Categoría</strong>
                    </TableCell>
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
                      <TableCell align="center">
                        <p>
                          {conversation.start_time
                            ? new Date(
                                conversation.start_time.toString()
                              ).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex flex-wrap justify-center">
                          {conversation.participants}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex flex-wrap justify-center">
                          {conversation.company}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex flex-wrap justify-center">
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
