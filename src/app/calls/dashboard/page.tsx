'use client';
import { PieChart } from '@mui/x-charts/PieChart';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Link from 'next/link';
import MultipleSelectChip from '@/components/MultipleSelectChip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import { useFetchClients, Client } from '@/hooks/fetchClients';
import { useEffect, useRef, useState } from 'react';
import { useFetchEmotions } from '@/hooks/fetchEmotions';
import { useFetchAgents, Agent } from '@/hooks/fetchAgents';
import { useFetchTopics } from '@/hooks/fetchTopics';
import SimpleWordCloud from '@/components/SimpleWordCloud';
import { useFetchConversationsSummary } from '@/hooks/fetchConversationsSummary';
import { useFetchConversationsRatings } from '@/hooks/fetchConversationsRatings';
import {
  Box,
  Typography,
  LinearProgress,
  styled,
  CircularProgress,
} from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  useFetchDashboardCompanies,
  Company,
} from '@/hooks/fetchDashboardCompanies';
import { useUser } from '@/context/UserContext';

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

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

  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  const isLoadingRef = useRef(false);

  useEffect(() => {
    const loadAllData = async () => {
      const promises = [fetchClients(), fetchCompanies()];

      if (user?.role === 'admin') {
        promises.push(fetchAgents());
      }

      await Promise.all(promises);
    };

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
    const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');
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
  }, [selectedDate, selectedClients, selectedAgents, selectedCompanies]);

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
              <button
                className="text-[#FFFFFF] rounded-md p-2 w-full"
                style={{ backgroundColor: 'var(--sky-blue)' }}
              >
                Exportar como PDF <FileDownloadIcon />
              </button>
            </div>
            <Link
              href={'/calls/search'}
              className="text-[#FFFFFF] rounded-md block"
              id="search"
            >
              <div
                className="p-2 items-center justify-center text-center flex rounded-md"
                style={{ backgroundColor: 'var(--neoris-blue)' }}
              >
                <p className="">
                  Buscar conversación <SearchIcon />
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="relative w-[100%] flex flex-col md:flex-row gap-3">
          <div className="flex flex-col align-center text-center gap-2">
            <div className="text-white bg-[#1E242B] rounded-md mb-5">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="es"
              >
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  views={['month']}
                  openTo="month"
                  className="bg-[#1E242B] rounded-md w-1/1"
                />
              </LocalizationProvider>
            </div>
            <div className="">
              <MultipleSelectChip
                id="clients"
                title={
                  loadingClients
                    ? 'Clientes (Cargando...)'
                    : errorClients
                      ? 'Clientes (Error)'
                      : 'Clientes'
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
            </div>
            {user?.role === 'admin' && (
              <div className="">
                <MultipleSelectChip
                  id="agents"
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
            <div className="">
              <MultipleSelectChip
                id="companies"
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
          </div>

          <div className="w-full lg:w-[100%] md:w-[80%] flex flex-col gap-3">
            <div className="flex w-full gap-4 text-center pb-1">
              <div
                className="w-[33%] rounded-md flex flex-col items-left justify-left gap-3 p-3 shadow-md"
                style={{ backgroundColor: 'white', height: '110px' }}
              >
                <div className="flex gap-2 text-md items-left font-bold">
                  <h1>Tiempo promedio por llamada</h1>
                </div>
                <div className="text-5xl font-bold flex justify-left items-left h-16 flex-grow">
                  {loadingSummary ? (
                    <div className="flex items-center justify-left w-full">
                      <CircularProgress size={40} />
                    </div>
                  ) : errorSummary ? (
                    <span className="text-2xl text-red-500">Error</span>
                  ) : (
                    <div id="average_time">
                      {summary?.average_minutes || 0}
                      <span className="text-sm pl-2 font-light"> minutos</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="w-[33%] shadow-md rounded-md flex flex-col items-left justify-left items-left gap-3 p-3"
                style={{ backgroundColor: 'white', height: '110px' }}
              >
                <div className="flex gap-2 text-md items-left font-bold">
                  <h1>Total de llamadas</h1>
                </div>
                <div className="text-5xl font-bold flex justify-left items-left h-16 flex-grow">
                  {loadingSummary ? (
                    <div className="flex items-center justify-left w-full">
                      <CircularProgress size={40} />
                    </div>
                  ) : errorSummary ? (
                    <span className="text-2xl text-red-500">Error</span>
                  ) : (
                    <div id="total_calls">
                      {summary?.conversation_count || 0}
                      <span className="text-sm pl-2 font-light">
                        {' '}
                        en{' '}
                        {dayjs(selectedDate).locale('es').format('MMMM YYYY')}
                      </span>{' '}
                    </div>
                  )}
                </div>
              </div>
              <div
                className="w-[33%] shadow-md rounded-md flex flex-col items-left justify-left items-left gap-3 p-3"
                style={{ backgroundColor: 'white', height: '110px' }}
              >
                <div className="flex gap-2 text-md items-left font-bold">
                  <h1>Promedio de evaluación</h1>
                </div>
                <div className="text-5xl font-bold flex justify-left items-left h-16 flex-grow">
                  {loadingRatings ? (
                    <div className="flex items-center justify-left w-full">
                      <CircularProgress size={40} />
                    </div>
                  ) : errorRatings ? (
                    <span className="text-3xl text-red-500">Error</span>
                  ) : (
                    <div id="average_rating">
                      {ratings && ratings.length > 0
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
                        : '0.0'}
                      <span className="text-sm pl-2 font-light">
                        {' '}
                        de{' '}
                        {ratings && ratings.length > 0
                          ? ratings.reduce((sum, item) => sum + item.count, 0)
                          : 0}{' '}
                        reseñas
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="w-full shadow-md rounded-md bg-white p-5"
              style={{ minHeight: '260px' }}
            >
              <h1 className="text-lg font-bold ">
                Temas principales detectados
              </h1>

              <Box
                sx={{
                  width: '100%',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'left',
                }}
              >
                {loadingTopics ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="150px"
                  >
                    <CircularProgress size={60} />
                  </Box>
                ) : errorTopics ? (
                  <p className=" mt-3">Error al cargar los temas principales</p>
                ) : !topics || topics.length == 0 ? (
                  <p className=" mt-3">No hay temas principales</p>
                ) : (
                  <SimpleWordCloud
                    words={topics.map((topic) => ({
                      text: topic.topic,
                      value: topic.amount,
                    }))}
                    maxWords={15}
                  />
                )}
              </Box>
            </div>

            <div className="flex flex-col md:flex-row justify-between w-full gap-3 pt-1">
              <div
                className="h-full shadow-md rounded-md bg-white p-5 w-full md:w-[49%]"
                style={{ minHeight: '300px' }}
              >
                <h1 className="text-lg font-bold pb-2">
                  Emociones del cliente
                </h1>

                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {loadingEmotions ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                      height="200px"
                    >
                      <CircularProgress size={60} />
                    </Box>
                  ) : errorEmotions ? (
                    <p>Error al cargar las emociones</p>
                  ) : !emotions || emotions.negative == null ? (
                    <p>No hay información disponible</p>
                  ) : (
                    <PieChart
                      series={[
                        {
                          arcLabel: (item) => `${item.value}`,
                          data: [
                            {
                              id: 0,
                              value: emotions.positive ?? 0,
                              label: 'Positivo',
                            },
                            {
                              id: 1,
                              value: emotions.neutral ?? 0,
                              label: 'Neutro',
                            },
                            {
                              id: 2,
                              value: emotions.negative ?? 0,
                              label: 'Negativo',
                            },
                          ],
                        },
                      ]}
                      width={350}
                      height={200}
                      className="font-bold text-xl pt-5"
                      colors={['#6564DB', '#F6CF3C', '#F294CD']}
                    />
                  )}
                </Box>
              </div>
              <div
                className="h-full shadow-md rounded-md bg-white p-5 w-full md:w-[49%]"
                style={{ minHeight: '300px' }}
              >
                <h1 className="text-lg font-bold pb-4">
                  Evaluaciones del cliente
                </h1>

                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {loadingRatings ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                      height="200px"
                    >
                      <CircularProgress size={60} />
                    </Box>
                  ) : errorRatings ? (
                    <p>Error al cargar las evaluaciones</p>
                  ) : (
                    (() => {
                      const allRatings = [1, 2, 3, 4, 5].map((ratingValue) => {
                        const existingRating = ratings.find(
                          (r) => r.rating === ratingValue
                        );
                        return {
                          rating: ratingValue,
                          count: existingRating ? existingRating.count : 0,
                        };
                      });

                      const totalCount = allRatings.reduce(
                        (sum, rating) => sum + rating.count,
                        0
                      );

                      return allRatings.map((rating) => (
                        <Box
                          key={rating.rating}
                          sx={{ my: 1, display: 'flex', alignItems: 'left' }}
                        >
                          <Typography
                            sx={{ width: 140, mr: 2 }}
                            variant="body1"
                            className="text-left"
                          >
                            {Array(rating.rating).fill('★').join('')}
                          </Typography>
                          <Box sx={{ width: '100%', mt: 1, mr: 2 }}>
                            <StyledLinearProgress
                              variant="determinate"
                              value={
                                totalCount > 0
                                  ? (rating.count / totalCount) * 100
                                  : 0
                              }
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 'bold', minWidth: 30 }}
                          >
                            {rating.count}
                          </Typography>
                        </Box>
                      ));
                    })()
                  )}
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
