'use client';

import React, { useState, ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Observation {
  client: string;
  themes: string[];
  recommendations: string[];
}

const OBSERVATIONS: Observation[] = [
  {
    client: 'BBVA',
    themes: ['Budgets', 'uso Typescript', 'Tecnología'],
    recommendations: [
      'Llamadas de 30-35 minutos',
      'Buscar tener un equipo amplio para el proyecto',
      'Tener listo un prototipo de la sección de compras',
    ],
  },
  {
    client: 'Santander',
    themes: ['Optimizar', 'Seguridad', 'Integrar'],
    recommendations: [
      'Utilizar un lenguaje menos técnico con el cliente',
      'Hacer preguntas más específicas',
      'Ofrecer alternativas de posibles soluciones',
    ],
  },
  {
    client: 'Telcel',
    themes: ['Actualizar', 'Consultoría', 'Mejorar'],
    recommendations: [
      'Mostrar más empatía cuando el cliente exprese frustración',
      'Resumir los puntos clave al final de la llamada',
    ],
  },
  {
    client: 'Bimbo',
    themes: ['Soporte', 'Adaptación', 'Capacitar'],
    recommendations: [
      'Escuchar activamente sin interrumpir al cliente.',
      'Validar las preocupaciones antes de proceder con soluciones',
    ],
  },
];

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span className="text-xs font-semibold text-white bg-slate-900 rounded-full px-3 py-1 whitespace-nowrap">
    {label}
  </span>
);

const ObservationCard: React.FC<{ data: Observation; even: boolean }> = ({
  data,
  even,
}) => {
  const cardBg = even ? 'bg-slate-100' : 'bg-slate-900';
  const textColor = even ? 'text-slate-900' : 'text-white';

  return (
    <div
      className={`w-full rounded-xl ${cardBg} ${textColor} px-6 py-4 flex flex-col gap-4`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
        <div className="shrink-0 w-28 font-medium text-lg">{data.client}</div>
        <div className="flex-1">
          <p className="font-semibold mb-1">Temas principales:</p>
          <div className="flex flex-wrap gap-2">
            {data.themes.map((theme) => (
              <Tag key={theme} label={theme} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-6">
        <div className="hidden sm:block shrink-0 w-28" />
        <div className="flex-1">
          <p className="font-semibold mb-1">
            Recomendaciones en base a las llamadas pasadas:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {data.recommendations.map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Observaciones: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value.toLowerCase());

  const filtered = OBSERVATIONS.filter((obs) => {
    const matchClient = obs.client.toLowerCase().includes(query);
    const matchTheme = obs.themes.some((t) => t.toLowerCase().includes(query));
    return matchClient || matchTheme;
  });

  return (
    <ProtectedRoute allowedRoles={['admin', 'agent']}>
      <div className="pl-35">
        <div className="max-w-[90rem] mx-auto p-4 space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="flex-1 text-3xl font-bold text-center sm:text-left bg-slate-900 text-white py-2 rounded-lg">
              Observaciones
            </h1>
            <label className="relative flex items-center w-full sm:w-64">
              <Search className="absolute left-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar"
                value={query}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </label>
          </header>
          <div className="flex flex-col gap-6">
            {filtered.map((obs, idx) => (
              <ObservationCard
                key={obs.client}
                data={obs}
                even={idx % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Observaciones;
