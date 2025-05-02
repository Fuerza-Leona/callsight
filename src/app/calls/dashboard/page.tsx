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
import { useFetchCategories, Category } from '@/hooks/fetchCategories';
import { useFetchTopics } from '@/hooks/fetchTopics';
import SimpleWordCloud from '@/components/SimpleWordCloud';
import { useFetchConversationsSummary } from '@/hooks/fetchConversationsSummary';
import { useFetchConversationsCategories } from '@/hooks/fetchConversationsCategories';
import { useFetchConversationsRatings } from '@/hooks/fetchConversationsRatings';
import {
  Box,
  Typography,
  LinearProgress,
  styled,
  CircularProgress,
} from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';

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
  const { clients, loadingClients, errorClients, fetchClients } =
    useFetchClients();
  const { categories, loadingCategories, errorCategories, fetchCategories } =
    useFetchCategories();

  const { emotions, loadingEmotions, errorEmotions, fetchEmotions } =
    useFetchEmotions();
  const { topics, loadingTopics, errorTopics, fetchTopics } = useFetchTopics();
  const { summary, loadingSummary, errorSummary, fetchConversationsSummary } =
    useFetchConversationsSummary();
  const {
    conversationsCategories,
    loadingConversationsCategories,
    errorConversationsCategories,
    fetchConversationsCategories,
  } = useFetchConversationsCategories();
  const { ratings, loadingRatings, errorRatings, fetchConversationsRatings } =
    useFetchConversationsRatings();

  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  const isLoadingRef = useRef(false);

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([fetchClients(), fetchCategories()]);
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
      categories: selectedCategories,
    };

    const loadAllData = async () => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      try {
        await Promise.all([
          fetchConversationsRatings(params),
          fetchConversationsCategories(params),
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
  }, [selectedDate, selectedClients, selectedCategories]);

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleClientsChange = (newClients: string[]) => {
    setSelectedClients(newClients);
  };

  const handleCategoriesChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
  };

  return (
    <ProtectedRoute>
      <div className="relative lg:left-64 pt-7 w-[96%] lg:w-[80%] flex flex-col gap-3 max-w-screen pl-3">
        <div className="flex flex-col md:flex-row items-center justify-between ">
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
              className="text-[#FFFFFF] rounded-md"
              style={{ backgroundColor: 'var(--neoris-blue)' }}
            >
              <div className="p-2 items-center justify-center text-center flex">
                <p className="">
                  Buscar Llamadas <SearchIcon />
                </p>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center flex-wrap xl:flex-nowrap md:justify-between gap-2">
          <div className="flex flex-col gap-2">
            <div className="text-white bg-[#1E242B] rounded-md mb-5 ">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="es"
              >
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  views={['month', 'year']}
                  openTo="month"
                  className="bg-[#1E242B] rounded-md w-1/1"
                />
              </LocalizationProvider>
            </div>
            <div className="">
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
            </div>
            <div className="">
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
          </div>

          <div className="pt-2 flex flex-col grow w-full pl-3 md:w-[40%] justify-between gap-3">
            <div className="flex w-full h-[30%] gap-4 text-center pb-1 ">
              <div
                className="w-[32%] rounded-md flex flex-col items-left justify-left gap-3 p-3 shadow-md"
                style={{ backgroundColor: 'white', height: '110px' }}
              >
                <div className="flex gap-2 text-md items-left font-bold ">
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
                    <div>
                      {summary?.average_minutes || 0}
                      <span className="text-sm pl-2 font-light"> minutos</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="w-[32%] shadow-md rounded-md flex flex-col items-left justify-left items-left gap-3 p-3"
                style={{ backgroundColor: 'white', height: '110px' }}
              >
                <div className="flex gap-2 text-md items-left font-bold ">
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
                    <div>
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
                className="w-[32%] shadow-md rounded-md flex flex-col items-left justify-left items-left gap-3 p-3"
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
                    <div>
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
              className="w-full shadow-md rounded-md  bg-white p-5 w-full"
              style={{ minHeight: '260px' }}
            >
              <h1 className="text-lg font-bold pl-5">
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
                  <p className="pl-5 mt-3">
                    Error al cargar los temas principales
                  </p>
                ) : !topics || topics.length == 0 ? (
                  <p className="pl-5 mt-3">No hay temas principales</p>
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

            <div className="flex flex-col md:flex-row justify-between w-full gap-3 pt-1 ">
              <div
                className="h-full shadow-md rounded-md bg-white p-5 w-full md:w-[49%]"
                style={{ minHeight: '300px' }}
              >
                <h1 className="text-lg font-bold pt-3 pb-3">
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
                <h1 className="text-lg font-bold pt-3 pb-3">
                  Llamadas por categoría
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
                  {loadingConversationsCategories ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                      height="200px"
                    >
                      <CircularProgress size={60} />
                    </Box>
                  ) : errorConversationsCategories ? (
                    <p>Error al cargar categorías</p>
                  ) : !conversationsCategories ||
                    conversationsCategories.length == 0 ? (
                    <p>No hay categorías disponibles</p>
                  ) : (
                    (() => {
                      const totalCount = conversationsCategories.reduce(
                        (sum, cat) => sum + cat.count,
                        0
                      );

                      const topCategories = conversationsCategories
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);

                      return topCategories.map((category) => (
                        <Box
                          key={category.name}
                          sx={{ my: 2, display: 'flex', alignItems: 'left' }}
                        >
                          <Typography
                            sx={{ width: 250, mr: 2 }}
                            variant="body1"
                          >
                            {category.name}
                          </Typography>
                          <Box sx={{ width: '100%', mt: 1, mr: 2 }}>
                            <StyledLinearProgress
                              variant="determinate"
                              value={
                                totalCount > 0
                                  ? (category.count / totalCount) * 100
                                  : 0
                              }
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 'bold', minWidth: 30 }}
                          >
                            {category.count}
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
