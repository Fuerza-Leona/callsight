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
    href: 'nosotros',
  },
  {
    id: 2,
    name: '¿Qué hacemos?',
    href: 'que-hacemos',
  },
  {
    id: 3,
    name: '¿Cómo funciona?',
    href: 'como-funciona',
  },
];

export const sideNavLinksAgent: NavLink[] = [
  {
    id: 1,
    name: 'Análisis de llamada',
    href: 'calls/dashboard',
  },
  {
    id: 2,
    name: 'Sugerencias para mis clientes',
    href: 'sugerencias',
  },
  {
    id: 3,
    name: 'Subir una llamada',
    href: 'calls/upload',
  },
  {
    id: 5,
    name: 'Soporte',
    href: 'companies',
  },
  {
    id: 7,
    name: 'Clientes',
    href: 'clients',
  },
  {
    id: 8,
    name: 'Usuarios',
    href: 'users',
  },
  {
    id: 6,
    name: 'Chatbot',
    href: 'chatbot',
  },
  {
    id: 4,
    name: 'Mi perfil',
    href: 'perfil',
  },
];

export const sideNavLinksClient: NavLink[] = [
  {
    id: 1,
    name: 'Análisis de llamada',
    href: 'calls/search',
  },
  {
    id: 2,
    name: 'Chatbot',
    href: 'chatbot',
  },
  {
    id: 3,
    name: 'Mi perfil',
    href: 'perfil',
  },
  {
    id: 4,
    name: 'Soporte',
    href: 'companies',
  },
];
