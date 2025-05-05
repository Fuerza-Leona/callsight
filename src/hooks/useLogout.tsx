import { useUser } from '../context/UserContext';
import api from '../utils/api';
import { useRouter } from 'next/navigation';

const useLogout = () => {
  const { setUser } = useUser();
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post('auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logout;
};

export default useLogout;
