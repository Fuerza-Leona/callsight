'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sideNavLinksClient, sideNavLinksAgent } from '@/constants';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';

import Image from 'next/image';

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
            // Check if the current pathname includes the href
            const isActive = pathname.includes(href);

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
            // Check if the current pathname includes the href
            const isActive = pathname.includes(href);

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
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prevIsOpen) => !prevIsOpen);
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <>
      {user && (
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
              <nav className="lg:flex w-full justify-center">
                <SideNavItems />
              </nav>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
