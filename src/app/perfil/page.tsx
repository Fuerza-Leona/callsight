'use client';
import { useEffect, useState } from 'react';
import CustomPaginationActionsTable from '@/components/CustomPaginationActionsTable';
import SearchBar from '@/components/SearchBar';
import { useUser } from '@/context/UserContext';
import { useFetchProfile } from '@/hooks/fetchPerfil';
import { useFetchCompanyInformation } from '@/hooks/fetchCompanyInformation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import CircularProgress from '@mui/material/CircularProgress';

/*const rows = [
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
];*/

const columns = [
  { label: 'Cliente', key: 'name' },
  { label: 'Usuarios', key: 'size' },
  //{ label: 'Proyectos', key: 'proyectos' },
];

//Client
const nProyects = 1;
const tickets = 21;

export default function Home() {
  const { user } = useUser();
  const {
    number: nCalls,
    rating: satisfaction,
    duration,
    fetchProfile,
    loading: loadingProfile,
  } = useFetchProfile();
  const { rows, loading, fetchCompanyInformation } =
    useFetchCompanyInformation();
  const name = user?.username;

  const company = user?.department;
  const userRole = user?.role;

  const [filteredRows, setFilteredRows] = useState(rows);
  const handleSearch = (searchValue: string | null) => {
    if (!searchValue || searchValue.length === 0) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) =>
        row['name'].toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCompanyInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute>
      {loadingProfile || loading ? (
        <div className="lg:pl-[256px] w-full h-screen flex items-center justify-center">
          <CircularProgress size={100} thickness={4} />
        </div>
      ) : (
        <div className="md:relative absolute w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px]">
          <div className="w-full text-start">
            <div className="bg-[#13202A] rounded-2xl mx-20 p-8 flex items-center justify-between">
              <p className="text-white text-4xl">{name}</p>
              <LogoutButton />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-5 md:flex-row md:w-[calc(100%-10rem)] justify-between mt-10 mb-10 w-[calc(100%-10rem)] ">
            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center"
              style={{ backgroundColor: 'var(--persian-pink)' }}
            >
              <p>Rol</p>
              <h2 className="font-thin text-3xl">
                {userRole == 'admin'
                  ? 'Admin'
                  : userRole == 'agent'
                    ? 'Agente'
                    : 'Usuario'}
              </h2>
            </div>

            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center"
              style={{ backgroundColor: 'var(--jonquil)' }}
            >
              <p>
                {userRole == 'client' ? 'Tickets abiertos' : 'Departamento'}
              </p>
              <h2 className="font-thin text-3xl">
                {userRole == 'client' ? tickets : company}
              </h2>
            </div>

            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center text-white"
              style={{ backgroundColor: 'var(--neoris-blue)' }}
            >
              <p>Duración promedio por llamada</p>
              <div className="flex">
                <h2 className="font-thin text-3xl">{duration}</h2>
                <p>min</p>
              </div>
            </div>
            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl w-full justify-center items-center text-white"
              style={{ backgroundColor: 'var(--slate-blue)' }}
            >
              <p>
                {userRole == 'admin' || userRole == 'agent'
                  ? 'Satisfaccion promedio'
                  : 'Proyectos realizados'}
              </p>
              <h2 className="font-thin text-3xl">
                {userRole == 'client'
                  ? nProyects
                  : satisfaction != 0
                    ? satisfaction
                    : '--'}
              </h2>
            </div>

            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl w-full justify-center items-center"
              style={{ backgroundColor: 'var(--sky-blue)' }}
            >
              <p>Llamadas totales</p>
              <h2 className="font-thin text-3xl">{nCalls}</h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-[calc(100%-8rem)] md:w-[calc(100%-10rem)] gap-5 md:items-center justify-between">
            {userRole == 'client' && (
              <div className="flex flex-col bg-gray-200 w-full h-80 md:mt-10 rounded-2xl justify-center items-center">
                <p>Clientes</p>
                <h2 className="font-thin text-3xl">
                  aliqua irure officia culpa labore
                </h2>
              </div>
            )}
            {(userRole == 'admin' || userRole == 'agent') && (
              <div className="flex flex-col w-full gap-5 md:ml-10">
                {!loading && (
                  <div className="flex justify-between gap-5">
                    <SearchBar
                      label="Buscar Cliente"
                      options={rows.map((row) => ({ label: row.name }))}
                      onSelect={handleSearch}
                      sx={{ width: '100%' }}
                    />
                    <button className="rounded-2xl bg-[#13202A] text-white md:w-50 hover:cursor-pointer hover:bg-[#364550]">
                      Añadir cliente
                    </button>
                  </div>
                )}
                <div className="h-[200px] w-full">
                  {rows.length > 1 && (
                    <CustomPaginationActionsTable
                      rows={filteredRows}
                      columns={columns}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
