'use client';
import React, { useEffect, useState } from 'react';
import MultilineTextFields from '@/components/MultilineTextFields';
import SuggestedPrompt from '@/components/SuggestedPrompt';
import TextBubble from '@/components/TextBubble';
import { useChatbot } from '@/hooks/useChatbot';
import { useSuggestedPrompts } from '@/hooks/useSuggestedPrompts';

const formatSteps = (text: string): string[] => {
  //Enumarate steps if response has them
  const steps = text.split(/\n?\s*\d+\.\s+/).filter(Boolean);
  if (steps.length > 1) return steps;

  //Else try to split into paragraphs
  return text.split(/(?<=[.?!])\s+(?=[A-ZÁÉÍÓÚ])/).filter(Boolean);
};

const Chatbot = () => {
  const { postChatbot, data, loading, error } = useChatbot();
  const {
    getSuggestions,
    data: promptsData,
    loading: loadingPrompts,
    error: suggestionsError,
  } = useSuggestedPrompts();
  const [inputText, setInputText] = useState('');
  const [hasSent, setHasSent] = useState(false);
  const [lastSentMessage, setLastSentMessage] = useState('');

  useEffect(() => {
    getSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!loading && !error && (
        <div className="relative w-full min-h-screen flex flex-col lg:pl-[256px] pt-[140px] md:pt-28 lg:pt-[150px]">
          <div className="text-5xl font-bold px-10">
            Bienvenido Luis. Que te gustaría hacer?
          </div>
          {!hasSent && (
            <div className="flex justify-between gap-10 p-20">
              <SuggestedPrompt
                title={promptsData?.[0] || 'Prompt 1'}
                onClick={() => {
                  setInputText('');
                  setLastSentMessage(promptsData?.[0] || '');
                  setHasSent(true);
                  postChatbot(promptsData?.[0] || '');
                }}
              />
              <SuggestedPrompt
                title={promptsData?.[1] || 'Prompt 2'}
                onClick={() => {
                  setInputText('');
                  setLastSentMessage(promptsData?.[1] || '');
                  setHasSent(true);
                  postChatbot(promptsData?.[1] || '');
                }}
              />
              <SuggestedPrompt
                title={promptsData?.[2] || 'Prompt 3'}
                onClick={() => {
                  setInputText('');
                  setLastSentMessage(promptsData?.[2] || '');
                  setHasSent(true);
                  postChatbot(promptsData?.[2] || '');
                }}
              />
            </div>
          )}
          {hasSent && (
            <div className="flex flex-col justify-start gap-10 p-20 min-h-[30rem] h-[30rem] overflow-scroll">
              {loading && <p>loading...</p>}
              {data && (
                <>
                  {!loadingPrompts && !suggestionsError && (
                    <>
                      <TextBubble message={lastSentMessage} isUser={true} />
                      <TextBubble
                        message={formatSteps(data).join('\n\n')}
                        isUser={false}
                      />
                    </>
                  )}
                  {suggestionsError && (
                    <p className="text-2xl">Error cargando sugerencias</p>
                  )}
                </>
              )}
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
                postChatbot(inputText);
                setLastSentMessage(inputText);
                setInputText('');
              }}
              className="rounded-xl my-10 hover:cursor-pointer bg-[#13202A] text-white p-2"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
