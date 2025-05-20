'use client';

import * as React from 'react';
import 'dayjs/locale/es';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TextField } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useFetchCompanies } from '@/hooks/fetchCompanies';
import api from '@/utils/api';

export default function Home() {
  const [user, setUser] = React.useState({
    username: '',
    email: '',
    password: '',
    department: '',
  });

  const roles = [
    { name: 'admin' },
    { name: 'agent' },
    { name: 'leader' },
    { name: 'client' },
  ];

  const [search, setSearch] = React.useState<string>('');
  const [searchCompanies, setSearchCompanies] = React.useState<string>('');
  const { companies, loading: loadingCompanies } = useFetchCompanies();
  const [err, setErr] = React.useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value, // Dynamically update the field based on the input's name
    }));
  };

  const handleSearch = (searchValue: string | null) => {
    setSearch(searchValue || '');
  };
  const handleSearchCompanies = (searchValue: string | null) => {
    setSearchCompanies(searchValue || '');
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/users/create', {
        ...user,
        role: searchCompanies,
        company: search,
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
      setErr(error!.toString());
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="relative lg:left-64 w-[96%] lg:w-[80%] flex flex-col md:justify-around md:flex-row gap-3 pl-3">
        <div className="w-full flex flex-col">
          <div className="flex flex-col w-full gap-5 md:ml-10 p-30">
            <p>Crear nuevo usuario</p>
            <TextField
              id="username"
              name="username"
              placeholder="Usuario"
              variant="outlined"
              label="Usuario"
              value={user.username}
              onChange={handleInputChange}
            />
            <TextField
              id="email"
              name="email"
              placeholder="Correo"
              variant="outlined"
              label="Correo"
              value={user.email}
              onChange={handleInputChange}
              type="email"
            />
            <TextField
              id="password"
              name="password"
              placeholder="Contraseña"
              variant="outlined"
              label="Contraseña"
              value={user.password}
              onChange={handleInputChange}
              type="password"
            />
            <SearchBar
              label="Rol"
              options={roles.map((row) => ({
                label: row.name,
              }))}
              onSelect={handleSearchCompanies}
              sx={{ width: '100%' }}
            />
            <TextField
              name="department"
              placeholder="Departamento"
              variant="outlined"
              label="Departamento"
              value={user.department}
              onChange={handleInputChange}
            />
            {!loadingCompanies && (
              <div className="flex justify-between gap-5">
                <SearchBar
                  label="Buscar Empresa"
                  options={companies.map((row) => ({
                    label: row.name,
                  }))}
                  onSelect={handleSearch}
                  sx={{ width: '100%' }}
                />
              </div>
            )}
            <div className="w-full flex-col align-items-end">
              <button
                className="rounded-2xl bg-[#13202A] text-white md:w-50 h-15 hover:cursor-pointer hover:bg-[#364550]"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <p className="text-red-500">{err}</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
