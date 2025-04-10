import getConfig from 'next/config';

export const apiUrl = () => {
  const { publicRuntimeConfig } = getConfig();
  return `${publicRuntimeConfig.baseApiUrl}/api/${publicRuntimeConfig.apiVersion}`;
};

export const navBarLinks = [
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

export const sideNavLinksAgent = [
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
    id: 4,
    name: 'Mi perfil',
    href: 'perfil',
  },
  {
    id: 5,
    name: 'Support',
    href: 'support',
  },
  {
    id: 6,
    name: 'Chatbot',
    href: 'chatbot',
  },
];

export const sideNavLinksClient = [
  {
    id: 1,
    name: 'Análisis de llamada',
    href: 'calls/dashboard',
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
    name: 'Support',
    href: 'support',
  },
];
