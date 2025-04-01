"use client";

import * as React from "react";
import MultipleSelectChip from "../components/MultipleSelectChip";
import { useEffect } from "react";
//import axios from "axios";
import { useFetchClients } from "../hooks/fetchClients";
import { llamadas, useFetchLlamadas } from "../hooks/fetchLlamadas";
import Llamada from "../components/Llamada";
import { CircularProgress } from "@mui/material";

/*interface employees {
    user_id: string;
    user: string;
}*/

const categorias = ["Tecnología", "Marketing"];

function render(llamadaLista: llamadas[]) {
  return (
    <div>
      {llamadaLista.map((llamada) => {
        return <Llamada key={llamada.audio_id} nombre={llamada.conversation_id} startTime={llamada.start_time} />;
      })}
    </div>
  );
}

export default function Home() {
  //const [namesPeople, setNamesPeople] = useState<employees[]>([]);
  //const [namesEmployees, setNamesEmployees] = useState<string[]>([]);
  const { data, refetchClients } = useFetchClients();

  const { dataLlamadas, refetchLlamadas } = useFetchLlamadas();

  useEffect(() => {
    /*axios
            .get(`${apiURL}/users/employees`)
            .then((response) => {
                //setNamesPeople(response.data.data);
                setNamesEmployees(response.data.users);
            })
            .catch((error) => {
                console.error("Error fetching summary:", error);
            })
            .finally(() => {
                //add loading
            });*/
    refetchClients();
    refetchLlamadas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        {!dataLlamadas.loading && render(dataLlamadas.llamadas)}
      </div>
    </div>
  );
}
