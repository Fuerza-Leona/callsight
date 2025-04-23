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

export const sideNavLinksClient: NavLink[] = [
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

export const chatTemp: NavLink[] = [
  { id: 1, name: 'Llamada con BBVA', href: '' },
  { id: 2, name: 'Sugerencias para mis clientes', href: '' },
  { id: 3, name: 'Cómo tratar con clientes difíciles', href: '' },
  { id: 4, name: 'Política de reembolsos explicada', href: '' },
  { id: 5, name: 'Manejo de quejas recurrentes', href: '' },
  { id: 6, name: 'Script para ventas efectivas', href: '' },
  { id: 7, name: 'Protocolos de emergencia', href: '' },
  { id: 8, name: 'Seguimiento de cliente satisfecho', href: '' },
  { id: 9, name: 'Atención postventa BBVA', href: '' },
  { id: 10, name: 'Resolución de problemas técnicos', href: '' },
  { id: 11, name: 'Tips para llamadas rápidas', href: '' },
  { id: 12, name: 'Guía de empatía en atención', href: '' },
  { id: 13, name: 'Cómo cerrar una venta', href: '' },
  { id: 14, name: 'Primer contacto con nuevos leads', href: '' },
  { id: 15, name: 'Manejo de objeciones comunes', href: '' },
  { id: 16, name: 'Resumen reunión con cliente VIP', href: '' },
  { id: 17, name: 'Instrucciones para producto X', href: '' },
  { id: 18, name: 'Actualización de datos de contacto', href: '' },
  { id: 19, name: 'Proceso de devolución explicado', href: '' },
  { id: 20, name: 'Mensajes para clientes inactivos', href: '' },
];
