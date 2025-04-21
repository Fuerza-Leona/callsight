'use client';
import React, { useState } from 'react';
import MultilineTextFields from '@/components/MultilineTextFields';
import SuggestedPrompt from '@/components/SuggestedPrompt';
import TextBubble from '@/components/TextBubble';

const Chatbot = () => {
  const [inputText, setInputText] = useState('');
  const [hasSent, setHasSent] = useState(false);

  return (
    <div className="relative w-full min-h-screen flex flex-col lg:pl-[256px] pt-[140px] md:pt-28 lg:pt-[150px]">
      <div className="text-5xl font-bold px-10">
        Bienvenido Luis. Que te gustaría hacer?
      </div>
      {!hasSent && (
        <div className="flex justify-between gap-10 p-20">
          <SuggestedPrompt
            title="Prompt 1"
            onClick={() => {
              setInputText('Prompt 1');
              setHasSent(true);
            }}
          />
          <SuggestedPrompt
            title="Prompt 2"
            onClick={() => {
              setInputText('Prompt 2');
              setHasSent(true);
            }}
          />
          <SuggestedPrompt
            title="Prompt 3"
            onClick={() => {
              setInputText('Prompt 3');
              setHasSent(true);
            }}
          />
        </div>
      )}
      {hasSent && (
        <div className="flex flex-col justify-start gap-10 p-20 min-h-[30rem] h-[30rem] overflow-scroll">
          <TextBubble message="Hola, ¿cómo estás?" isUser={true} />
          <TextBubble message="Estoy bien, gracias. ¿Y tú?" isUser={false} />
          <TextBubble
            message="Todo bien, solo un poco cansado del trabajo."
            isUser={true}
          />
          <TextBubble
            message="Te entiendo, ha sido una semana pesada."
            isUser={false}
          />
          <TextBubble
            message="¿Tienes planes para el fin de semana?"
            isUser={true}
          />
          <TextBubble
            message="Sí, voy a visitar a mis abuelos. ¿Y tú?"
            isUser={false}
          />
          <TextBubble
            message="Pensaba ir al cine, salió una nueva película que quiero ver."
            isUser={true}
          />
          <TextBubble
            message="Suena bien. Avísame si quieres compañía."
            isUser={false}
          />
        </div>
      )}
      <div className="w-full flex flex-col justify-center items-center h-full my-10">
        <MultilineTextFields
          label=""
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ width: '800px', height: '125px' }}
          divider={false}
        />
        <button
          onClick={() => {
            setHasSent(true);
            setInputText('');
          }}
          className="rounded-xl my-10 hover:cursor-pointer bg-[#13202A] text-white p-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
