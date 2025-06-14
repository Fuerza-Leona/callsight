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
//import { useRouter } from 'next/navigation';
import { User } from '@/interfaces/user';
import DropDown from '@/components/AdminEditDropdown';

export default function Home() {
  const { user } = useUser();
  //const router = useRouter();

  const { getUsers, data: users, loading } = useUsers();

  const { companies } = useFetchCompanies();

  const [search, setSearch] = useState<string>('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users!);

  const handleFilter = (companies: string[]) => {
    setSelectedCompanies(companies);
  };

  useEffect(() => {
    setFilteredUsers(users!);
    if (selectedCompanies.length > 0) {
      const selectedCompaniesIds = companies
        .filter((company) => selectedCompanies.includes(company.name))
        .map((company) => company.company_id);
      setFilteredUsers(
        users!.filter((user) => selectedCompaniesIds.includes(user.company_id))
      );
    }

    if (search) {
      setFilteredUsers(
        filteredUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.user_id.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanies, users, search]);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="relative lg:left-64 top-16 w-[96%] lg:w-[80%] flex flex-col md:justify-around md:flex-row gap-3  pl-3">
        <div className="w-full md:w-[90%] flex flex-col">
          <div className="flex justify-between items-center gap-5">
            <TextField
              label="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <MultipleSelectChip
              id="companies"
              title={'Empresa'}
              names={companies.map((company) => company.name)}
              value={selectedCompanies}
              onChange={(e) => {
                handleFilter([...e]);
              }}
            />
            {user && user!.role == 'admin' && (
              <button
                className="rounded-2xl bg-[#13202A] text-white md:w-60 hover:cursor-pointer hover:bg-[#364550] h-14 p-2"
                onClick={() => (window.location.href = '/users/nuevo')}
              >
                <p className="text-md">Añadir usuario</p>
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
                  <TableRow className="bg-[#f3f4f6]">
                    <TableCell className="w-1/6">ID</TableCell>
                    <TableCell className="w-1/12">Nombre</TableCell>
                    <TableCell className="w-1/12">Rol</TableCell>
                    <TableCell className="w-1/12">Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers &&
                    !loading &&
                    filteredUsers.map((person) => (
                      <TableRow
                        key={person.user_id}
                        /*onClick={() =>
                          router.push(`/users/detail?detail=${person.user_id}`)
                        }*/
                        className="hover:bg-gray-100 bg-white"
                      >
                        <TableCell>
                          <div className="bg-gray-100 rounded-md p-2 w-fit text-gray-500">
                            <p>{person.user_id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <b>
                            <p className="text-md">{person.username}</p>
                          </b>
                        </TableCell>
                        <TableCell>
                          <DropDown
                            value={person.role}
                            options={['admin', 'client', 'agent']}
                            appliedUser={person.user_id}
                          />
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {person.email}
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
