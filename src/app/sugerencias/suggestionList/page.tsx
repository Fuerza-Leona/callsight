'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CircularProgress } from '@mui/material';
import { useInsights } from '@/hooks/useInsights';
import { useFetchTopicsInsights } from '@/hooks/fetchTopicInsights';

const CompanyInsightsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const companyId = searchParams.get('company_id');
  const companyName = searchParams.get('company_name');

  const { topics, loadingTopics, errorTopics, fetchTopics } =
    useFetchTopicsInsights();
  const { insights, loadingInsights, errorInsights, fetchInsights } =
    useInsights();

  const ref = useRef(false);
  useEffect(() => {
    async function fetchData() {
      if (companyId && !ref.current) {
        ref.current = true;

        await fetchTopics({
          limit: 10,
          companies: [companyId],
          clients: [],
          agents: [],
          startDate: '',
          endDate: '',
        });

        await fetchInsights(companyId);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute allowedRoles={['agent', 'admin']}>
      {loadingInsights || loadingTopics ? (
        <div className="pl-70 flex justify-center items-center w-full h-screen">
          <CircularProgress size={100} />
        </div>
      ) : (
        <div className="pl-70 py-10 w-[calc(99%)]">
          <div
            className="text-center py-8 mb-8 rounded-lg"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Observaciones para {companyName}
            </h1>
          </div>

          <div
            className="rounded-lg p-8"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <div className="mb-8">
              <h3
                className="text-2xl font-semibold mb-6"
                style={{ color: '#1a1a1a' }}
              >
                Temas Principales
              </h3>

              {errorTopics ? (
                <p className="text-red-500">
                  Error al cargar temas: {String(errorTopics)}
                </p>
              ) : topics && topics.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {topics.map((topic, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-md shadow-sm flex flex-col items-center"
                    >
                      <span
                        id={`topic_${index}`}
                        className="text-center font-sm"
                      >
                        {topic.topic}
                      </span>
                      <span
                        id={`calls_amount_${index}`}
                        className="text-sm text-gray-500"
                      >
                        {topic.amount} llamadas
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No hay temas disponibles para esta empresa.
                </p>
              )}
            </div>

            {errorInsights ? (
              <div className="text-center">
                <p className="text-red-500 text-lg">Error: {errorInsights}</p>
                <button
                  onClick={() => router.push('/tickets')}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Volver a la lista de empresas
                </button>
              </div>
            ) : insights && insights.length > 0 ? (
              <div>
                <h3
                  className="text-2xl font-semibold mb-6"
                  style={{ color: '#1a1a1a' }}
                >
                  Recomendaciones en base a las llamadas pasadas:
                </h3>

                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      <span
                        className="w-2 h-2 rounded-full mt-3 mr-3 flex-shrink-0"
                        style={{ backgroundColor: '#1a1a1a' }}
                      ></span>
                      <p
                        id={`insight_${index}`}
                        className="text-md text-gray-800 leading-relaxed"
                      >
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    id="back-button"
                    onClick={() => router.push('/sugerencias')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Volver a la lista de empresas
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">
                  No hay observaciones disponibles para esta empresa.
                </p>
                <button
                  onClick={() => router.push('/sugerencias')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Volver a la lista de empresas
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default CompanyInsightsPage;
