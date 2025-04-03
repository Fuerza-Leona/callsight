'use client';

import { use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from 'react-responsive';
import TranscriptBubble from "../components/TranscriptBubble";
import { useUser } from "@/context/UserContext";
import { useSpecificCall } from "@/hooks/useSpecificCall";

export default function LlamadaPage() {
  const searchParams = useSearchParams();
  const call_id = searchParams.get("call_id");

  const { user } = useUser();
  const isClient = user?.role === "client";
  const isTablet = useMediaQuery({ minWidth: 1000, maxWidth: 1310 });

  const { getSpecificCall, data: callData, loading: loadingCall } = useSpecificCall();

  useEffect(() => {
    if (!call_id || call_id.trim() === "") return;

    getSpecificCall(call_id);
    console.log("ENTIRE call data: ", callData) //Ver que respuesta da
  }, [call_id]);

  useEffect(() => {
    if (callData) {
      console.log("Updated call data: ", callData); //Ver respuesta
    }
  }, [callData]);

  const call = callData;

  const renderTranscript = () => {
    if (loadingCall) return <p className="text-gray-700">Cargando mensajes...</p>;
    if (!call || !Array.isArray(call.messages)) return <p>No hay mensajes</p>;

    const sortedMessages = [...call.messages].sort((a, b) => a.offsetmilliseconds - b.offsetmilliseconds);

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
    if (loadingCall) return <p className="text-gray-700">Cargando participantes...</p>;
    if (call === null || !call.participants || !Array.isArray(call.participants)) return <p>No hay participantes.</p>;
  
    return call.participants.map((participant, index) => {
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

  const callDate = call?.conversation?.start_time? call.conversation.start_time.split("T")[0] : loadingCall? "..." : "s.f.";

  return (
    <div className="lg:relative absolute w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px] pt-[140px] lg:pt-28">
      <div className="w-full text-center">
        <div className="flex lg:flex-row flex-col text-white text-4xl justify-between bg-[#13202A] rounded-2xl mx-22">
          {/* Llamada id */}
          <p className="lg:ml-20 p-4 lg:p-8">Llamada</p>
          <p className="lg:mr-20 p-4 lg:p-8">{callDate}</p>
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
            {loadingCall ? (
              <p className="text-lg text-gray-700">Cargando...</p>
            ) : call?.summary ? (
              <>
                <p className="text-lg"><span className="font-bold">Problema:</span> {call.summary.problem}</p>
                <p className="text-lg"><span className="font-bold">Resolución:</span> {call.summary.solution}</p>
              </>
            ) : (
              <p className="text-lg text-gray-700">No hay resumen disponible.</p>
            )}
          </div>
        </div>

        {/* Emotions */}
        <div className={`flex flex-col bg-gray-200 ${isTablet ? "w-full mb-5" : "w-full lg:w-60 mb-5 lg:mb-0"} h-60 rounded-xl justify-center items-center`}>
          <h3 className="font-black">Emociones detectadas</h3>
          {loadingCall ? (
            <p className="text-lg text-gray-700">Cargando...</p>
          ) : call?.summary ? (
            <div className="text-center">
              <p>Sentimiento general: {
                call.summary.positive > call.summary.negative
                  ? "Positivo"
                  : call.summary.negative > call.summary.positive
                  ? "Negativo"
                  : "Neutral"
              }</p>
              <p>Positivo: {(call.summary.positive * 100).toFixed(2)}%</p>
              <p>Negativo: {(call.summary.negative * 100).toFixed(2)}%</p>
              <p>Neutral: {(call.summary.neutral * 100).toFixed(2)}%</p>
            </div>
          ) : (
            <p>No hay datos de emociones.</p>
          )}
        </div>

        {/* Participants + duration */}
        <div className={`flex ${isTablet ? "flex-row" : "flex-col"} gap-5`}>
          <div className="flex bg-gray-200 w-full lg:w-50 h-13 rounded-lg justify-center items-center">
            <p>Duración: {call?.summary ? `${call.summary.duration} minutos` : "..."}</p>
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