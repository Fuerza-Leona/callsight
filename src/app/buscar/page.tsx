"use client";

import * as React from "react";
import MultipleSelectChip from "../components/MultipleSelectChip";
import { useEffect } from "react";
import { useFetchClients } from "../hooks/fetchClients";
import { useFetchLlamadas } from "../hooks/fetchLlamadas";
import Llamada from "../components/Llamada";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useFetchCategorias } from "../hooks/fetchCategorias";
import Tag from "../components/Tag";

export default function Home() {
  const { data, refetchClients } = useFetchClients();
  const { dataLlamadas, refetchLlamadas } = useFetchLlamadas();
  const { datacategorias, refetchcategorias } = useFetchCategorias();
  const router = useRouter();

  useEffect(() => {
    refetchClients();
    refetchLlamadas();
    refetchcategorias();
  }, []);

  const dataLlamadasFiltrados = dataLlamadas.llamadas.filter((llamada) => {
    return llamada.categories.includes("Categories");
  });
  const [users, setUsers] = React.useState<string[]>([]);
  const [category, setCategory] = React.useState<string[]>([]);
  const [clients, setClients] = React.useState<string[]>([]);

  const handleClick = (callId: string) => {
    router.push(`/llamada?call_id=${callId}`);
  };

  return (
    <div className="relative lg:left-64 top-32 w-full xl:w-75/100 min-h-screen flex flex-col md:justify-around md:flex-row gap-2 m-2">
      <div className="w-3/10 flex flex-col align-center text-center">
        <p className="text-3xl">Filtros</p>
        <MultipleSelectChip
          title="Usuarios"
          names={["Employee1"]}
          value={users}
          onChange={setUsers}
        />
        <MultipleSelectChip
          title="Cliente"
          names={data.namesClients}
          value={clients}
          onChange={setClients}
        />
        <MultipleSelectChip
          title="Categorías"
          names={datacategorias.categorias}
          value={category}
          onChange={setCategory}
        />
      </div>
      <div className="w-full md:w-[50%] flex flex-col divide-y-1 divide-solid divide-[#D0D0D0]">
        <p>Buscar</p>
        {dataLlamadas.loading && <CircularProgress />}
        {!dataLlamadas.loading && (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="w-1/3">Nombre</TableCell>
                  <TableCell className="w-1/3">Fecha</TableCell>
                  <TableCell className="w-1/3">Categorías</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLlamadas.llamadas.map((llamada) => (
                  <TableRow
                    key={llamada.audio_id}
                    onClick={() => handleClick(llamada.conversation_id)}
                    className="cursor-pointer">
                    <TableCell>
                      <p className="">{llamada.conversation_id}</p>
                    </TableCell>

                    <TableCell>
                      <p className="">
                        {new Date(
                          llamada.start_time.toString()
                        ).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {llamada.categories &&
                          llamada.categories.map((tag, index) => {
                            return <Tag key={index} text={tag} />;
                          })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
