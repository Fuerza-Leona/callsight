'use client';
import React, { useEffect, useState } from 'react';
import MultilineTextFields from '@/components/MultilineTextFields';
import SuggestedPrompt from '@/components/SuggestedPrompt';
import TextBubble from '@/components/TextBubble';
import { useChatbot } from '@/hooks/useChatbot';
import { useSuggestedPrompts } from '@/hooks/useSuggestedPrompts';
import { useChatbotConversation } from '@/hooks/useChatbotConversation';

const formatSteps = (text: string): string[] => {
  //Enumarate steps if response has them
  const steps = text.split(/\n?\s*\d+\.\s+/).filter(Boolean);
  if (steps.length > 1) return steps;

  //Else try to split into paragraphs
  return text.split(/(?<=[.?!])\s+(?=[A-ZÁÉÍÓÚ])/).filter(Boolean);
};

const Chatbot = () => {
  const handleStartConversationFromPrompt = (message_value: string) => {
    setInputText('');
    setLastSentMessage(message_value);
    postChatbot(message_value);
    setHasSent(true);
  };

  const handleButtonSubmit = () => {
    if (!hasSent) {
      setHasSent(true);
      postChatbot(inputText);
      setLastSentMessage(inputText);
      setInputText('');
    } else {
      setLastSentMessage(inputText);
      postChatbotConversation(currentConversationID!, inputText);
      setInputText('');
    }
  };

  const { postChatbot, data, loading, error } = useChatbot();
  const {
    postChatbotConversation,
    data: newConversationMessage,
    loading: newConversationMessageLoading,
    error: newConversationMessageError,
  } = useChatbotConversation();

  const {
    getSuggestions,
    data: promptsData,
    loading: loadingPrompts,
    error: suggestionsError,
  } = useSuggestedPrompts();
  const [inputText, setInputText] = useState('');
  const [hasSent, setHasSent] = useState(false);
  const [lastSentMessage, setLastSentMessage] = useState('');
  const [currentConversationID, setCurrentConversationID] = useState<
    string | null
  >(null);

  useEffect(() => {
    getSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.conversation_id) {
      setCurrentConversationID(data.conversation_id);
    }
  }, [data]);

  return (
    <>
      {!loading && !error && (
        <div
          className={`relative w-full min-h-screen flex flex-col lg:pl-[256px] pt-[140px] md:pt-28 ${hasSent ? 'lg:pt-[50px]' : 'lg:pt-[150px]'}`}
        >
          {!hasSent && (
            <div className="text-5xl font-bold px-10">
              Bienvenido Luis. Que te gustaría hacer?
            </div>
          )}
          {!hasSent && !loadingPrompts && !suggestionsError && (
            <div className="flex justify-between gap-10 p-20">
              <SuggestedPrompt
                title={promptsData?.[0] || 'Prompt 1'}
                onClick={() => {
                  handleStartConversationFromPrompt(promptsData?.[0] || '');
                }}
              />
              <SuggestedPrompt
                title={promptsData?.[1] || 'Prompt 2'}
                onClick={() => {
                  handleStartConversationFromPrompt(promptsData?.[1] || '');
                }}
              />
              <SuggestedPrompt
                title={promptsData?.[2] || 'Prompt 3'}
                onClick={() => {
                  handleStartConversationFromPrompt(promptsData?.[2] || '');
                }}
              />
            </div>
          )}
          {!hasSent && suggestionsError && (
            <p className="text-2xl">Error cargando sugerencias</p>
          )}
          {!hasSent && loadingPrompts && (
            <div className="">
              <div className="relative w-full flex flex-col pt-[140px] md:pt-28 lg:h-[350px] items-center text-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin" />
                <p className="text-lg text-gray-600">Cargando sugerencias...</p>
              </div>
            </div>
          )}
          {hasSent && (
            <div className="flex flex-col justify-start gap-10 p-20 min-h-[32rem] h-[32rem] overflow-scroll">
              {loading && <p>loading...</p>}
              {data &&
                !newConversationMessage &&
                ((!newConversationMessageLoading && (
                  <>
                    <TextBubble message={lastSentMessage} isUser={true} />
                    <TextBubble
                      message={formatSteps(data.response).join('\n\n')}
                      isUser={false}
                    />
                  </>
                )) ||
                  (newConversationMessageLoading && (
                    <div className="relative w-full flex flex-col items-center text-center">
                      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin" />
                      <p className="text-lg text-gray-600">
                        Cargando respuesta...
                      </p>
                    </div>
                  )))}
              {data &&
                newConversationMessage &&
                ((!newConversationMessageLoading &&
                  !newConversationMessageError && (
                    <>
                      <TextBubble message={lastSentMessage} isUser={true} />
                      <TextBubble
                        message={formatSteps(newConversationMessage!).join(
                          '\n\n'
                        )}
                        isUser={false}
                      />
                    </>
                  )) ||
                  (newConversationMessageLoading && (
                    <div className="relative w-full flex flex-col items-center text-center">
                      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin" />
                      <p className="text-lg text-gray-600">
                        Cargando respuesta...
                      </p>
                    </div>
                  )))}
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
                handleButtonSubmit();
              }}
              className="rounded-xl my-10 hover:cursor-pointer bg-[#13202A] text-white p-2"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="relative w-full min-h-screen flex flex-col lg:pl-[256px] pt-[140px] md:pt-28 lg:pt-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin" />
            <p className="text-lg text-gray-600">Cargando respuesta...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
