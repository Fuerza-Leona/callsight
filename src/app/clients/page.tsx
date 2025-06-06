'use client';

import * as React from 'react';
import 'dayjs/locale/es';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useFetchCompanyInformation } from '@/hooks/fetchCompanyInformation';
import CustomPaginationActionsTable from '@/components/CustomPaginationActionsTable';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const { rows, loading, fetchCompanyInformation } =
    useFetchCompanyInformation();
  const columns = [
    { label: 'Empresa', key: 'name' },
    { label: 'Usuarios', key: 'size' },
    //{ label: 'Proyectos', key: 'proyectos' },
  ];
  const [filteredRows, setFilteredRows] = useState(rows);
  const handleSearch = (searchValue: string | null) => {
    if (!searchValue || searchValue.length === 0) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) =>
        row['name'].toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  };
  useEffect(() => {
    fetchCompanyInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="relative lg:left-64 w-[96%] lg:w-[80%] flex flex-col md:justify-around md:flex-row gap-3  pl-3">
        <div className="w-full flex flex-col">
          <div className="flex flex-col w-full gap-5 md:ml-10 p-20">
            {!loading && (
              <div className="flex justify-between gap-5">
                <SearchBar
                  label="Buscar Empresa"
                  options={rows.map((row) => ({ label: row.name }))}
                  onSelect={handleSearch}
                  sx={{ width: '100%' }}
                />
                <button
                  className="rounded-2xl bg-[#13202A] text-white md:w-50 hover:cursor-pointer hover:bg-[#364550]"
                  onClick={() =>
                    (window.location.href = '/clients/clientCompany')
                  }
                >
                  Añadir empresa
                </button>
              </div>
            )}
            <div className="h-[200px] w-full">
              <CustomPaginationActionsTable
                rows={filteredRows}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
