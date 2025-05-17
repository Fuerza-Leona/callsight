'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { sideNavLinksClient, sideNavLinksAgent } from '@/constants';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';

import Image from 'next/image';
import { usePrevChatsHistory } from '@/hooks/usePrevChatsHistory';

const ChatbotSideNavItems = () => {
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
    <div className="overflow-y-auto max-h-[calc(30vh)] bg-gray-950/60 rounded-3xl">
      {' '}
      {/* TO DO: Adjust spacing for other sizes, like mobile*/}
      <ul className="flex flex-col items-center text-center gap-4 lg:gap-6 relative z-20 pt-15 md:pt-10">
        <>
          <p className="text-neutral-400 italic">Historial de chats</p>
          {getChatsLoading && (
            <div className="relative w-full flex flex-col py-[50px] items-center text-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin" />
              <p className="text-lg text-gray-600">Cargando chats...</p>
            </div>
          )}
          {getChatsError && (
            <p className="text-neutral-400">Error cargando chats</p>
          )}
          {getChatsData?.map(({ chatbot_conversation_id, title }) => {
            const isActive = activeConversationId === chatbot_conversation_id;

            return (
              <li
                key={chatbot_conversation_id}
                className={`
                ${
                  isActive
                    ? 'text-blue-100'
                    : 'text-neutral-400 hover:text-blue-100'
                }
                max-lg:w-full max-lg:rounded-md py-2 max-lg:px-5
            `}
              >
                <Link
                  href={`/chatbot?conversation_id=${chatbot_conversation_id}`}
                  className={`
                  text-lg lg:text-base 
                  transition-colors w-full block
                  ${isActive ? 'text-blue-100' : 'hover:text-blue-100'}
              `}
                >
                  {title.replace(/^"|"$/g, '')}
                </Link>
              </li>
            );
          })}
        </>
      </ul>
    </div>
  );
};

const SideNavItems = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <ul className="flex flex-col items-center text-center gap-4 lg:gap-6 relative z-20 ">
      <Image
        src="/neoris.png"
        className="mb-10"
        alt="Logo"
        width={150}
        height={50}
        priority
      />
      {user?.role === 'client' && (
        <>
          {sideNavLinksClient.map(({ id, href, name }) => {
            const isActive =
              (name === 'Análisis de llamada' &&
                (pathname.includes('/calls/search') ||
                  pathname.includes('/calls/detail'))) ||
              (name === 'Soporte' && pathname.includes('/support')) ||
              pathname.includes(`/${href}`);

            return (
              <li
                key={id}
                className={`
                    ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }
                    max-lg:w-full max-lg:rounded-md py-2 max-lg:px-5
                `}
              >
                <Link
                  href={`/${href}`}
                  className={`
                      text-lg lg:text-base 
                      transition-colors w-full block
                      ${isActive ? 'text-white' : 'hover:text-white'}
                  `}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </>
      )}
      {user?.role != 'client' && (
        <>
          {sideNavLinksAgent.map(({ id, href, name }) => {
            const isActive =
              (name === 'Análisis de llamada' &&
                (pathname.includes('/calls/search') ||
                  pathname.includes('/calls/detail'))) ||
              (name === 'Soporte' && pathname.includes('/support')) ||
              pathname.includes(`/${href}`);

            return (
              <li
                key={id}
                className={`
                    ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }
                    max-lg:w-full max-lg:rounded-md py-2 max-lg:px-5
                `}
              >
                <Link
                  href={`/${href}`}
                  className={`
                      text-lg lg:text-base 
                      transition-colors w-full block
                      ${isActive ? 'text-white' : 'hover:text-white'}
                  `}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </>
      )}
    </ul>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  return (
    <>
      <div>
        <button
          className="fixed top-4 left-4 z-[100] text-neutral-400 hover:text-white focus:outline-none lg:hidden flex p-3 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Image
            src={isOpen ? '/assets/close.svg' : '/assets/menu.svg'}
            alt="toggle"
            width={24}
            height={24}
            className="w-6 h-6 mt-4"
          />
        </button>

        <aside
          className={`h-screen w-full md:w-64 pt-1 lg:w-64 bg-[#13202A] z-20 transition-all duration-300 ease-in-out fixed left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:fixed lg:translate-x-0`}
        >
          <div className="flex flex-col justify-between h-full py-5">
            <nav className="lg:flex flex-col w-full justify-center">
              <SideNavItems />
              {pathname.includes('chatbot') && (
                <button
                  onClick={() => (window.location.href = '/chatbot')}
                  className="text-neutral-200 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all mx-[1rem] my-[1rem] hover:cursor-pointer hover:text-white"
                >
                  Crear chat
                </button>
              )}
              {pathname.includes('chatbot') && <ChatbotSideNavItems />}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
