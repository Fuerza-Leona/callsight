'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import TranscriptBubble from "../components/TranscriptBubble";
import { useMediaQuery } from 'react-responsive';
import { apiURL } from "../constants";
import { useUser } from "@/context/UserContext";
import { useMessages } from "@/hooks/useMessages";

interface EmotionData {
  overall_sentiment: string;
  positive_score: number;
  negative_score: number;
  neutral_score: number;
}

export default function LlamadaPage() {
  const searchParams = useSearchParams();
  const call_id = searchParams.get("call_id");

  const [issue, setIssue] = useState("");
  const [resolution, setResolution] = useState("");
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [loadingCall, setLoadingCall] = useState(true);
  const [loadingEmotions, setLoadingEmotions] = useState(true);

  const { user } = useUser();
  const isClient = user?.role === "client";
  const { getMessages, data: messageData, loading: loadingMessages } = useMessages();
  const isTablet = useMediaQuery({ minWidth: 1000, maxWidth: 1310 });

  useEffect(() => {
    console.log("call_id inside useEffect:", call_id);
    if (!call_id || call_id.trim() === "") return;

    axios.get(`${apiURL}/analisis/problem/${call_id}`)
      .then(response => {
        const summaries = response.data.data;
        setIssue(summaries.problem || "No disponible");
        setResolution(summaries.solution || "No disponible");
      })
      .catch(error => console.error("Error fetching summary:", error))
      .finally(() => setLoadingCall(false));

    axios.get(`${apiURL}/analyze/emotions?call_id=${call_id}`)
      .then(response => {
        const emotionData = response.data.emotions || [];
        setEmotions(emotionData);
      })
      .catch(error => console.error("Error fetching emotions:", error))
      .finally(() => setLoadingEmotions(false));

    getMessages(call_id);
  }, [call_id]);

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

  return (
    <div className="lg:relative absolute w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px] pt-[140px] lg:pt-28 lg:pt-[65px]">
      <div className="w-full text-center">
        <div className="flex lg:flex-row flex-col text-white text-4xl justify-between bg-[#13202A] rounded-2xl mx-22">
          <p className="lg:ml-20 p-4 lg:p-8">Llamada</p>
          <p className="lg:mr-20 p-4 lg:p-8">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* same layout structure as before */}
      <div className={`flex ${isTablet ? "flex-col" : "flex-col lg:flex-row"} w-[calc(100%-11rem)] justify-between mt-10`}>
        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <h3 className="text-xl">Categorías:</h3>
            <p className="rounded-lg bg-[#8AD2E6] px-4 py-1">Tecnología</p>
          </div>

          <div className={`flex flex-col bg-gray-200 ${isTablet ? "w-full mb-5" : "w-full lg:w-120 mb-5 lg:mb-0"} h-47 rounded-2xl justify-start items-center overflow-scroll`}>
            {loadingCall ? (
              <>
                <p className="text-2xl mt-10">Resumen</p>
                <p className="text-lg text-gray-700">Cargando...</p>
              </>
            ) : (
              <>
                <p className="text-2xl">Resumen</p>
                <p className="text-lg"><span className="font-bold">Problema:</span> {issue}</p>
                <p className="text-lg"><span className="font-bold">Resolución:</span> {resolution}</p>
              </>
            )}
          </div>
        </div>

        <div className={`flex flex-col bg-gray-200 ${isTablet ? "w-full mb-5" : "w-full lg:w-60 mb-5 lg:mb-0"} h-60 rounded-xl justify-center items-center`}>
          <h3 className="font-black">Emociones detectadas</h3>
          {loadingEmotions ? (
            <p className="text-lg text-gray-700">Cargando...</p>
          ) : (
            emotions.length > 0 ? (
              emotions.map((emotion, index) => (
                <div key={index} className="text-center">
                  <p>Sentimiento general: {emotion.overall_sentiment}</p>
                  <p>Positivo: {(emotion.positive_score * 100).toFixed(2)}%</p>
                  <p>Negativo: {(emotion.negative_score * 100).toFixed(2)}%</p>
                  <p>Neutral: {(emotion.neutral_score * 100).toFixed(2)}%</p>
                </div>
              ))
            ) : (
              <p>No se detectaron emociones</p>
            )
          )}
        </div>

        <div className={`flex ${isTablet ? "flex-row" : "flex-col"} gap-5`}>
          <div className="flex bg-gray-200 w-full lg:w-50 h-13 rounded-lg justify-center items-center">
            <p>Duración: 45 minutos</p>
          </div>
          <h3 className="text-xl">Participantes</h3>
          <div className="flex flex-col gap-3">
            <div className="flex bg-gray-200 w-full lg:w-50 h-13 rounded-lg justify-center items-center gap-5">
              <div className="w-8 h-8 bg-black rounded-3xl"></div>
              <p>Persona 1</p>
            </div>
            <div className="flex bg-gray-200 w-full lg:w-50 h-13 rounded-lg justify-center items-center gap-5">
              <div className="w-8 h-8 bg-black rounded-3xl"></div>
              <p>Persona 2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[calc(100%-11rem)] justify-start gap-31 mt-10 bg-gray-200 h-40 overflow-y-scroll">
        <div className="flex flex-col w-full px-4 py-4 gap-2" id="transcript">
          {renderTranscript()}
        </div>
      </div>
    </div>
  );
}