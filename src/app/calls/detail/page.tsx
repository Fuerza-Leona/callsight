'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TranscriptBubble from '@/components/TranscriptBubble';
import { useUser } from '@/context/UserContext';
import { useSpecificCall } from '@/hooks/useSpecificCall';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Box, CircularProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import Image from 'next/image';

// Client component that uses useSearchParams
function CallDetail() {
  const searchParams = useSearchParams();
  const call_id = searchParams.get('call_id');

  const { user } = useUser();
  const isClient = user?.role === 'client';

  const {
    getSpecificCall,
    data: callData,
    loading: loadingCall,
  } = useSpecificCall();

  useEffect(() => {
    if (!call_id || call_id.trim() === '') return;

    getSpecificCall(call_id);
    console.log('ENTIRE call data: ', callData); //Ver que respuesta da
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call_id]);

  const call = callData;

  const renderTranscript = () => {
    if (!call || !Array.isArray(call.messages)) return <p>No hay mensajes</p>;

    const sortedMessages = [...call.messages].sort(
      (a, b) => a.offsetmilliseconds - b.offsetmilliseconds
    );

    return sortedMessages.map((msg) => {
      const isFromClient = msg.role === 'client';
      const bubbleUser =
        (isClient && isFromClient) || (!isClient && !isFromClient)
          ? 'me'
          : 'you';

      return (
        <TranscriptBubble
          key={msg.message_id}
          color={bubbleUser === 'me' ? 'pink' : 'blue'}
          user={bubbleUser}
          message={msg.text}
        />
      );
    });
  };

  const renderParticipants = () => {
    if (!call || !call.participants || !Array.isArray(call.participants))
      return <div>No hay participantes.</div>;

    return call.participants.map((participant, index) => {
      const role = participant.users.role?.toLowerCase() || '';
      const username =
        participant.users.username || `Participante ${index + 1}`;
      const participantIsClient = role === 'client';

      const color =
        (isClient && participantIsClient) || (!isClient && !participantIsClient)
          ? 'bg-[#F294CD]'
          : 'bg-[#13202A] text-white';

      return (
        <div
          key={index}
          className="flex w-full lg:w-50 h-13 rounded-lg justify-start items-center py-2"
        >
          <div
            className={`w-8 h-8 ${color} rounded-3xl flex items-center justify-center font-bold`}
          >
            {username[0]}
          </div>
          <div className="pl-2">{username}</div>
        </div>
      );
    });
  };

  const callDate = call?.conversation?.start_time
    ? call.conversation.start_time.split('T')[0]
    : loadingCall
      ? '...'
      : 's.f.';

  return (
    <div className="relative lg:left-64 pt-7 w-[98%] lg:w-[81%] flex flex-col gap-3 max-w-screen pl-3">
      <div className="flex flex-col md:flex-row items-center justify-between ">
        <div className="text-4xl font-bold">
          {loadingCall ? (
            <Box display="flex" alignItems="center" height="42px">
              <CircularProgress size={40} />
            </Box>
          ) : (
            call?.conversation.conversation_id
          )}
        </div>
        <div className="flex gap-2">
          <div className="text-[#FFFFFF] rounded-md block"></div>
        </div>
      </div>

      <div className="flex w-full gap-4 text-center pb-1">
        <div
          className="w-[33%] rounded-md flex flex-col items-left justify-left gap-3 p-3 shadow-md"
          style={{ backgroundColor: 'white', height: '110px' }}
        >
          <div className="flex gap-2 text-md items-left font-bold">
            <h1>Fecha de la llamada</h1>
          </div>
          <div className="text-5xl font-bold flex justify-left items-left h-16 flex-grow">
            {loadingCall ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={30} />
              </Box>
            ) : (
              callDate
            )}
          </div>
        </div>
        <div
          className="w-[33%] shadow-md rounded-md flex flex-col items-left justify-left items-left gap-3 p-3"
          style={{ backgroundColor: 'white', height: '110px' }}
        >
          <div className="flex gap-2 text-md items-left font-bold">
            <h1>Duración de la llamada</h1>
          </div>
          <div className="text-5xl font-bold flex justify-left items-left h-16 flex-grow">
            {loadingCall ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                {call?.summary.duration}
                <span className="text-sm pl-3 pt-6 font-light"> minutos</span>
              </>
            )}
          </div>
        </div>
        <div
          className="w-[33%] shadow-md rounded-md flex flex-col items-left justify-left items-left gap-3 p-3"
          style={{ backgroundColor: 'white', height: '110px' }}
        >
          <div className="flex gap-2 text-md items-left font-bold">
            <h1>Promedio de evaluación</h1>
          </div>
          <div className="text-5xl font-bold flex justify-left items-left h-16 flex-grow">
            {loadingCall ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                0.0
                <span className="text-sm pl-3 pt-6 font-light">
                  {' '}
                  de 0 reseñas
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col lg:flex-row w-[calc(100%)] justify-between mt-2 text-left gap-5`}
      >
        <div className="flex flex-col bg-white p-3 rounded-md justify-start shadow-md lg:w-1/3">
          <div className="flex flex-col justify-start py-1">
            {loadingCall ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <CircularProgress size={40} />
              </Box>
            ) : call?.summary ? (
              <>
                <div className="text-black">
                  <div className="flex text-md items-left font-bold">
                    <h1 className="mb-2">Problema</h1>
                  </div>
                  <div className="text-md">{call.summary.problem}</div>
                </div>
                <div className="text-black mt-8 mb-1">
                  <div className="flex text-md items-left font-bold">
                    <h1 className="mb-2">Solución</h1>
                  </div>
                  <div className="text-md">{call.summary.solution}</div>
                </div>
              </>
            ) : (
              <div className="text-lg text-gray-700">
                No hay problema/solución disponible.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-md p-3 flex flex-col justify-left shadow-md lg:w-1/3">
          <div className="flex text-md items-left font-bold">
            <h1 className="mt-1">Emociones detectadas del cliente</h1>
          </div>
          <Box
            sx={{
              width: '100%',
              maxWidth: 600,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {loadingCall ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="200px"
              >
                <CircularProgress size={60} />
              </Box>
            ) : (
              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.value.toFixed(3)}`,
                    data: [
                      {
                        id: 0,
                        value: call?.summary.positive ?? 0,
                        label: 'Positivo',
                      },
                      {
                        id: 1,
                        value: call?.summary.neutral ?? 0,
                        label: 'Neutro',
                      },
                      {
                        id: 2,
                        value: call?.summary.negative ?? 0,
                        label: 'Negativo',
                      },
                    ],
                  },
                ]}
                width={350}
                height={200}
                className="font-bold text-xl pt-5"
                colors={['#6564DB', '#F6CF3C', '#F294CD']}
              />
            )}
          </Box>
        </div>

        <div className="bg-white rounded-md p-3 shadow-md lg:w-1/3">
          {call?.company?.logo && (
            <Image
              src={call.company.logo}
              alt="Logo de la empresa"
              className="rounded-full mt-2 mb-4 object-cover"
            />
          )}
          <div className="flex gap-2 text-md items-left font-bold pt-3 mb-2">
            <h1>Participantes</h1>
          </div>
          <div className="flex flex-col gap-3">
            {loadingCall ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100px"
              >
                <CircularProgress size={40} />
              </Box>
            ) : (
              renderParticipants()
            )}
          </div>
        </div>
      </div>

      <div className="flex w-[calc(100%)] justify-start gap-31 mt-4 bg-white rounded-xl mb-3 shadow-lg">
        <div className="flex flex-col w-full px-4 py-4 gap-2" id="transcript">
          <div className="flex text-md items-left font-bold">
            <h1 className="mt-1 mb-4">Transcripción</h1>
          </div>
          {loadingCall ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="150px"
            >
              <CircularProgress size={50} />
            </Box>
          ) : (
            renderTranscript()
          )}
        </div>
      </div>
    </div>
  );
}

export default function LlamadaPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
        <CallDetail />
      </Suspense>
    </ProtectedRoute>
  );
}
