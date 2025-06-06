'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Importar usePathname
import { navBarLinks } from '@/constants';
import { useUser } from '@/context/UserContext';

import Image from 'next/image';
import Link from 'next/link';

const NavItems = () => {
  return (
    <ul className="flex flex-col items-center gap-4 sm:flex-row md:gap-6 relative z-20">
      {navBarLinks.map(({ id, href, name }) => (
        <li
          key={id}
          className="text-neutral-400 hover:text-white max-sm:hover:bg-[#13202A]/50 max-sm:w-full max-sm:rounded-md py-2 max-sm:px-5"
        >
          <Link
            href={href}
            className="text-lg md:text-base hover:text-white transition-colors w-full block"
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname(); // Obtener la ruta actual

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  // Determinar si estamos en la página de login
  const isLoginPage = pathname === '/login';

  return (
    <header className="lg:pl-0 fixed top-0 left-0 right-0 z-50 bg-[#13202A]">
      <div className="mx-5">
        <div
          className={`flex justify-between items-center py-5 mx-auto ${isOpen ? 'backdrop-blur-sm transition-all ease-in-out' : 'transition-all duration-300 ease-in-out'}`}
        >
          <Link href="/" className="ml-5">
            <Image
              src="/neoris.png"
              alt="Logo"
              width={150}
              height={50}
              priority
            />
          </Link>
          <nav className="sm:flex hidden items-center justify-between w-full">
            {!isLoginPage && <NavItems />}
          </nav>
          <div className="flex gap-5 items-center">
            <button
              className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Image
                src={isOpen ? '/assets/close.svg' : '/assets/chevronDown.png'}
                alt="toggle"
                className="w-6 h-6"
                width={24}
                height={24}
              />
            </button>

            {/* Botón dinámico: Login/Regresar según la página actual */}
            {!user && (
              <Link href={isLoginPage ? '/' : '/login'}>
                <p className="w-30 rounded-2xl text-center py-2 bg-white px-2 hover:bg-gray-300 transition-colors">
                  {isLoginPage ? 'Regresar' : 'Iniciar sesión'}
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        className={`w-64 absolute right-0 bg-[#13202A]/80 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden z-20 mx-auto sm:hidden block ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <nav className="p-5">
          <NavItems />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
