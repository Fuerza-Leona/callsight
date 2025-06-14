'use client';

import React, { useEffect, useState } from 'react';
import { useRealtimeSession } from '@/hooks/useRealtimeSession';
import MoodCard from '@/components/MoodCard';
import { moods } from '@/constants';
import AudioVisualizer from '@/components/AudioVisualizer';

const Entrenamiento = () => {
  const {
    initRealtime,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendTextInput,
    stopSession,
    connected,
    audioEl,
    analyserNode,
  } = useRealtimeSession();

  useEffect(() => {
    audioEl.setAttribute('controls', 'true');
    document.body.appendChild(audioEl);
    return () => {
      audioEl.remove();
    };
  }, [audioEl]);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(
    null
  );
  const [selectedVoice, setSelectedVoice] = useState<string>();

  const handleSelectMood = (
    mood: string,
    description: string,
    voice: string
  ) => {
    setSelectedMood(mood);
    setSelectedDescription(description);
    setSelectedVoice(voice);
    setSelectedClient(mood);
  };

  const handleConnect = () => {
    if (selectedMood && selectedDescription) {
      initRealtime(selectedMood, selectedDescription, selectedVoice);
    } else {
      alert('Selecciona un estado de ánimo para comenzar.');
    }
  };

  const [selectedClient, setSelectedClient] = useState<string>('Ninguno');

  return (
    <>
      <div className="fixed right-8 top-12 bottom-12 w-72 bg-white shadow-xl rounded-xl z-10 p-6 border border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Simulador</h2>
        <p className="text-sm text-gray-600 mb-4">
          Interactúa con un cliente mediante una llamada simulada. Es necesario
          el uso del micrófono.
        </p>
        <p className="font-semibold">Cliente seleccionado: </p>
        <p className="text-gray-700 text-sm mb-2">{selectedClient}</p>
        {!connected ? (
          <button
            onClick={handleConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Comenzar
          </button>
        ) : (
          <>
            {/* <input
              type="text"
              placeholder="Escribe y presiona Enter"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}
            <button
              onClick={stopSession}
              className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Detener sesión
            </button>
          </>
        )}
      </div>

      <div
        className={`relative w-full min-h-screen flex flex-col lg:pl-[256px] lg:pr-[300px] overflow-hidden`}
      >
        <div className="text-5xl font-bold pt-10 px-10">
          <p>Entrenamiento para llamadas</p>
        </div>

        {!connected && (
          <div className="w-full flex flex-col justify-center items-center h-full mt-10 ml-1">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moods.map((m) => (
                <MoodCard
                  key={m.mood}
                  mood={m.mood}
                  description={m.description}
                  imageUrl={m.imageUrl}
                  voice={m.voice}
                  onClick={() =>
                    handleSelectMood(m.mood, m.description, m.voice)
                  }
                />
              ))}
            </div>
          </div>
        )}
        {connected && <AudioVisualizer analyserNode={analyserNode} />}
      </div>
    </>
  );
};

export default Entrenamiento;
