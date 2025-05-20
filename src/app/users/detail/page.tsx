'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CircularProgress from '@mui/material/CircularProgress';
import { useFetchUserInformation } from '@/hooks/fetchUser';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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

//Client
const duration = 0;
const satisfaction = 0;
const nCalls = 0;
const tickets = 0;
const nProyects = 0;

export default function UserDetail() {
  const {
    fetchUserInformation,
    userFetched: user,
    loading: loadingProfile,
  } = useFetchUserInformation();
  const searchParams = useSearchParams();
  const userID = searchParams.get('detail');

  useEffect(() => {
    fetchUserInformation(userID!);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin', 'agent', 'client']}>
      {loadingProfile ? (
        <div className="lg:pl-[256px] w-full h-screen flex items-center justify-center">
          <CircularProgress size={100} thickness={4} />
        </div>
      ) : (
        <div className="md:relative absolute w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px]">
          <div className="w-full text-start">
            <div className="bg-[#13202A] rounded-2xl mx-20 p-8 flex items-center justify-between">
              <p className="text-white text-4xl">{user?.username}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-5 md:flex-row md:w-[calc(100%-10rem)] justify-between mt-10 mb-10 w-[calc(100%-10rem)] ">
            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center"
              style={{ backgroundColor: 'var(--persian-pink)' }}
            >
              <p>Rol</p>
              <h2 className="font-thin text-3xl">
                {user?.role == 'admin'
                  ? 'Admin'
                  : user?.role == 'agent'
                    ? 'Agente'
                    : 'Usuario'}
              </h2>
            </div>

            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center"
              style={{ backgroundColor: 'var(--jonquil)' }}
            >
              <p>
                {user?.role == 'client' ? 'Tickets abiertos' : 'Departamento'}
              </p>
              <h2 className="font-thin text-3xl">
                {user?.role == 'client' ? tickets : user?.department}
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
                {user?.role == 'admin' || user?.role == 'agent'
                  ? 'Satisfaccion promedio'
                  : 'Proyectos realizados'}
              </p>
              <h2 className="font-thin text-3xl">
                {user?.role == 'client'
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
            {user?.role == 'client' && (
              <div className="flex flex-col bg-gray-200 w-full h-80 md:mt-10 rounded-2xl justify-center items-center">
                <p>Clientes</p>
                <h2 className="font-thin text-3xl">
                  aliqua irure officia culpa labore
                </h2>
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
