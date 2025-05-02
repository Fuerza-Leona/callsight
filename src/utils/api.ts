import axios from 'axios';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/constants';

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the access token is expired, try refreshing it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${apiUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (refreshError) {
        const router = useRouter();
        router.push('/');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
