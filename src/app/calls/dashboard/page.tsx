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
import { useEffect, useState } from "react";
import { useFetchEmotions } from "@/hooks/fetchEmotions";
import { useFetchCategorias } from "@/hooks/fetchCategorias";

export default function Home() {
  const { data, refetchClients } = useFetchClients();
  const { datacategorias, refetchcategorias } = useFetchCategorias();
  const { dataEmotions, refetchEmotions } = useFetchEmotions();

  const [clients, setClients] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    refetchClients();
    refetchEmotions();
    refetchcategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                defaultValue={dayjs("2022-04-17")}
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
              onChange={setClients}
            />
          </div>
          <div className="">
            <MultipleSelectChip
              title="Categorías"
              names={datacategorias.categorias}
              value={categorias}
              onChange={setCategorias}
            />
          </div>
        </div>

        <div className="flex flex-col grow w-full md:w-[40%] justify-between gap-3">
          <div className="flex w-full h-[30%] justify-between text-center">
            <div className="w-[48%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] gap-3 p-3">
              <div className="flex gap-2 text-md items-center">
                <AccessTimeIcon fontSize="small" />
                <p>Promedio </p>
              </div>
              <p className="text-6xl">
                30 <span className="text-sm text-gray-500">minutos</span>
              </p>
            </div>
            <div className="w-[48%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7] gap-3 p-3">
              <div className="flex gap-2 text-md items-center">
                <CallIcon fontSize="small" />
                <p>Total</p>
              </div>
              <p className="text-6xl">
                30 <span className="text-sm text-gray-500">llamadas</span>
              </p>
            </div>
          </div>
          <div className="w-full h-full rounded-md flex items-center justify-center bg-[#E7E6E7]">
            <p>Temas principales detectados</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between w-full gap-3">
        <div className="h-full rounded-md flex flex-col items-center justify-around bg-[#E7E6E7] p-5  w-full md:w-[45%]">
          <p>Emociones detectadas</p>
          {(dataEmotions.positive != 0) ? (
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
              className="font-bold text-xl"
            />
          ): (
            <p>No hay datos</p>
          )}
        </div>

        <div className=" w-full md:w-[45%] rounded-md flex items-center justify-center bg-[#E7E6E7] p-5 flex flex-col">
          <p>Categorías</p>
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
      <div className="rounded-md flex flex-col items-center justify-between bg-[#E7E6E7] w-full p-5">
        <p>Satisfaccion</p>
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
