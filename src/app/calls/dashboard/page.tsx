'use client';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import SearchIcon from '@mui/icons-material/Search';
import { useFetchClients } from '@/hooks/fetchClients';
import { useEffect, useRef, useState } from 'react';
import { useFetchEmotions } from '@/hooks/fetchEmotions';
import { useFetchAgents } from '@/hooks/fetchAgents';
import { useFetchTopics } from '@/hooks/fetchTopics';
import { useFetchConversationsSummary } from '@/hooks/fetchConversationsSummary';
import { useFetchConversationsRatings } from '@/hooks/fetchConversationsRatings';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useFetchDashboardCompanies } from '@/hooks/fetchDashboardCompanies';
import { useUser } from '@/context/UserContext';
import { UploadFile } from '@mui/icons-material';
import { useFetchReport } from '@/hooks/useFetchReport';
import { useFetchTeams } from '@/hooks/fetchTeams';
import TeamsConnectButton from '@/components/TeamsConnectButton';
import TeamsStatusButton from '@/components/TeamsStatusButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import ActionButton from '@/components/ActionButton';
import MetricCard from '@/components/MetricCard';
import TopicsCard from '@/components/TopicsCard';
import Row from '@/components/Row';
import EmotionsCard from '@/components/EmotionsCard';
import RatingsCard from '@/components/RatingsCard';
import Column from '@/components/Column';
import FilterSidebar from '@/components/FilterSidebar';

export default function Home() {
  const { user } = useUser();

  const { clients, loadingClients, errorClients, fetchClients } =
    useFetchClients();

  const { emotions, loadingEmotions, errorEmotions, fetchEmotions } =
    useFetchEmotions();
  const { topics, loadingTopics, errorTopics, fetchTopics } = useFetchTopics();
  const { summary, loadingSummary, errorSummary, fetchConversationsSummary } =
    useFetchConversationsSummary();
  const { ratings, loadingRatings, errorRatings, fetchConversationsRatings } =
    useFetchConversationsRatings();

  const { agents, loadingAgents, errorAgents, fetchAgents } = useFetchAgents();

  const { companies, loadingCompanies, errorCompanies, fetchCompanies } =
    useFetchDashboardCompanies();

  const { loadingReport, fetchReport } = useFetchReport();

  const { meetings, loadingTeams, fetchTeams } = useFetchTeams();

  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  const isLoadingRef = useRef(false);

  useEffect(() => {
    const loadAllData = async () => {
      const promises = [fetchClients(), fetchCompanies()];

      if (user?.isConnected == true) {
        promises.push(fetchTeams());
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
    console.log(startDate, endDate);
    const params = {
      startDate,
      endDate,
      clients: selectedClients,
      agents: selectedAgents,
      companies: selectedCompanies,
    };

    const loadAllData = async () => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      try {
        await Promise.all([
          fetchConversationsRatings(params),
          fetchEmotions(params),
          fetchConversationsSummary(params),
          fetchTopics({ ...params, limit: 10 }),
        ]);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDate,
    selectedClients,
    selectedAgents,
    selectedCompanies,
    meetings,
  ]);

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

  return (
    <ProtectedRoute allowedRoles={['admin', 'agent']}>
      <div className="relative lg:left-64 pt-10 w-full lg:w-[calc(100%-17rem)] pl-3 pr-3">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <p className="text-4xl font-bold">Tablero</p>
          <div className="flex gap-2">
            <div>
              {user?.isConnected ? (
                <TeamsStatusButton
                  isLoading={loadingTeams}
                  meetings={meetings}
                />
              ) : (
                <TeamsConnectButton />
              )}
            </div>
            <div className="mr-2">
              <ExportPdfButton
                onClick={fetchReport}
                isLoading={loadingReport}
              />
            </div>
            <ActionButton
              href="/calls/upload"
              backgroundColor="#F294CD"
              icon={<UploadFile className="mx-2" />}
              text="Subir llamada"
              id="upload"
            />
            <ActionButton
              href="/calls/search"
              backgroundColor="var(--neoris-blue)"
              icon={<SearchIcon className="mx-1" />}
              text="Buscar llamada"
              id="search"
            />
          </div>
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
            <Row columns={3}>
              <MetricCard
                title="Tiempo promedio por llamada"
                value={summary?.average_minutes || 0}
                suffix=" minutos"
                loading={loadingSummary}
                error={!!errorSummary}
                id="average_time"
              />

              <MetricCard
                title="Total de llamadas"
                value={summary?.conversation_count || 0}
                suffix={` en ${dayjs(selectedDate).locale('es').format('DD MMMM YYYY')}`}
                loading={loadingSummary}
                error={!!errorSummary}
                id="total_calls"
              />

              <MetricCard
                title="Promedio de evaluación"
                value={
                  ratings && ratings.length > 0
                    ? (() => {
                        const totalCount = ratings.reduce(
                          (sum, item) => sum + item.count,
                          0
                        );
                        if (totalCount === 0) return '0.0';
                        const weightedSum = ratings.reduce(
                          (sum, item) => sum + item.rating * item.count,
                          0
                        );
                        return (weightedSum / totalCount).toFixed(1);
                      })()
                    : '0.0'
                }
                suffix={` de ${
                  ratings && ratings.length > 0
                    ? ratings.reduce((sum, item) => sum + item.count, 0)
                    : 0
                } reseñas`}
                loading={loadingRatings}
                error={!!errorRatings}
                id="average_rating"
              />
            </Row>

            <Row columns={1}>
              <TopicsCard
                title="Temas principales detectados"
                tooltipText="Nube de palabras que muestra los temas más frecuentes detectados en las conversaciones. Entre más grande y resaltada aparece una palabra o frase, mayor es su frecuencia."
                loading={loadingTopics}
                error={!!errorTopics}
                topics={topics}
                maxWords={15}
              />
            </Row>

            <Row columns={2}>
              <EmotionsCard
                title="Emociones del cliente"
                tooltipText="Gráfico de pastel que muestra la proporción de emociones detectadas del cliente en las conversaciones. Las emociones se clasifican en positivas, neutras y negativas."
                loading={loadingEmotions}
                error={!!errorEmotions}
                emotions={emotions}
              />

              <RatingsCard
                title="Evaluaciones del cliente"
                tooltipText="Barras que muestran la proporción de evaluaciones de los clientes en las conversaciones que participan. Las evaluaciones se clasifican del 1 al 5, donde 1 es la peor y 5 la mejor."
                loading={loadingRatings}
                error={!!errorRatings}
                ratings={ratings}
                maxRating={5}
              />
            </Row>
          </Column>
        </div>
      </div>
    </ProtectedRoute>
  );
}
