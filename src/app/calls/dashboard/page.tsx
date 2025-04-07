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
import { useFetchClients } from "@/hooks/fetchClients";
import { useEffect, useRef, useState } from "react";
import { useFetchEmotions } from "@/hooks/fetchEmotions";
import { useFetchCategorias } from "@/hooks/fetchCategorias";
import { useFetchTopics } from "@/hooks/fetchTopics";
import SimpleWordCloud from "@/components/SimpleWordCloud";

export default function Home() {
  const { data, refetchClients } = useFetchClients();
  const { datacategorias, refetchcategorias } = useFetchCategorias();
  const { dataEmotions, refetchEmotions } = useFetchEmotions();
  const { topics, loading, error, fetchTopics } = useFetchTopics();

  const [clients, setClients] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    refetchClients();
    refetchEmotions();
    refetchcategorias();
    // fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const initialFetchDone = useRef(false);
  
  useEffect(() => {
      if (!initialFetchDone.current) {
        initialFetchDone.current = true;
        return;
      }
      
      const startDate = selectedDate.startOf('month');
      const endDate = selectedDate.endOf('month');

      fetchTopics({
        limit: 10,
        clients: [],
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD')
      });
  }, [selectedDate, clients, categorias]);


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
            href={"/calls/search"}
            className="bg-[#1E242B] text-[#FFFFFF] rounded-md">
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
                  views={["month", "year"]}
                  openTo="month"
                  className="bg-[#1E242B] rounded-md w-1/1"
                />
            </LocalizationProvider>
          </div>
          <div className="">
            <MultipleSelectChip
              title="Cliente"
              names={data.namesClients}
              value={clients}
              onChange={(newClients) => {
                  setClients(newClients);
                }
              }
            />
          </div>
          <div className="">
            <MultipleSelectChip
              title="Categorías"
              names={datacategorias.categorias}
              value={categorias}
              onChange={(category) => {
                  setCategorias(category);
                }
              }
            />
          </div>
        </div>

        <div className="flex flex-col grow w-full md:w-[40%] justify-between gap-3">
          <div className="flex w-full h-[30%] justify-between text-center">
            <div className="w-[48%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] gap-3 p-3">
              <div className="flex gap-2 text-md items-center font-bold">
                <AccessTimeIcon fontSize="medium" />
                <h1>Tiempo promedio por llamada </h1>
              </div>
              <p className="text-6xl">
                30 <span className="text-sm text-gray-500">minutos</span>
              </p>
            </div>
            <div className="w-[48%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] gap-3 p-3">
              <div className="flex gap-2 text-md items-center font-bold">
                <CallIcon fontSize="small" />
                <h1>Total de llamadas</h1>
              </div>
              <p className="text-6xl">
                30
              </p>
            </div>
          </div>
          <div className="w-full h-full rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] p-3">
            <h1 className="text-lg mt-5 font-bold">Temas principales detectados</h1>
            {loading ? (
              <p>Cargando temas...</p>
            ) : error ? (
              <p>Error al cargar temas</p>
            ) : !topics || !Array.isArray(topics) ? (
              <p>No hay temas disponibles</p>
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
          {(dataEmotions.positive != 0) ? (
            <div className="mt-2">
              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.value}%`,
                    data: [
                      { id: 0, value: dataEmotions.positive, label: "Positivo" },
                      { id: 1, value: dataEmotions.neutral, label: "Neutro" },
                      { id: 2, value: dataEmotions.negative, label: "Negativo" },
                    ],
                  },
                ]}
                width={400}
                height={200}
                className="font-bold text-xl pt-5"
              />
            </div>

          ): (
            <p>No hay datos</p>
          )}
        </div>

        <div className=" w-full md:w-[48%] rounded-md flex items-center justify-center bg-[#E7E6E7] p-5 flex flex-col">
        <h1 className="text-lg font-bold py-3">Categorías</h1>
        <BarChart
            yAxis={[
              {
                scaleType: "band",
                data: ["group A", "group B", "group C"],
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
                  scaleType: "band",
                  data: ["1", "2", "3", "4", "5"],
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
