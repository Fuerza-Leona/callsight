'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import TranscriptBubble from "../components/TranscriptBubble";

interface EmotionData {
  overall_sentiment: string;
  positive_score: number;
  negative_score: number;
  neutral_score: number;
}

export default function Home() {
  const [issue, setIssue] = useState("");
  const [resolution, setResolution] = useState("");
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [loadingCall, setLoadingCall] = useState(true);
  const [loadingEmotions, setLoadingEmotions] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/analyze/callcenter")
      .then(response => {
        const summaries = response.data;
        setIssue(summaries["Issue task"]?.issue || "No disponible");
        setResolution(summaries["Resolution task"]?.resolution || "No disponible");
      })
      .catch(error => {
        console.error("Error fetching summary:", error);
      })
      .finally(() => {
        setLoadingCall(false);
      });

    axios.get("http://127.0.0.1:8000/analyze/emotions")
      .then(response => {
        const emotionData = response.data.emotions || [];
        setEmotions(emotionData);
      })
      .catch(error => {
        console.error("Error fetching emotions:", error);
      })
      .finally(() => {
        setLoadingEmotions(false);
      });
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px] pt-[65px]">
      <div className="w-full text-start">
        <p className="mx-20">Regresar</p>
        <div className="flex text-white text-4xl justify-between bg-[#13202A] rounded-2xl mx-22">
          <p className="mx-20 p-8">Llamada 1</p>
          <p className="mx-20 p-8">13/03/2025</p>
        </div>
      </div>
      <div className="flex w-[calc(100%-11rem)] justify-between mt-10">
        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <h3 className="text-xl">Categorias:</h3>
            <p className="rounded-lg bg-[#8AD2E6] px-4 py-1">Tecnología</p>
          </div>
          <div className="flex flex-col bg-gray-200 w-120 h-35 rounded-2xl justify-start items-center overflow-scroll">
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
        <div className="flex flex-col bg-gray-200 w-60 h-60 rounded-xl justify-center items-center">
          <h3 className="font-black">Emociones detectadas</h3>
          {loadingEmotions ? (
            <p className="text-lg text-gray-700">Cargando...</p>
          ) : (
            emotions.length > 0 ? (
              emotions.map((emotion, index) => (
                <div key={index} className="text-center">
                  <p>Sentimiento general: {emotion.overall_sentiment}</p>
                  <p>Positivo: {(emotion.positive_score * 100)}%</p>
                  <p>Negativo: {(emotion.negative_score * 100)}%</p>
                  <p>Neutral: {(emotion.neutral_score * 100)}%</p>
                </div>
              ))
            ) : (
              <p>No se detectaron emociones</p>
            )
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex bg-gray-200 w-50 h-13 rounded-lg justify-center items-center">
            <p>Duración: 45 minutos</p>
          </div>

          <h3 className="text-xl">Participantes</h3>

          <div className="flex flex-col gap-3">
            <div className="flex bg-gray-200 w-50 h-13 rounded-lg justify-center items-center gap-5">
              <div className="w-8 h-8 bg-black rounded-3xl"></div>
              <p>Persona 1</p>
            </div>
            <div className="flex bg-gray-200 w-50 h-13 rounded-lg justify-center items-center gap-5">
              <div className="w-8 h-8 bg-black rounded-3xl"></div>
              <p>Persona 2</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-[calc(100%-11rem)] justify-start gap-31 mt-10 bg-gray-200 h-40">
        <div className="flex flex-col w-full" id="testing">
          <TranscriptBubble color="pink" user="me" message="Hola, cómo estás?" />
          <TranscriptBubble color="blue" user="you" message="Bien, y tú?" />
        </div>
      </div>
    </div>
  );
}