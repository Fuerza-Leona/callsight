"use client";

import * as React from "react";
import MultipleSelectChip from "../components/MultipleSelectChip";
import { useEffect } from "react";
import { useFetchClients } from "../hooks/fetchClients";
import { useFetchLlamadas } from "../hooks/fetchLlamadas";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [category, setCategory] = React.useState<string[]>([]);
  const [clients, setClients] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState<string>("");

  const dataCallsFiltered =dataLlamadas? dataLlamadas.llamadas.filter((llamada) => {
    /*const matchesUsers =
      users.length === 0 || users.some((user) => llamada.users?.includes(user));*/
    const matchesCategories =
      category.length === 0 ||
      category.some((cat) => llamada.categories?.includes(cat));
    /*const matchesClients =
      clients.length === 0 || clients.some((client) => llamada.clients?.includes(client));*/
    const matchesSearch = search == "" || llamada.conversation_id.match(new RegExp(search, "i"))
    return matchesCategories && matchesSearch;
  }): [];

  const handleClick = (callId: string) => {
    router.push(`/llamada?call_id=${callId}`);
  };

  return (
    <div className="relative lg:left-64 top-32 w-full xl:w-75/100 min-h-screen flex flex-col md:justify-around md:flex-row gap-2 m-2">
      <div className="w-3/10 flex flex-col align-center text-center">
        <p className="text-3xl">Filtros</p>
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
        <TextField
          className="w-[80%]"
          label="Buscar"
          variant="outlined"
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
          }}
        />
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
                {dataCallsFiltered.map((llamada) => (
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
