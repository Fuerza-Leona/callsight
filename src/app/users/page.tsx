'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/context/UserContext';
import MultipleSelectChip from '@/components/MultipleSelectChip';
import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useFetchCompanies } from '@/hooks/fetchCompanies';
import { useUsers } from '@/hooks/useUsers';

export default function Home() {
  const { user } = useUser();

  const { getUsers, data: users, loading } = useUsers();

  const { companies } = useFetchCompanies();

  const [search, setSearch] = useState<string>('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute>
      <div className="relative lg:left-64 top-32 w-[96%] lg:w-[80%] flex flex-col md:justify-around md:flex-row gap-3  pl-3">
        <div className="w-3/10 flex flex-col align-center text-center gap-2">
          <MultipleSelectChip
            title={'Empresa'}
            names={companies.map((company) => company.name)}
            value={selectedCompanies}
            onChange={(e) => {
              setSelectedCompanies([...e]);
            }}
          />
        </div>
        <div className="w-full md:w-[80%] flex flex-col">
          <div className="flex justify-between gap-5">
            <TextField
              label="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            {user && user!.role == 'admin' && (
              <button
                className="rounded-2xl bg-[#13202A] text-white md:w-50 hover:cursor-pointer hover:bg-[#364550]"
                onClick={() => (window.location.href = '/users/nuevo')}
              >
                Añadir usuario
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center items-center w-full h-[400px]">
              <CircularProgress size={100} thickness={4} />
            </div>
          ) : (
            <div
              className="overflow-auto mt-8"
              style={{
                maxHeight: '500px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#1E242B',
              }}
            >
              <style jsx global>{`
                /* Webkit browsers (Chrome, Safari) */
                .overflow-auto::-webkit-scrollbar {
                  width: 10px;
                }
                .overflow-auto::-webkit-scrollbar-track {
                  background: #f3f4f6;
                  border-radius: 10px;
                }
                .overflow-auto::-webkit-scrollbar-thumb {
                  background: #1e242b;
                  border-radius: 10px;
                  border: 2px solid #f3f4f6;
                }
                .overflow-auto::-webkit-scrollbar-thumb:hover {
                  background: #1e242b;
                }
              `}</style>

              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className="w-2/6">ID</TableCell>
                    <TableCell className="w-1/12">Nombre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users &&
                    !loading &&
                    users.map((person) => (
                      <TableRow
                        key={person.user_id}
                        //onClick={() => handleClick(conversation.conversation_id)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <TableCell>
                          <p>{person.user_id}</p>
                        </TableCell>
                        <TableCell>
                          <p>{person.username}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
