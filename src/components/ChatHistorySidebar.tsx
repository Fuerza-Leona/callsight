import { usePrevChatsHistory } from '@/hooks/usePrevChatsHistory';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
            <p className="text-center">No tienes chats previos.</p>
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

export default ChatHistorySidebar;
