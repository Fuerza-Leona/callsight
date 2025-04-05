'use client'
import { useState } from "react";
import CustomPaginationActionsTable from "@/components/CustomPaginationActionsTable";
import SearchBar from "@/components/SearchBar";
import { useUser } from "@/context/UserContext";

const rows = [
  { name: 'BBVA', usuarios: 30, proyectos: 3 },
  { name: 'Santander', usuarios: 12, proyectos: 21 },
  { name: 'CaixaBank', usuarios: 18, proyectos: 5 },
  { name: 'Banco Sabadell', usuarios: 25, proyectos: 8 },
  { name: 'ING', usuarios: 10, proyectos: 2 },
  { name: 'Bankinter', usuarios: 8, proyectos: 4 },
  { name: 'Abanca', usuarios: 15, proyectos: 6 },
  { name: 'Kutxabank', usuarios: 9, proyectos: 1 },
  { name: 'Openbank', usuarios: 13, proyectos: 7 },
  { name: 'EVO Banco', usuarios: 6, proyectos: 3 },
  { name: 'Cajamar', usuarios: 22, proyectos: 9 },
];

const columns = [
  { label: 'Cliente', key: 'name' },
  { label: 'Usuarios', key: 'usuarios' },
  { label: 'Proyectos', key: 'proyectos' },
];

//Harcodead values (whatever is commented is already functional)
  //const isUser = false;
  //const isAgent = !isUser;
  const isAdmin = false;

  //const name = "Juan"
  const nCalls = 192;
  const duration = 23;

  //Client
  const nProyects = 1;
  const tickets = 21

  //Agente - Admin
  const satisfaction = 4.3;
  const company = "Neoris";

export default function Home() {
  const { user } = useUser();
  const name = user?.username;
  const isUser = (user?.role == "client")
  const isAgent = !isUser; //This is hardcoded. It needs to also get the user role

  const [filteredRows, setFilteredRows] = useState(rows);
  const handleSearch = (searchValue: string | null) => {
    if (!searchValue) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(row =>
        row.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  };

  return (
    <div className="md:relative absolute w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px] pt-[140px] md:pt-28 lg:pt-[65px]">
      <div className="w-full text-start">
        <div className="text-white text-4xl text-start">
          <p className="bg-[#13202A] rounded-2xl mx-20 p-8">{name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-5 md:flex-row md:w-[calc(100%-18rem)] justify-between mt-10 w-[calc(100%-10rem)] ">
        <div className="flex flex-col bg-gray-200 md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center">
          <p>Rol</p>
          <h2 className="font-thin text-3xl">
            {isAdmin ? "Admin" : isAgent ? "Agente" : "Usuario"}
          </h2>
        </div>

        <div className="flex flex-col bg-gray-200 md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center">
          <p>
            {isUser ? "Tickets abiertos" : "Empresa"}
          </p>
          <h2 className="font-thin text-3xl">
            {isUser ? tickets : company}
          </h2>
        </div>
        

        <div className="flex flex-col bg-gray-200 md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center">
          <p>Duración promedio por llamada</p>
          <div className="flex">
            <h2 className="font-thin text-3xl">{duration}</h2>
            <p>min</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-[calc(100%-10rem)] md:w-[calc(100%-18rem)] gap-5 md:items-center justify-between">
        <div className="flex md:flex-col justify-between gap-10 md:mt-10 mt-5">
          <div className="flex flex-col bg-gray-200 md:w-60 md:h-35 h-28 rounded-2xl w-full justify-center items-center">
            <p>
              {(isAdmin || isAgent) ? "Satisfaccion promedio" : "Proyectos realizados" }
            </p>
            <h2 className="font-thin text-3xl">{isUser ? nProyects : satisfaction}</h2>
          </div>

          <div className="flex flex-col bg-gray-200 md:w-60 md:h-35 h-28 rounded-2xl w-full justify-center items-center">
            <p>Llamadas totales</p>
            <h2 className="font-thin text-3xl">{nCalls}</h2>
          </div>
        </div>

        {isUser && <div className="flex flex-col bg-gray-200 w-full h-80 md:mt-10 rounded-2xl justify-center items-center">
          <p>Clientes</p>
          <h2 className="font-thin text-3xl">
            aliqua irure officia culpa labore
          </h2>
        </div>
        }
        {(isAdmin || isAgent) && 
        <div className="flex flex-col w-full gap-5 md:ml-10">
          <div className="flex justify-between gap-5">
            <SearchBar label="Buscar Cliente" options={rows.map(row => ({ label: row.name }))} onSelect={handleSearch} sx={{ width: '100%' }} />
              <button className="rounded-2xl bg-[#13202A] text-white md:w-50 hover:cursor-pointer hover:bg-[#364550]">
                Añadir cliente
              </button>
          </div>
          <div className="h-[200px] w-full">
            <CustomPaginationActionsTable rows={filteredRows} columns={columns} />
          </div>
        </div>
        }

      </div>
    </div>
  );
}