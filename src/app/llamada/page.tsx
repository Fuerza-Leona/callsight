'use client';

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from 'react-responsive';
import TranscriptBubble from "../components/TranscriptBubble";
import { useUser } from "@/context/UserContext";
import { useMessages } from "@/hooks/useMessages";
import { useSummary } from "@/hooks/useSummary";
import { useParticipants } from "@/hooks/useParticipantsFromCall";

export default function LlamadaPage() {
  const searchParams = useSearchParams();
  const call_id = searchParams.get("call_id");

  const { user } = useUser();
  const isClient = user?.role === "client";
  const isTablet = useMediaQuery({ minWidth: 1000, maxWidth: 1310 });

  const { getMessages, data: messageData, loading: loadingMessages } = useMessages();
  const { getSummary, data: summaryData, loading: loadingSummary } = useSummary();
  const { getParticipants, data: participantsData, loading: loadingParticipants } = useParticipants();

  useEffect(() => {
    if (!call_id || call_id.trim() === "") return;

    getSummary(call_id);
    getMessages(call_id);
    getParticipants(call_id);
    console.log("PARTICIPANTS: ", participantsData) //NULL
  }, [call_id]);

  useEffect(() => {
    if (summaryData) {
      console.log("SUMMARY DATA UPDATED:", summaryData);
    }
  }, [summaryData]);

  const summary = summaryData && summaryData.length > 0 ? summaryData[0] : null;
  const participants = participantsData && participantsData.length > 0 ? participantsData[0] : null;

  const renderTranscript = () => {
    if (loadingMessages) return <p className="text-gray-700">Cargando mensajes...</p>;
    if (!messageData || !Array.isArray(messageData)) return <p>No hay mensajes</p>;

    const sortedMessages = [...messageData].sort((a, b) => a.offsetmilliseconds - b.offsetmilliseconds);

    return sortedMessages.map((msg) => {
      const isFromClient = msg.role === "client";
      const bubbleUser = (isClient && isFromClient) || (!isClient && !isFromClient) ? "me" : "you";

      return (
        <TranscriptBubble
          key={msg.message_id}
          color={bubbleUser === "me" ? "pink" : "blue"}
          user={bubbleUser}
          message={msg.text}
        />
      );
    });
  };
  const renderParticipants = () => {
    if (loadingParticipants) return <p className="text-gray-700">Cargando participantes...</p>;
    if (!participantsData || !Array.isArray(participantsData)) return <p>No hay participantes.</p>;
  
    return participantsData.map((participant, index) => {
      const role = participant.users.role?.toLowerCase() || "";
      const username = participant.users.username || `Participante ${index + 1}`;
      const participantIsClient = role === "client";
  
      const color = (isClient && participantIsClient) || (!isClient && !participantIsClient)
        ? "bg-[#F294CD]"
        : "bg-[#13202A] text-white";
  
      return (
        <div key={index} className="flex bg-gray-200 w-full lg:w-50 h-13 rounded-lg justify-start items-center gap-5 px-4 py-2">
          <div className={`w-8 h-8 ${color} rounded-3xl flex items-center justify-center font-bold`}>
            {username[0]}
          </div>
          <p>{username}</p>
        </div>
      );
    });
  };

  return (
    <div className="lg:relative absolute w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px] pt-[140px] lg:pt-28">
      <div className="w-full text-center">
        <div className="flex lg:flex-row flex-col text-white text-4xl justify-between bg-[#13202A] rounded-2xl mx-22">
          <p className="lg:ml-20 p-4 lg:p-8">Llamada</p>
          <p className="lg:mr-20 p-4 lg:p-8">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className={`flex ${isTablet ? "flex-col" : "flex-col lg:flex-row"} w-[calc(100%-11rem)] justify-between mt-10`}>
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <h3 className="text-xl">Categorías:</h3>
            <p className="rounded-lg bg-[#8AD2E6] px-4 py-1">Tecnología</p>
          </div>

          <div className={`flex flex-col bg-gray-200 ${isTablet ? "w-full mb-5" : "w-full lg:w-120 mb-5 lg:mb-0"} h-47 rounded-2xl justify-start items-center overflow-scroll`}>
            <p className="text-2xl mt-4">Resumen</p>
            {loadingSummary ? (
              <p className="text-lg text-gray-700">Cargando...</p>
            ) : summary ? (
              <>
                <p className="text-lg"><span className="font-bold">Problema:</span> {summary.problem}</p>
                <p className="text-lg"><span className="font-bold">Resolución:</span> {summary.solution}</p>
              </>
            ) : (
              <p className="text-lg text-gray-700">No hay resumen disponible.</p>
            )}
          </div>
        </div>

        {/* Emotions */}
        <div className={`flex flex-col bg-gray-200 ${isTablet ? "w-full mb-5" : "w-full lg:w-60 mb-5 lg:mb-0"} h-60 rounded-xl justify-center items-center`}>
          <h3 className="font-black">Emociones detectadas</h3>
          {loadingSummary ? (
            <p className="text-lg text-gray-700">Cargando...</p>
          ) : summary ? (
            <div className="text-center">
              <p>Sentimiento general: {
                summary.positive > summary.negative
                  ? "Positivo"
                  : summary.negative > summary.positive
                  ? "Negativo"
                  : "Neutral"
              }</p>
              <p>Positivo: {(summary.positive * 100).toFixed(2)}%</p>
              <p>Negativo: {(summary.negative * 100).toFixed(2)}%</p>
              <p>Neutral: {(summary.neutral * 100).toFixed(2)}%</p>
            </div>
          ) : (
            <p>No hay datos de emociones.</p>
          )}
        </div>

        {/* Participants + duration */}
        <div className={`flex ${isTablet ? "flex-row" : "flex-col"} gap-5`}>
          <div className="flex bg-gray-200 w-full lg:w-50 h-13 rounded-lg justify-center items-center">
            <p>Duración: {summary ? `${summary.duration} minutos` : "..."}</p>
          </div>
          <h3 className="text-xl">Participantes</h3>
          <div className="flex flex-col gap-3">

            {renderParticipants()}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="flex w-[calc(100%-11rem)] justify-start gap-31 mt-10 bg-gray-200 h-40 overflow-y-scroll">
        <div className="flex flex-col w-full px-4 py-4 gap-2" id="transcript">
          {renderTranscript()}
        </div>
      </div>
    </div>
  );
}