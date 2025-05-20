'use client';
// This page shows insights/suggestions for a specific company
// It displays the company logo, name, insights, and now also top topics

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CircularProgress } from '@mui/material';
import { useInsights } from '@/hooks/useInsights';
import { useFetchCompanies } from '@/hooks/fetchCompanies';
import { useFetchTopics } from '@/hooks/fetchTopics';

const CompanyInsightsPage = () => {
  // Hooks for navigation and URL parameters
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get company information from URL parameters
  const companyId = searchParams.get('company_id');
  const companyName = searchParams.get('company_name');

  // Use your existing hook to get companies (to find the logo)
  const { companies } = useFetchCompanies();

  // Use our custom hook to fetch insights for the specific company
  const {
    insights,
    loading: insightsLoading,
    error: insightsError,
  } = useInsights(companyId || '');

  // Use the topics hook
  const { topics, loadingTopics, errorTopics, fetchTopics } = useFetchTopics();

  // Find the current company to get its logo
  const currentCompany = companies.find(
    (company) => company.company_id === companyId
  );
  const companyLogo = currentCompany?.logo;

  // Fetch topics when the component mounts or companyId changes
  useEffect(() => {
    if (companyId) {
      fetchTopics({
        limit: 10,
        companies: [companyId],
        clients: null,
        agents: null,
        startDate: '1900-01-01', // Very old date to include all historical data
        endDate: '2150-12-31', // Future date to include all upcoming data
      });
    }
  });

  // If we don't have a company ID, redirect back to companies list
  if (!companyId) {
    router.push('/sugerencias');
    return null;
  }

  // Check if either insights or topics are still loading
  const loading = insightsLoading || loadingTopics;

  return (
    // ProtectedRoute ensures only authorized users can see this page
    <ProtectedRoute allowedRoles={['agent', 'admin']}>
      {/* If loading, show a spinning wheel */}
      {loading ? (
        <div className="pl-70 flex justify-center items-center w-full h-screen">
          <CircularProgress size={100} />
        </div>
      ) : (
        // Main content when not loading
        <div className="pl-70 py-10 w-[calc(100%)]">
          {/* Header section with dark background - matches the Figma design */}
          <div
            className="text-center py-8 mb-8 rounded-lg"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Observaciones para {companyName}
            </h1>
          </div>

          {/* Main content area with light gray background */}
          <div
            className="rounded-lg p-8"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            {/* Company section */}
            <div className="mb-8">
              {/* Company logo in a white card */}
              <div
                className="inline-block p-6 rounded-lg shadow-md"
                style={{ backgroundColor: 'white' }}
              >
                <Image
                  src={
                    companyLogo ||
                    'https://static.thenounproject.com/png/1738131-200.png'
                  }
                  alt={companyName || 'Company'}
                  width={200}
                  height={120}
                  style={{
                    objectFit: 'contain',
                    maxHeight: '120px',
                  }}
                />
              </div>
            </div>

            {/* Topics section */}
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
                      <span className="text-lg font-medium">{topic.topic}</span>
                      <span className="text-sm text-gray-500">
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

            {/* Insights section */}
            {insightsError ? (
              // Show error message if something went wrong
              <div className="text-center">
                <p className="text-red-500 text-lg">Error: {insightsError}</p>
                <button
                  onClick={() => router.push('/sugerencias-por-cliente')}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Volver a la lista de empresas
                </button>
              </div>
            ) : insights && insights.length > 0 ? (
              // Show insights when available
              <div>
                <h3
                  className="text-2xl font-semibold mb-6"
                  style={{ color: '#1a1a1a' }}
                >
                  Recomendaciones en base a las llamadas pasadas:
                </h3>

                {/* List of insights */}
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      {/* Bullet point */}
                      <span
                        className="w-2 h-2 rounded-full mt-3 mr-3 flex-shrink-0"
                        style={{ backgroundColor: '#1a1a1a' }}
                      ></span>
                      {/* Insight text */}
                      <p className="text-lg text-gray-800 leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Back button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => router.push('/sugerencias')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Volver a la lista de empresas
                  </button>
                </div>
              </div>
            ) : (
              // Show message when no insights are available
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
