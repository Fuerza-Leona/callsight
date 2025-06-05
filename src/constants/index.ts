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
  {
    id: 10,
    name: 'Entrenamiento',
    href: 'entrenamiento',
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

export const moods = [
  {
    mood: 'Enojado',
    description: 'Cliente molesto, tono confrontativo',
    imageUrl: '/colors/red.jpg',
    voice: 'coral',
    //coral o ash
  },
  {
    mood: 'Frustrado',
    description: 'Cliente impaciente y sarcástico',
    imageUrl: '/colors/orange.jpg',
    voice: 'ballad',
    //alloy meh, ash bueno, ballad bueno, coral buena, echo no, sage meh, shimmer, and verse no
  },
  {
    mood: 'Detallista',
    description:
      'Cliente que hace muchas preguntas técnicas o administrativas.',
    imageUrl: '/colors/yellow.jpg',
    voice: 'sage',
    //alloy, ash, ballad, coral, echo, sage - buena, shimmer - no, and verse
  },
  {
    mood: 'Indeciso',
    description: 'Cliente que duda en tomar decisiones',
    imageUrl: '/colors/dark_blue.jpg',
    voice: 'ballad',
    //alloy - no, ash - bueno, ballad - bueno, coral, echo, sage, shimmer, and verse
  },
  {
    mood: 'Confundido',
    description: 'Cliente que no entiende el proceso o producto',
    imageUrl: '/colors/gray.jpg',
    voice: 'shimmer',
    //alloy - buena, ash - decente , ballad - bueno, coral, echo, sage, shimmer, and verse
  },
  {
    mood: 'Colaborador',
    description: 'Cliente con actitud positiva, que quiere resolver',
    imageUrl: '/colors/dark_green.jpg',
    voice: 'verse',
    //alloy - no, ash - meh, ballad - bueno, coral - buena, echo - decente, sage - buena, shimmer - buena, and verse - bueno
  },
];
