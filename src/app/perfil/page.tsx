'use client';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useFetchProfile } from '@/hooks/fetchPerfil';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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

  const department = user?.department;
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
                    : 'Cliente'}
              </h2>
            </div>

            {userRole != 'client' && (
              <div
                className="flex flex-col md:w-60 md:h-35 h-28 rounded-2xl justify-center items-center"
                style={{ backgroundColor: 'var(--jonquil)' }}
              >
                <p>Empresa</p>
                <h2 className="font-thin text-3xl">{department}</h2>
              </div>
            )}

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
              <p>Satisfacción promedio del cliente</p>

              <h2 className="font-thin text-3xl">{satisfaction}</h2>
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
