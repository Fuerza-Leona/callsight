'use client';
// This page shows a list of companies for insights
// Users can click on a company to see its specific insights

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CircularProgress } from '@mui/material';
import { useFetchCompanies } from '@/hooks/fetchCompanies';

const CompaniesSuggestionsPage = () => {
  // Use your existing custom hook to fetch companies data
  const { companies, loading, error } = useFetchCompanies();
  // State to manage the search input
  const [search, setSearch] = useState('');
  // Hook to navigate between pages
  const router = useRouter();

  // Function that runs when user clicks on a company card
  const handleCardClick = (companyId: string, companyName: string) => {
    // Navigate to the insights page with company information
    // Fix: Include company_name in the URL parameters too
    router.push(
      `/sugerencias/suggestionList?company_id=${companyId}&company_name=${encodeURIComponent(companyName)}`
    );
  };

  // Filter companies based on the search input
  // If user types something, filter companies whose names include that text
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

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
          {/* Main title - same style as "Soporte a Clientes" */}
          <h1
            className="text-7xl font-bold text-center"
            style={{ color: 'var(--neoris-blue)' }}
          >
            Sugerencias por Cliente
          </h1>

          {/* Search bar - only show if there are 2 or more companies */}
          {companies.length > 1 && (
            <div className="flex items-center justify-between mb-6 items-center text-center justify-center">
              <div>
                <input
                  type="text"
                  placeholder=" Buscar empresa..."
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[400px] mt-5 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          {/* Descriptive text */}
          <p className="text-center text-base text-gray-700 my-8">
            Selecciona una empresa para ver sus sugerencias:
          </p>

          {/* Companies grid */}
          {error ? (
            // Show error message if something went wrong
            <p className="text-center text-red-500">Error: {error}</p>
          ) : filteredCompanies && filteredCompanies.length > 0 ? (
            // Show companies in a grid layout
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
              }}
            >
              {/* Map through each company and create a card */}
              {filteredCompanies.map((company, index) => (
                <button
                  id={`company_${index}`}
                  key={company.company_id}
                  onClick={() =>
                    handleCardClick(company.company_id, company.name)
                  }
                  style={{
                    backgroundColor: '#87CEEB', // Light blue background
                    borderRadius: '10px',
                    padding: '20px',
                    flex: '1 0 calc(25% - 24px)', // 4 cards per row
                    maxWidth: 'calc(25% - 24px)',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s ease-in-out',
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: 'none', // Remove default button border
                  }}
                  // Mouse hover effects
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* Company logo */}
                  <Image
                    src={
                      company.logo ||
                      'https://static.thenounproject.com/png/1738131-200.png'
                    }
                    alt={company.name}
                    width={0}
                    height={0}
                    style={{
                      width: '80%',
                      maxHeight: '130px',
                      objectFit: 'contain',
                    }}
                    sizes="(max-width: 768px) 80vw, 80%"
                  />
                </button>
              ))}
            </div>
          ) : (
            // Show message when no companies are found
            <p className="text-center text-gray-500">
              No se encontraron empresas.
            </p>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
};

export default CompaniesSuggestionsPage;
