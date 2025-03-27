"use client";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative lg:left-64 top-32 w-[96%] lg:w-[80%] min-h-screen flex flex-col gap-3 m-2 max-w-screen">
            <div className="flex flex-col flex-wrap xl:flex-nowrap md:flex-row gap-2 justify-between">
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
                <div className="flex flex-grow xl:flex-none flex-col w-full md:w-[30%] justify-between gap-2">
                    <div className="">
                        <button className="bg-[#1E242B] text-[#FFFFFF] rounded-md h-15 w-full">
                            Categoria
                        </button>
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
                    <div>
                        <button className="bg-[#89D2E6] text-[#FFFFFF] rounded-md h-24 w-full">
                            Exportar como JSON
                        </button>
                    </div>
                </div>

                <div className="flex flex-col grow xl:flex-none w-full md:w-[40%] justify-between gap-3">
                    <Link
                        href={"./buscar"}
                        className="bg-[#1E242B] text-[#FFFFFF] rounded-md">
                        <div className="h-[15%] lg:h-30 items-center justify-center text-center flex">
                            <p className="">Buscar Llamadas -&gt;</p>
                        </div>
                    </Link>
                    <div className="flex w-full h-[30%] justify-between text-center">
                        <div className="w-[45%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7]">
                            <p>Tiempo promedio por llamada</p>
                            <p className="text-3xl">30 minutos</p>
                        </div>
                        <div className="w-[45%] rounded-md flex flex-col items-center justify-center bg-[#E7E6E7]">
                            <p>Total de llamadas</p>
                            <p className="text-3xl">30 llamadas</p>
                        </div>
                    </div>
                    <div className="h-50 rounded-md flex items-center justify-around bg-[#E7E6E7] p-5">
                        <p>Emociones detectadas</p>
                        <PieChart
                            series={[
                                {
                                    arcLabel: (item) => `${item.value}%`,
                                    data: [
                                        { id: 0, value: 10, label: "Positivo" },
                                        { id: 1, value: 15, label: "Neutro" },
                                        { id: 2, value: 20, label: "Negativo" },
                                    ],
                                },
                            ]}
                            width={400}
                            height={200}
                            className="font-bold text-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full">
                <div className="w-[45%] rounded-md flex items-center justify-center bg-[#E7E6E7]">
                    <p>Temas principales detectados</p>
                </div>
                <div className="w-[45%] rounded-md flex items-center justify-center bg-[#E7E6E7] p-5">
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
            <div className="rounded-md flex items-center justify-between bg-[#E7E6E7] w-full p-5">
                <p>Satisfaccion</p>
                <div className="w-[80%]">
                <BarChart
                    yAxis={[
                        {
                            scaleType: "band",
                            data: ["1", "2", "3", "4", "5"]
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
