'use client';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useFetchProfile } from '@/hooks/fetchPerfil';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

//Client
const nProyects = 1;
const tickets = 21;

export default function Home() {
  const { user } = useUser();
  const {
    error,
    number: nCalls,
    rating: satisfaction,
    duration,
    fetchProfile,
    loading: loadingProfile,
  } = useFetchProfile();
  const name = user?.username;

  const company = user?.department;
  const userRole = user?.role;

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin', 'agent', 'client']}>
      {loadingProfile ? (
        <div className="lg:pl-[256px] w-full h-screen flex items-center justify-center">
          <CircularProgress size={100} thickness={4} />
        </div>
      ) : error ? (
        <div className="lg:pl-[256px] w-full min-h-screen flex flex-col items-center justify-center px-4">
          <Alert severity="error" className="mb-4 w-full max-w-2xl">
            {typeof error === 'string'
              ? error
              : error instanceof Error
                ? error.message
                : String(error)}
          </Alert>
          <button
            onClick={() => fetchProfile()}
            className="mt-4 bg-slate-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      ) : (
        <div className="md:relative absolute w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px]">
          <div className="w-full text-start">
            <div className="bg-[#13202A] rounded-2xl mx-20 p-8 flex items-center justify-between">
              <p id="name" className="text-white text-4xl">
                {name}
              </p>
              <LogoutButton />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-5 md:flex-row md:w-[calc(100%-10rem)] justify-between mt-10 mb-10 w-[calc(100%-10rem)] ">
            <div
              className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center"
              style={{ backgroundColor: 'var(--persian-pink)' }}
            >
              <p>Rol</p>
              <h2 id="role" className="font-thin text-3xl">
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
                <h2 id="average_time" className="font-thin text-3xl">
                  {duration}
                </h2>
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
              <h2 id="total_calls" className="font-thin text-3xl">
                {nCalls}
              </h2>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
