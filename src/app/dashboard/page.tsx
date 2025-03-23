"use client";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function Home() {
    return (
        <div className="relative left-64 top-32 w-82/100 min-h-screen grid grid-cols-3 gap-2 auto-rows-min m-2">
            <div className="row-span-4 text-white bg-[#1E242B] rounded-md">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        defaultValue={dayjs("2022-04-17")}
                        views={["month", "year"]}
                        openTo="month"
                    />
                </LocalizationProvider>
            </div>
            <div className="">
                <button className="bg-[#1E242B] text-[#FFFFFF] rounded-md h-15 w-full">
                    Categoria
                </button>
            </div>

            <div className="col-span-2 row-span-2 bg-[#1E242B] text-[#FFFFFF] rounded-md flex items-center justify-around">
                <p className="">Buscar Llamadas</p>
                <p>-&gt;</p>
            </div>
            <div className="">
                <button className="bg-[#1E242B] text-[#FFFFFF] rounded-md h-15 w-full">
                    Cliente
                </button>
            </div>
            <div>
                <button className="bg-[#89D2E6] text-[#FFFFFF] rounded-md h-24 w-full">
                    Exportar como PDF
                </button>
            </div>

            <div className="row-span-2 rounded-md flex items-center justify-center bg-[#E7E6E7]">
                <p>Tiempo promedio por llamada</p>
            </div>
            <div className="row-span-2 rounded-md flex items-center justify-center bg-[#E7E6E7]">
                <p>Total de llamadas</p>
            </div>
            <div>
                <button className="bg-[#89D2E6] text-[#FFFFFF] rounded-md h-24 w-full">
                    Exportar como JSON
                </button>
            </div>
            <div className="row-span-2 col-span-2 rounded-md flex items-center justify-center bg-[#E7E6E7]">
                <p>Temas principales detectados</p>
            </div>
            <div className="row-span-2 rounded-md flex items-center justify-center bg-[#E7E6E7]">
                <p>Emociones detectadas</p>
            </div>
            <div className="row-span-2 rounded-md flex items-center justify-center bg-[#E7E6E7]">
                <p>Categorías</p>
            </div>
            <div className="col-span-4 rounded-md flex items-center justify-center bg-[#E7E6E7]">
                <p>Satisfaccion</p>
            </div>
        </div>
    );
}
