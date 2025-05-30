'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TranscriptBubble from '@/components/TranscriptBubble';
import { useUser } from '@/context/UserContext';
import { useSpecificCall } from '@/hooks/useSpecificCall';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatbotPopup from '@/components/ChatbotPopup';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Fab,
  Tooltip,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { PieChart } from '@mui/x-charts/PieChart';
import Image from 'next/image';
import { useFetchRating } from '@/hooks/fetchRating';
import { usePostRating } from '@/hooks/userPostRating';
import { Info } from '@mui/icons-material';

// Client component that uses useSearchParams
function CallDetail() {
  const searchParams = useSearchParams();
  const call_id = searchParams.get('call_id');

  const { user } = useUser();
  const isClient = user?.role === 'client';

  const [reviewValue, setReviewValue] = useState<number | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [callRatingData, setCallRatingData] = useState<{
    average: number | 0;
    count: number | 0;
  }>();

  const { postRating } = usePostRating();

  const {
    getSpecificCall,
    data: callData,
    loading: loadingCall,
    error,
  } = useSpecificCall();

  const { loadingRating, showModal, setShowModal, fetchRating } =
    useFetchRating();

  const handleReviewChange = async (
    event: React.SyntheticEvent,
    value: number | null
  ) => {
    if (!call_id || call_id.trim() === '' || !value) return;
    setReviewValue(value);
    try {
      await postRating(call_id, value);

      if (callData) {
        const currentTotal = callData.rating?.average;
        const newCount = callData.rating?.count + 1;
        const newAverage = (currentTotal + value) / newCount;

        setCallRatingData({
          average: newAverage,
          count: newCount,
        });
      } else {
        setCallRatingData({
          average: value,
          count: 1,
        });
      }
    } catch (error) {
      console.error('Error posting rating:', error);
    } finally {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (!call_id || call_id.trim() === '') return;

    const fetchData = async () => {
      await fetchRating(call_id);

      await getSpecificCall(call_id);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call_id]);

  const call = callData;

  useEffect(() => {
    if (call?.rating) {
      setCallRatingData(call.rating);
    }
  }, [call?.rating]);

  const renderTranscript = () => {
    if (error) return error;
    if (!call || !Array.isArray(call.messages)) return 'No hay mensajes';

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
    if (error) return error;

    if (!call || !call.participants || !Array.isArray(call.participants))
      return 'No hay participantes';

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
    <div className="relative lg:left-64 pt-7 w-[98%] lg:w-[calc(100%-17rem)] flex flex-col gap-3 max-w-screen pl-3">
      <div className="flex flex-col md:flex-row items-center justify-between ">
        <div className="text-4xl font-bold">
          {loadingCall || loadingRating ? (
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
            {loadingCall || loadingRating ? (
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
            {loadingCall || loadingRating ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={30} />
              </Box>
            ) : (
              <div id="duration">
                {call?.summary.duration}
                <span className="text-sm pl-3 pt-6 font-light"> minutos</span>
              </div>
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
            {loadingCall || loadingRating ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={30} />
              </Box>
            ) : (
              <div id="rating">
                {callRatingData?.average}
                <span className="text-sm pl-3 pt-6 font-light">
                  {' '}
                  de {callRatingData?.count} reseñas
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col lg:flex-row w-[calc(100%)] justify-between mt-2 text-left gap-5`}
      >
        <div className="flex flex-col bg-white p-3 rounded-md justify-start shadow-md lg:w-1/3">
          <div className="flex flex-col justify-start py-1">
            {loadingCall || loadingRating ? (
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
                  <div id="problem" className="text-md">
                    {call.summary.problem}
                  </div>
                </div>
                <div className="text-black mt-8 mb-1">
                  <div className="flex text-md items-left font-bold">
                    <h1 className="mb-2">Solución</h1>
                  </div>
                  <div id="solution" className="text-md">
                    {call.summary.solution}
                  </div>
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
          <div className="flex gap-2 items-center mb-3">
            <h1 className="text-md font-bold">Emociones del cliente</h1>
            <Tooltip
              title="Gráfico de pastel que muestra la proporción de emociones detectadas del cliente en las conversaciones. Las emociones se clasifican en positivas, neutras y negativas."
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    fontSize: '16px',
                    maxWidth: '300px',
                  },
                },
              }}
            >
              <Info sx={{ fontSize: 20, color: '#666', cursor: 'help' }} />
            </Tooltip>
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
            {loadingCall || loadingRating ? (
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
                    arcLabel: (item) => `${Math.round(item.value * 100)}%`,
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
          <div className="flex gap-2 text-md items-left font-bold mb-3">
            <h1>Empresa</h1>
          </div>
          {call?.company?.logo && (
            <Image
              id="logo"
              src={call.company.logo}
              width={200}
              height={200}
              alt="Logo de la empresa"
              className="rounded-full mt-2 mb-4 object-cover"
            />
          )}
          <div className="flex gap-2 text-md items-left font-bold mt-8 mb-2">
            <h1>Participantes</h1>
          </div>
          <div className="flex flex-col gap-3">
            {loadingCall || loadingRating ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100px"
              >
                <CircularProgress size={40} />
              </Box>
            ) : (
              <div id="participants">{renderParticipants()}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-[calc(100%)] justify-start gap-31 mt-4 bg-white rounded-xl mb-3 shadow-lg">
        <div className="flex flex-col w-full px-4 py-4 gap-2" id="transcript">
          <div className="flex gap-2 items-center mb-3">
            <h1 className="text-md font-bold">Transcripción</h1>
            <Tooltip
              title="La transcripción de la llamada muestra el texto de la conversación entre el cliente y el agente. Los mensajes están ordenados cronológicamente. Los textos de la izquierda son del agente y los de la derecha del cliente."
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    fontSize: '16px',
                    maxWidth: '300px',
                  },
                },
              }}
            >
              <Info sx={{ fontSize: 20, color: '#666', cursor: 'help' }} />
            </Tooltip>
          </div>
          {loadingCall || loadingRating ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="150px"
            >
              <CircularProgress size={50} />
            </Box>
          ) : (
            <div id="transcript">{renderTranscript()}</div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Califica esta llamada</DialogTitle>
        <DialogContent>
          <Rating
            name="call-review"
            value={reviewValue}
            onChange={handleReviewChange}
            size="large"
            max={5}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Chatbot Button */}
      <Fab
        aria-label="chat"
        onClick={() => setChatbotOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          color: '#fff',
          backgroundColor: '#13202A',
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chatbot Popup */}
      {call?.conversation?.conversation_id && (
        <ChatbotPopup
          open={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
          conversationId={call.conversation.conversation_id}
        />
      )}
    </div>
  );
}

export default function LlamadaPage() {
  return (
    <ProtectedRoute allowedRoles={['client', 'agent', 'admin']}>
      <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
        <CallDetail />
      </Suspense>
    </ProtectedRoute>
  );
}
