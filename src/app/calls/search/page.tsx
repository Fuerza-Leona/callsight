'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useFetchClients } from '@/hooks/fetchClients';
import { useFetchConversations } from '@/hooks/fetchConversations';
import { useFetchAgents } from '@/hooks/fetchAgents';
import { useFetchDashboardCompanies } from '@/hooks/fetchDashboardCompanies';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import FilterSidebar from '@/components/FilterSidebar';
import Column from '@/components/Column';
import CallsTable from '@/components/CallsTable';
import SearchField from '@/components/SearchField';

export default function Home() {
  const { user } = useUser();

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

  const isLoadingRef = useRef(false);

  useEffect(() => {
    const loadAllData = async () => {
      const promises = [];

      if (user?.role !== 'client') {
        promises.push(fetchClients());
        promises.push(fetchCompanies());
      }

      if (user?.role === 'admin') {
        promises.push(fetchAgents());
      }

      await Promise.all(promises);
    };

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const startDate = selectedDate
      .startOf('date')
      .format('YYYY-MM-DD::HH:mm:ss');
    const endDate = selectedDate.endOf('date').format('YYYY-MM-DD::HH:mm:ss');

    const params = {
      startDate,
      endDate,
      clients: selectedClients,
      agents: selectedAgents,
      companies: selectedCompanies,
      conversation_id: search || null,
    };

    const loadConversations = async () => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      try {
        await fetchConversations(params);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDate,
    selectedClients,
    selectedAgents,
    selectedCompanies,
    search,
  ]);

  const handleClick = (callId: string) => {
    window.open(`/calls/detail?call_id=${callId}`, '_blank');
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleClientsChange = (newClients: string[]) => {
    setSelectedClients(newClients);
  };

  const handleAgentsChange = (newAgents: string[]) => {
    setSelectedAgents(newAgents);
  };

  const handleCompaniesChange = (newCompanies: string[]) => {
    setSelectedCompanies(newCompanies);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'agent', 'client']}>
      <div className="relative lg:left-64 pt-10 w-full lg:w-[calc(100%-17rem)] pl-3 pr-3">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <p className="text-4xl font-bold">Llamadas</p>
        </div>

        <div className="relative w-[100%] flex flex-col md:flex-row gap-3">
          <FilterSidebar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            agents={agents}
            loadingAgents={loadingAgents}
            errorAgents={!!errorAgents}
            selectedAgents={selectedAgents}
            onAgentsChange={handleAgentsChange}
            companies={companies}
            loadingCompanies={loadingCompanies}
            errorCompanies={!!errorCompanies}
            selectedCompanies={selectedCompanies}
            onCompaniesChange={handleCompaniesChange}
            clients={clients}
            loadingClients={loadingClients}
            errorClients={!!errorClients}
            selectedClients={selectedClients}
            onClientsChange={handleClientsChange}
          />

          <Column width="full" gap="3">
            <SearchField value={search} onChange={handleSearchChange} />

            <CallsTable
              conversations={conversations}
              loading={loadingConversations}
              onCallClick={handleClick}
            />
          </Column>
        </div>
      </div>
    </ProtectedRoute>
  );
}
