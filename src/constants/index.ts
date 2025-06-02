export const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}`;

export const sessionSecret = `${process.env.SESSION_SECRET}`;

interface NavLink {
  id: number;
  name: string;
  href: string;
}

export const navBarLinks: NavLink[] = [
  {
    id: 1,
    name: '¿Quiénes somos?',
    href: '#nosotros',
  },
  {
    id: 2,
    name: '¿Qué hacemos?',
    href: '#que-hacemos',
  },
  {
    id: 3,
    name: '¿Cómo funciona?',
    href: '#como-funciona',
  },
];

export const sideNavLinksAdmin: NavLink[] = [
  {
    id: 1,
    name: 'Tablero',
    href: 'calls/dashboard',
  },
  {
    id: 2,
    name: 'Llamadas',
    href: 'calls/search',
  },
  {
    id: 3,
    name: 'Subir una llamada',
    href: 'calls/upload',
  },
  {
    id: 4,
    name: 'Chatbot',
    href: 'chatbot',
  },
  {
    id: 5,
    name: 'Sugerencias',
    href: 'sugerencias',
  },
  {
    id: 6,
    name: 'Soporte',
    href: 'tickets',
  },
  {
    id: 7,
    name: 'Empresas',
    href: 'clients',
  },
  {
    id: 8,
    name: 'Usuarios',
    href: 'users',
  },

  {
    id: 9,
    name: 'Mi perfil',
    href: 'perfil',
  },
];

export const sideNavLinksAgent: NavLink[] = [
  {
    id: 1,
    name: 'Tablero',
    href: 'calls/dashboard',
  },
  {
    id: 2,
    name: 'Llamadas',
    href: 'calls/search',
  },
  {
    id: 3,
    name: 'Subir una llamada',
    href: 'calls/upload',
  },
  {
    id: 4,
    name: 'Chatbot',
    href: 'chatbot',
  },
  {
    id: 5,
    name: 'Sugerencias',
    href: 'sugerencias',
  },

  {
    id: 6,
    name: 'Soporte',
    href: 'tickets',
  },
  {
    id: 7,
    name: 'Mi perfil',
    href: 'perfil',
  },
];

import { useUser } from '../context/UserContext';

export const useSideNavLinksClient = () => {
  const { user } = useUser();
  const companyId = user?.company_id || '';
  return [
    {
      id: 1,
      name: 'Llamadas',
      href: 'calls/search',
    },
    {
      id: 2,
      name: 'Chatbot',
      href: 'chatbot',
    },
    {
      id: 3,
      name: 'Soporte',
      href: `tickets/support?company_id=${companyId}`,
    },
    {
      id: 4,
      name: 'Mi perfil',
      href: 'perfil',
    },
  ];
};
