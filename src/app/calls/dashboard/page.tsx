'use client';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Link from 'next/link';
import MultipleSelectChip from '@/components/MultipleSelectChip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CallIcon from '@mui/icons-material/Call';
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

  useEffect(() => {
    fetchClients();

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

    fetchConversationsRatings({
      startDate: startDate,
      endDate: endDate,
      clients: selectedClients,
      categories: selectedCategories,
    });

    fetchConversationsCategories({
      startDate: startDate,
      endDate: endDate,
      clients: selectedClients,
      categories: selectedCategories,
    });

    fetchEmotions({
      startDate: startDate,
      endDate: endDate,
      clients: selectedClients,
      categories: selectedCategories,
    });

    fetchConversationsSummary({
      startDate: startDate,
      endDate: endDate,
      clients: selectedClients,
      categories: selectedCategories,
    });

    fetchTopics({
      limit: 10,
      clients: selectedClients,
      startDate: startDate,
      endDate: endDate,
      categories: selectedCategories,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedClients, selectedCategories]);

  return (
    <div className="relative lg:left-64 top-32 w-[96%] lg:w-[80%] min-h-screen flex flex-col gap-3 m-2 max-w-screen">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-2xl">Dashboard</p>
        <div className="flex gap-2">
          <div>
            <button
              className="text-[#FFFFFF] rounded-md p-2 w-full"
              style={{ backgroundColor: 'var(--sky-blue)' }}
            >
              Exportar como PDF <FileDownloadIcon />
            </button>
          </div>
          <div>
            <button
              className="text-[#FFFFFF] rounded-md p-2 w-full"
              style={{ backgroundColor: 'var(--sky-blue)' }}
            >
              Exportar como JSON <FileDownloadIcon />
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
          <div className="text-white bg-[#1E242B] rounded-md">
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
              onChange={(newClients: string[]) => {
                setSelectedClients(newClients);
              }}
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
              onChange={(newCategories: string[]) => {
                setSelectedCategories(newCategories);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col grow w-full md:w-[40%] justify-between gap-3">
          <div className="flex w-full h-[30%] justify-between text-center">
            <div
              className="w-[48%] rounded-md flex flex-col items-center justify-center gap-3 p-3"
              style={{ backgroundColor: 'var(--jonquil)' }}
            >
              <div className="flex gap-2 text-md items-center font-bold">
                <AccessTimeIcon fontSize="medium" />
                <h1>Tiempo promedio por llamada (minutos) </h1>
              </div>
              <div className="text-6xl">
                {loadingSummary ? (
                  <span className="text-2xl">Cargando...</span>
                ) : errorSummary ? (
                  <span className="text-2xl text-red-500">Error</span>
                ) : (
                  summary?.average_minutes || 0
                )}
              </div>
            </div>
            <div
              className="w-[48%] rounded-md flex flex-col items-center justify-center gap-3 p-3"
              style={{ backgroundColor: 'var(--persian-pink)' }}
            >
              <div className="flex gap-2 text-md items-center font-bold">
                <CallIcon fontSize="small" />
                <h1>Total de llamadas</h1>
              </div>
              <div className="text-6xl">
                {loadingSummary ? (
                  <span className="text-2xl">Cargando...</span>
                ) : errorSummary ? (
                  <span className="text-2xl text-red-500">Error</span>
                ) : (
                  summary?.conversation_count || 0
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-full rounded-md flex flex-col items-center justify-center bg-white p-3">
            <h1 className="text-lg mt-5 font-bold">
              Temas principales detectados
            </h1>
            {loadingTopics ? (
              <span className="text-2xl">Cargando temas...</span>
            ) : errorTopics ? (
              <span className="text-2xl">Error al cargar temas</span>
            ) : !topics || !Array.isArray(topics) ? (
              <span className="text-2xl">No hay temas disponibles</span>
            ) : (
              <div className="w-full h-full">
                <SimpleWordCloud
                  words={topics.map((topic) => ({
                    text: topic.topic,
                    value: topic.amount,
                  }))}
                  maxWords={15}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between w-full gap-3">
        <div className="h-full rounded-md flex flex-col items-center justify-around bg-white p-5  w-full md:w-[48%]">
          <h1 className="text-lg font-bold py-3">Emociones detectadas</h1>
          {loadingEmotions ? (
            <p>Cargando emociones...</p>
          ) : errorEmotions ? (
            <p>Error al cargar emociones</p>
          ) : emotions &&
            (emotions.positive !== 0 ||
              emotions.neutral !== 0 ||
              emotions.negative !== 0) ? (
            <div className="mt-2">
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
                      { id: 1, value: emotions.neutral ?? 0, label: 'Neutro' },
                      {
                        id: 2,
                        value: emotions.negative ?? 0,
                        label: 'Negativo',
                      },
                    ],
                  },
                ]}
                width={400}
                height={200}
                className="font-bold text-xl pt-5"
                colors={['#6564DB', '#F6CF3C', '#F294CD']}
              />
            </div>
          ) : (
            <p>No hay datos</p>
          )}
        </div>

        <div className="w-full md:w-[48%] rounded-md flex items-center justify-center bg-white p-5 flex flex-col">
          <h1 className="text-lg font-bold pt-3">Categorías</h1>
          {loadingConversationsCategories ? (
            <p>Cargando categorías...</p>
          ) : errorConversationsCategories ? (
            <p>Error al cargar categorías</p>
          ) : conversationsCategories && conversationsCategories.length > 0 ? (
            <BarChart
              yAxis={[
                {
                  scaleType: 'band',
                  data: conversationsCategories.map(
                    (category) => category.name
                  ),
                  tickLabelStyle: {
                    textAnchor: 'end', // Changed from 'start' to 'end'
                    fontSize: 12,
                  },
                },
              ]}
              series={[
                {
                  data: conversationsCategories.map(
                    (category) => category.count
                  ),
                  label: 'Número de llamadas',
                },
              ]}
              layout="horizontal"
              width={450} // Increased from 300 to 450
              height={200}
              margin={{ left: 150, right: 40, top: 60, bottom: 30 }} // Increased left and right margins
              sx={{
                // Custom styling for better appearance
                '& .MuiChartsAxis-tick .MuiChartsAxis-tickLabel': {
                  fill: '#333', // Darker text for better readability
                },
                '& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick .MuiChartsAxis-tickLabel tspan':
                  {
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  },
              }}
            />
          ) : (
            <p>No hay datos de categorías</p>
          )}
        </div>
      </div>
      <div className="rounded-md flex flex-col items-center justify-between bg-white w-full p-5 mb-5">
        <h1 className="text-lg font-bold py-3">Satisfacción</h1>
        <div className="w-[80%]">
          {loadingRatings ? (
            <p>Cargando datos de satisfacción...</p>
          ) : errorRatings ? (
            <p>Error al cargar datos de satisfacción</p>
          ) : ratings && ratings.length > 0 ? (
            <BarChart
              yAxis={[
                {
                  scaleType: 'band',
                  data: ratings?.map((rating) => rating.rating) || [],
                  tickLabelStyle: {
                    textAnchor: 'end',
                    fontSize: 12,
                  },
                },
              ]}
              xAxis={[
                {
                  scaleType: 'linear',
                  tickLabelStyle: {
                    textAnchor: 'start',
                    fontSize: 12,
                  },
                  tickNumber: 5,
                },
              ]}
              series={[
                {
                  data: ratings?.map((rating) => rating.count) || [],
                  label: 'Número de llamadas',
                },
              ]}
              layout="horizontal"
              width={900}
              height={200}
              margin={{ left: 50, right: 50, top: 60, bottom: 30 }}
              sx={{
                '& .MuiChartsAxis-tick .MuiChartsAxis-tickLabel': {
                  fill: '#333',
                },
                '& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick .MuiChartsAxis-tickLabel tspan':
                  {
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  },
              }}
            />
          ) : (
            <p>No hay datos de calificaciones disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}
