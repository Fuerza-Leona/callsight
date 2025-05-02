'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../interfaces/user';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

// Create context with a default value and proper typing
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('users/me');
        setUser(response.data.user);
        router.push('/perfil');
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {loading ? <div className="text-white">Loading...</div> : children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
