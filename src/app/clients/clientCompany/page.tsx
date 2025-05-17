'use client';

import * as React from 'react';
import 'dayjs/locale/es';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TextField } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useFetchCategories } from '@/hooks/fetchCategories';
import api from '@/utils/api';

export default function Home() {
  const handleSearch = (searchValue: string | null) => {
    if (searchValue === null) {
      setSearch('');
    } else {
      setSearch(searchValue);
    }
  };

  const [search, setSearch] = React.useState<string>('');
  const [logo, setLogo] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');

  const {
    categories,
    loadingCategories: loading,
    fetchCategories,
  } = useFetchCategories();
  const [err, setErr] = React.useState<string>('');

  console.log(err);

  const handleSubmit = async () => {
    try {
      const response = await api.post('/companies/create', {
        name: name,
        logo: logo,
        category: search,
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
      setErr(error!.toString());
    }
  };

  React.useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="relative lg:left-64 w-[96%] lg:w-[80%] flex flex-col md:justify-around md:flex-row gap-3  pl-3">
        <div className="w-full flex flex-col">
          <div className="flex flex-col w-full gap-5 md:ml-10 p-30">
            <p>Crear nueva empresa</p>
            <TextField
              placeholder="Nombre de la empresa"
              variant="outlined"
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              placeholder="Link al Logo"
              variant="outlined"
              label="Logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
            {!loading && (
              <div className="flex justify-between gap-5">
                <SearchBar
                  label="Buscar Categoría"
                  options={categories.map((row) => ({
                    label: row.name,
                  }))}
                  onSelect={handleSearch}
                  sx={{ width: '100%' }}
                />
              </div>
            )}
            <div className="w-full flex justify-end">
              <button
                className="rounded-2xl bg-[#13202A] text-white md:w-50 h-15 hover:cursor-pointer hover:bg-[#364550]"
                onClick={() => handleSubmit()}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
