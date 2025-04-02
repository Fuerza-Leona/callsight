'use client';

import * as React from "react";
import MultipleSelectChip from "../components/MultipleSelectChip";
import { useEffect } from "react";
import { useFetchClients } from "../hooks/fetchClients";
import { llamadas, useFetchLlamadas } from "../hooks/fetchLlamadas";
import Llamada from "../components/Llamada";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const categorias = ["Tecnología", "Marketing"];

export default function Home() {
  const { data, refetchClients } = useFetchClients();
  const { dataLlamadas, refetchLlamadas } = useFetchLlamadas();
  const router = useRouter();

  useEffect(() => {
    refetchClients();
    refetchLlamadas();
  }, []);

  const handleClick = (callId: string) => {
    router.push(`/llamada?call_id=${callId}`);
  };

  return (
    <div className="relative lg:left-64 top-32 w-full xl:w-75/100 min-h-screen flex flex-col md:justify-around md:flex-row gap-2 m-2">
      <div className="w-3/10 flex flex-col align-center text-center">
        <p className="text-3xl">Filtros</p>
        <MultipleSelectChip title="Usuarios" names={["Employee1"]} />
        <MultipleSelectChip title="Cliente" names={data.namesClients} />
        <MultipleSelectChip title="Categorías" names={categorias} />
      </div>
      <div className="w-full md:w-[50%] flex flex-col divide-y-1 divide-solid divide-[#D0D0D0]">
        <p>Buscar</p>
        {dataLlamadas.loading && <CircularProgress />}
        {!dataLlamadas.loading && (
          <div>
            {dataLlamadas.llamadas.map((llamada) => (
              <div
                key={llamada.audio_id}
                onClick={() => handleClick(llamada.conversation_id)}
                className="cursor-pointer"
              >
                <Llamada
                  nombre={llamada.conversation_id}
                  startTime={llamada.start_time}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}