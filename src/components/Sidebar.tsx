'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  useSideNavLinksClient,
  sideNavLinksAgent,
  sideNavLinksAdmin,
} from '@/constants';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { usePrevChatsHistory } from '@/hooks/usePrevChatsHistory';
import { AccountCircle } from '@mui/icons-material';

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
      <ul className="flex flex-col items-center text-center gap-4 lg:gap-6 relative z-20 pt-15 md:pt-10">
        <p className="text-neutral-400 italic">Historial de chats</p>
        {getChatsLoading && (
          <div className="relative w-full flex flex-col py-[50px] items-center text-center">
            <div
              className="w-10 h-10 border-4 border-gray-300 border-t-[#13202A] rounded-full animate-spin"
              id="loading_chats"
            />
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
      </ul>
    </div>
  );
};

const AdminNavSection = () => {
  const pathname = usePathname();
  const [adminOpen, setAdminOpen] = useState(false);
  const [asistentesOpen, setAsistentesOpen] = useState(false);

  // Find the dropdown items by their structure
  const administracionDropdown = sideNavLinksAdmin.find(
    (link) => link.name === 'Administración' && link.isDropdown
  );
  const asistentesDropdown = sideNavLinksAdmin.find(
    (link) => link.name === 'IA' && link.isDropdown
  );

  // Get other items that are not dropdowns
  const otherItems = sideNavLinksAdmin.filter(
    (link) => !link.isDropdown && link.href
  );

  return (
    <>
      {/*  and profile icon */}
      <div className="flex justify-between items-center px-5 mb-16">
        <Image src="/neoris.png" alt="Logo" width={100} height={50} priority />
        <Link href="/perfil" className="mr-4">
          <AccountCircle
            sx={{
              fontSize: 32,
              color: '#9CA3AF',
              '&:hover': {
                color: '#F3F4F6',
              },
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
          />
        </Link>
      </div>

      {/* Asistentes Dropdown */}
      <div className="w-full px-5 mt-8 mb-8 text-lg">
        <button
          className="text-neutral-400 mb-4 flex items-center"
          onClick={() => setAsistentesOpen(!asistentesOpen)}
        >
          Inteligencia Artificial {asistentesOpen ? '▴' : '▾'}
        </button>
        {asistentesOpen && asistentesDropdown?.children && (
          <ul className="pl-2 flex flex-col gap-4">
            {asistentesDropdown.children.map(({ id, href, name }) => {
              const isActive = href && pathname.includes(`/${href}`);
              return (
                <li
                  key={id}
                  className={`${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-neutral-400 text-xl hover:text-white'
                  }`}
                >
                  <Link href={`/${href}`} className="text-base block text-lg">
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Other links */}
      <ul className="pl-5 mt-2 mb-8 flex flex-col gap-6">
        {otherItems.map(({ id, href, name }) => {
          const isActive =
            (name === 'Análisis de llamada' &&
              (pathname.includes('/calls/search') ||
                pathname.includes('/calls/detail'))) ||
            (name === 'Soporte' && pathname.includes('/support')) ||
            pathname.includes(`/${href}`);

          return (
            <li
              key={id}
              className={`${
                isActive
                  ? 'text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Link href={`/${href}`} className="text-base block text-lg">
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
      {/* Administración Dropdown */}
      <div className="w-full px-5 pt-2">
        <button
          className="text-neutral-400 mb-4 flex items-center text-lg"
          onClick={() => setAdminOpen(!adminOpen)}
        >
          Administración {adminOpen ? '▴' : '▾'}
        </button>
        {adminOpen && administracionDropdown?.children && (
          <ul className="pl-2 flex flex-col gap-4">
            {administracionDropdown.children.map(({ id, href, name }) => {
              const isActive = href && pathname.includes(`/${href}`);
              return (
                <li
                  key={id}
                  className={`${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Link href={`/${href}`} className="text-base block text-lg">
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

const ClientAgentNavSection = ({ role }: { role: 'client' | 'agent' }) => {
  const pathname = usePathname();
  const sideNavLinksClient = useSideNavLinksClient();
  const links = role === 'client' ? sideNavLinksClient : sideNavLinksAgent;

  return (
    <>
      {/* Keep logo centered */}
      <div className="flex justify-center mb-10">
        <Image src="/neoris.png" alt="Logo" width={150} height={50} priority />
      </div>

      {/* Nav items aligned left */}
      <ul className="flex flex-col items-start text-left pl-5 gap-4 lg:gap-6">
        {links.map(({ id, href, name }) => {
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
                  text-lg
                  transition-colors w-full block
                  ${isActive ? 'text-white' : 'hover:text-white'}
              `}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const SideNavItems = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-col relative z-20">
      {user?.role === 'client' && <ClientAgentNavSection role="client" />}
      {user?.role === 'agent' && <ClientAgentNavSection role="agent" />}
      {user?.role === 'admin' && <AdminNavSection />}
    </div>
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
          className={`h-screen w-full md:w-64 pt-1 lg:w-64 bg-[#13202A] z-20 transition-all duration-300 ease-in-out fixed left-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:fixed lg:translate-x-0`}
        >
          <div className="flex flex-col justify-between h-full py-5">
            <nav className="lg:flex flex-col w-full justify-center">
              <SideNavItems />
              {pathname.includes('chatbot') && isOpen && (
                <button
                  onClick={() => (window.location.href = '/chatbot')}
                  className="text-neutral-200 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all mx-[1rem] my-[1rem] hover:cursor-pointer hover:text-white"
                >
                  Crear chat
                </button>
              )}
              {pathname.includes('chatbot') && isOpen && (
                <ChatbotSideNavItems />
              )}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
