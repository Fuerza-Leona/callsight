'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import SuggestedPrompt from '@/components/SuggestedPrompt';
import TextBubble from '@/components/TextBubble';
import { useChatbot } from '@/hooks/useChatbot';
import { useSuggestedPrompts } from '@/hooks/useSuggestedPrompts';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChatMessage,
  useChatbotConversationHistoryHistory,
} from '@/hooks/useChatbotConversationHistory';
import { useChatbotConversation } from '@/hooks/useChatbotConversation';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatBotText from '@/components/ChatBotText';
import { usePrevChatsHistory } from '@/hooks/usePrevChatsHistory';

const formatSteps = (text: string): string[] => {
  //Enumarate steps if response has them
  const steps = text.split(/\n?\s*\d+\.\s+/).filter(Boolean);
  if (steps.length > 1) return steps;

  //Else try to split into paragraphs
  return text.split(/(?<=[.?!])\s+(?=[A-ZÁÉÍÓÚ])/).filter(Boolean);
};

const ChatHistorySidebar = () => {
  const {
    getChats,
    data: getChatsData,
    loading: getChatsLoading,
    error: getChatsError,
  } = usePrevChatsHistory();

  useEffect(() => {
    getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchParams = useSearchParams();
  const activeConversationId = searchParams.get('conversation_id');

  return (
    <div className="fixed right-8 top-12 bottom-12 w-64 bg-white shadow-lg rounded-xl z-10 p-6 hidden lg:block border border-gray-200">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Historial de chats
          </h2>
          <button
            onClick={() => {
              window.location.href = '/chatbot';
            }}
            className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
          >
            Nuevo chat
          </button>
        </div>

        <div className="overflow-y-auto flex-grow pr-4">
          {getChatsLoading && (
            <div className="flex flex-col items-center py-5">
              <div
                className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                id="loading_chats"
              />
              <p className="text-sm text-gray-500 mt-2">Cargando chats...</p>
            </div>
          )}

          {getChatsError && (
            <p className="text-red-500 text-center">Error cargando historial</p>
          )}

          <ul className="space-y-2">
            {getChatsData?.map(({ chatbot_conversation_id, title }, index) => {
              const isActive = activeConversationId === chatbot_conversation_id;

              return (
                <li key={chatbot_conversation_id}>
                  <Link
                    id={`chat_${index}`}
                    href={`/chatbot?conversation_id=${chatbot_conversation_id}`}
                    className={`block px-3 py-2 rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors text-sm break-words`}
                  >
                    {title.replace(/^"|"$/g, '')}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ChatbotInner = () => {
  const { user } = useUser();
  const name = user?.username;

  const searchParams = useSearchParams();
  const conversationIdFromParams = searchParams.get('conversation_id');

  const {
    getChatMessages,
    data: historyMessagesData,
    loading: historyMessagesLoading,
    /* error: historyMessagesError, */
  } = useChatbotConversationHistoryHistory();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    if (historyMessagesData) {
      setMessages(historyMessagesData);
    }
  }, [historyMessagesData]);

  const handleStartConversationFromPrompt = async (message_value: string) => {
    const result = await postChatbot(message_value);
    setInputText('');
    setHasSent(true);
    const newUserMessage = {
      role: 'user',
      content: message_value,
      created_at: new Date().toISOString(),
      previous_response_id: null,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    if (result?.response) {
      const newAssistantMessage = {
        role: 'assistant',
        content: result.response,
        created_at: new Date().toISOString(),
        previous_response_id: null,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    }
  };

  const handleButtonSubmit = async () => {
    if (!inputText.trim()) return;

    const newUserMessage = {
      role: 'user',
      content: inputText,
      created_at: new Date().toISOString(),
      previous_response_id: null,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    if (!hasSent) {
      setHasSent(true);
      const result = await postChatbot(inputText);
      setInputText('');
      if (result?.response) {
        const newAssistantMessage = {
          role: 'assistant',
          content: result.response,
          created_at:
            new Date().toISOString() /* Just for the front end. The back handles this and stores it correctly */,
          previous_response_id:
            null /* Just for the front end. The back handles this and stores it correctly */,
        };
        setMessages((prev) => [...prev, newAssistantMessage]);
      }
    } else {
      const result = await postChatbotConversation(
        currentConversationID!,
        inputText
      );
      setInputText('');
      if (result) {
        const newAssistantMessage = {
          role: 'assistant',
          content: result,
          created_at: new Date().toISOString(),
          previous_response_id: null,
        };
        setMessages((prev) => [...prev, newAssistantMessage]);
      }
    }
  };

  const { postChatbot, data, loading, error } = useChatbot();
  const {
    postChatbotConversation,
    loading: newConversationMessageLoading,
    /* error: newConversationMessageError, */
  } = useChatbotConversation();

  const {
    getSuggestions,
    data: promptsData,
    loading: loadingPrompts,
    error: suggestionsError,
  } = useSuggestedPrompts();
  const [inputText, setInputText] = useState('');
  const [hasSent, setHasSent] = useState(false);
  const [currentConversationID, setCurrentConversationID] = useState<
    string | null
  >(null);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      getSuggestions();
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (conversationIdFromParams) {
      setMessages([]);
      setInputText('');
      setHasSent(true);
      setCurrentConversationID(conversationIdFromParams);
      getChatMessages(conversationIdFromParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationIdFromParams]);

  useEffect(() => {
    if (data?.conversation_id) {
      setCurrentConversationID(data.conversation_id);
    }
  }, [data]);

  return (
    <>
      <ChatHistorySidebar />
      {!loading && !error && (
        <div
          className={`relative w-full min-h-screen flex flex-col lg:pl-[256px] lg:pr-[300px]`}
        >
          {!hasSent && (
            <div className="text-5xl font-bold pt-10 px-10">
              <p>Hola {name}.</p>
              <p>¿Qué te gustaría hacer?</p>
            </div>
          )}
          {!hasSent && !loadingPrompts && !suggestionsError && (
            <div className="flex justify-between gap-10 p-20">
              <SuggestedPrompt
                id="suggestion-1"
                title={promptsData?.[0] || 'Prompt 1'}
                onClick={() => {
                  handleStartConversationFromPrompt(promptsData?.[0] || '');
                }}
              />
              <SuggestedPrompt
                id="suggestion-2"
                title={promptsData?.[1] || 'Prompt 2'}
                onClick={() => {
                  handleStartConversationFromPrompt(promptsData?.[1] || '');
                }}
              />
              <SuggestedPrompt
                id="suggestion-3"
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
              <div className="relative w-full flex flex-col pt-[140px] md:pt-28 lg:h-[400px] items-center text-center">
                <div
                  id="loading_prompts"
                  className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin"
                />
                <p className="text-lg text-gray-600">Cargando sugerencias...</p>
              </div>
            </div>
          )}
          {hasSent && (
            <div className="flex flex-col justify-start gap-10 p-20 h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh] overflow-auto">
              {messages.map((msg, i) => (
                <TextBubble
                  index={i}
                  key={i}
                  message={formatSteps(msg.content).join('\n\n')}
                  isUser={msg.role === 'user'}
                />
              ))}
              {(newConversationMessageLoading || historyMessagesLoading) && (
                <div className="relative w-full flex flex-col items-center text-center">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin" />
                  <p className="text-lg text-gray-600">Cargando respuesta...</p>
                </div>
              )}
            </div>
          )}
          <div className="w-full flex flex-col justify-center items-center h-full mt-10">
            <ChatBotText
              label=""
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleButtonSubmit();
                }
              }}
              sx={{ width: '800px', height: '125px' }}
              divider={false}
            />
            <button
              id="submit"
              onClick={() => {
                handleButtonSubmit();
              }}
              className="rounded-xl my-5 hover:cursor-pointer bg-[#13202A] text-white p-4"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="relative w-full min-h-screen flex flex-col lg:pl-[256px] lg:pr-[256px] pt-[140px] md:pt-28 lg:pt-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin" />
            <p className="text-lg text-gray-600">Cargando respuesta...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['client', 'agent', 'admin']}>
      <Suspense
        fallback={<div className="text-white">Cargando chatbot...</div>}
      >
        <ChatbotInner />
      </Suspense>
    </ProtectedRoute>
  );
}
