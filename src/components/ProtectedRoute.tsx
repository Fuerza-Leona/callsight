'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

type UserRole = 'client' | 'agent' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({
  children,
  allowedRoles = ['client, agent, admin'],
}: ProtectedRouteProps) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user && !allowedRoles.includes(user.role as UserRole)) {
      router.push('/perfil');
    }
  }, [user, router, allowedRoles]);

  if (!user || (user && !allowedRoles.includes(user.role as UserRole))) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
