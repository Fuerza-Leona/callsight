'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCompanies } from '@/hooks/useCompanies';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CircularProgress } from '@mui/material';
import { useUser } from '@/context/UserContext';

// Definimos interfaces para los diferentes formatos de datos
interface BaseCompany {
  company_id: string;
  name: string;
  logo: string;
}

interface ClientCompany {
  company_id: string;
  company_client: {
    name: string;
    logo: string;
  };
}

// Tipo unión para manejar ambos formatos
type CompanyData = BaseCompany | ClientCompany;

const CompaniesPage = () => {
  const { companies, loading, error } = useCompanies();
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user?.role === 'client') {
      router.push(`/support?company_id=${user?.company_id}`);
    }
  }, [user, router]);

  useEffect(() => {
    console.log('🧭 You are in CompaniesPage and hook has been called.');
    console.log('Companies data:', companies);
  }, [companies]);

  // Function to normalize company data regardless of structure
  const normalizeCompanyData = (company: CompanyData): BaseCompany => {
    // Check if this is a client company structure
    if ('company_client' in company) {
      return {
        company_id: company.company_id,
        name: company.company_client.name,
        logo: company.company_client.logo,
      };
    }
    // For admin/agent, the structure is already correct
    return company as BaseCompany;
  };

  // Función que maneja el clic en el botón para ir a la página de tickets
  const handleCardClick = (companyId: string, companyName: string) => {
    router.push(`/support?company_id=${companyId}&company_name=${companyName}`); // Redirige a la página de tickets
  };

  // Normalize all companies data
  const normalizedCompanies: BaseCompany[] = companies
    ? companies.map((company) => normalizeCompanyData(company as CompanyData))
    : [];

  // Apply filter if needed
  const filteredCompanies =
    normalizedCompanies.length > 1
      ? normalizedCompanies.filter((company) =>
          company?.name?.toLowerCase().includes(search.toLowerCase())
        )
      : normalizedCompanies;

  return (
    <ProtectedRoute allowedRoles={['client', 'agent', 'admin']}>
      {loading ? (
        <div className="pl-70 flex justify-center items-center w-full h-screen">
          <CircularProgress size={100} />
        </div>
      ) : (
        <div className="pl-70 py-10 w-[calc(100%)]">
          {/* Título principal */}
          <h1
            className="text-7xl font-bold text-center"
            style={{ color: 'var(--neoris-blue)' }}
          >
            Soporte a Clientes
          </h1>

          {/* Fila con search bar a la izquierda, solo si hay 2+ empresas */}
          {normalizedCompanies.length > 1 && (
            <div className="flex items-center justify-between mb-6 items-center text-center justify-center">
              <div>
                <input
                  type="text"
                  placeholder=" Buscar empresa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[400px] mt-5 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          {/* Texto descriptivo */}
          <p className="text-center text-base text-gray-700 my-8">
            Selecciona una empresa para ir a su apartado de tickets:
          </p>

          {/* Lista de empresas */}
          {error ? (
            <p>Error: {error}</p>
          ) : filteredCompanies && filteredCompanies.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
              }}
            >
              {filteredCompanies.map((company) => (
                <button
                  key={company.company_id}
                  onClick={() =>
                    handleCardClick(company.company_id, company.name)
                  }
                  style={{
                    backgroundColor: '#87CEEB',
                    borderRadius: '10px',
                    padding: '20px',
                    flex: '1 0 calc(25% - 24px)',
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Image
                    src={
                      company.logo ||
                      'https://static.thenounproject.com/png/1738131-200.png'
                    }
                    alt={company.name}
                    width={0} // Will be overridden by style
                    height={0} // Will be overridden by style
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
            <p className="text-center text-gray-500">
              No se encontraron empresas.
            </p>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
};

export default CompaniesPage;
