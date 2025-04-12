"use client";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Link from "next/link";
import MultipleSelectChip from "@/components/MultipleSelectChip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CallIcon from "@mui/icons-material/Call";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import { useFetchClients, Client } from "@/hooks/fetchClients";
import { useEffect, useRef, useState } from "react";
import { useFetchEmotions } from "@/hooks/fetchEmotions";
import { useFetchCategories, Category } from "@/hooks/fetchCategories";
import { useFetchTopics } from "@/hooks/fetchTopics";
import SimpleWordCloud from "@/components/SimpleWordCloud";
import { useFetchConversationsSummary } from "@/hooks/fetchConversationsSummary";

export default function Home() {
  const { clients, loadingClients, errorClients, fetchClients } = useFetchClients();
  const { categories, loadingCategories, errorCategories, fetchCategories } = useFetchCategories();

  const { emotions, loadingEmotions, errorEmotions, fetchEmotions} = useFetchEmotions();
  const { topics, loadingTopics, errorTopics, fetchTopics } = useFetchTopics();
  const { summary, loadingSummary, errorSummary, fetchConversationsSummary } = useFetchConversationsSummary();

  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    fetchClients();

    fetchCategories();
  }, []);

  const initialFetchDone = useRef(false);

  useEffect(() => {
      if (!initialFetchDone.current) {
        initialFetchDone.current = true;
        return;
      }
      
      const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
      const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');

      fetchEmotions({
        startDate: startDate,
        endDate: endDate,
        clients: selectedClients,
        categories: selectedCategories
      })

      fetchConversationsSummary({
        startDate: startDate,
        endDate: endDate,
        clients: selectedClients,
        categories: selectedCategories
      });

      fetchTopics({
        limit: 10,
        clients: selectedClients,
        startDate: startDate,
        endDate: endDate,
        categories: selectedCategories
      });
  }, [selectedDate, selectedClients, selectedCategories]);


  return (
    <div className="relative lg:left-64 top-32 w-[96%] lg:w-[80%] min-h-screen flex flex-col gap-3 m-2 max-w-screen">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-2xl">Dashboard</p>
        <div className="flex gap-2">
          <div>
            <button className="bg-[#89D2E6] text-[#FFFFFF] rounded-md p-2 w-full">
              Exportar como PDF <FileDownloadIcon />
            </button>
          </div>
          <div>
            <button className="bg-[#89D2E6] text-[#FFFFFF] rounded-md p-2 w-full">
              Exportar como JSON <FileDownloadIcon />
            </button>
          </div>
          <Link
            href={'/calls/search'}
            className="bg-[#1E242B] text-[#FFFFFF] rounded-md"
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
              title={loadingCategories ? "Categorías (Cargando...)" : errorCategories ? "Categorías (Error)" : "Categorías"}
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
            <div className="w-[48%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] gap-3 p-3">
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
            <div className="w-[48%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] gap-3 p-3">
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
          <div className="w-full h-full rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] p-3">
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
        <div className="h-full rounded-md flex flex-col items-center justify-around bg-[#E7E6E7] p-5  w-full md:w-[48%]">
          <h1 className="text-lg font-bold py-3">Emociones detectadas</h1>
          {loadingEmotions ? (
            <p>Cargando emociones...</p>
          ) : errorEmotions ? (
            <p>Error al cargar emociones</p>
          ) : emotions && (emotions.positive !== 0 || emotions.neutral !== 0 || emotions.negative !== 0) ? (
            <div className="mt-2">
              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.value}`,
                    data: [
                      { id: 0, value: emotions.positive ?? 0, label: "Positivo" },
                      { id: 1, value: emotions.neutral ?? 0, label: "Neutro" },
                      { id: 2, value: emotions.negative ?? 0, label: "Negativo" },
                    ],
                  },
                ]}
                width={400}
                height={200}
                className="font-bold text-xl pt-5"
              />
            </div>
          ) : (
            <p>No hay datos</p>
          )}
        </div>

        <div className=" w-full md:w-[48%] rounded-md flex items-center justify-center bg-[#E7E6E7] p-5 flex flex-col">
          <h1 className="text-lg font-bold py-3">Categorías</h1>
          <BarChart
            yAxis={[
              {
                scaleType: 'band',
                data: ['group A', 'group B', 'group C'],
              },
            ]}
            series={[{ data: [4, 1, 2] }]}
            layout="horizontal"
            width={300}
            height={200}
          />
        </div>
      </div>
      <div className="rounded-md flex flex-col items-center justify-between bg-[#E7E6E7] w-full p-5 mb-5">
        <h1 className="text-lg font-bold py-3">Satisfacción</h1>
        <div className="w-[80%]">
          <BarChart
            yAxis={[
              {
                scaleType: 'band',
                data: ['1', '2', '3', '4', '5'],
              },
            ]}
            series={[{ data: [10, 20, 30, 10, 40] }]}
            layout="horizontal"
            height={200}
            bottomAxis={null}
          />
        </div>
      </div>
    </div>
    
  );
}
