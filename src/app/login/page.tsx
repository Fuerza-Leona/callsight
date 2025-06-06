'use client';

import { useRef, useState } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { useUser } from '@/context/UserContext';
import { useTeamsConnect } from '@/hooks/useTeamsConnect';
import TeamsConnectButton from '@/components/TeamsConnectButton';
import Image from 'next/image';

export default function Home() {
  const formRef = useRef(null);
  const [showTeamsModal, setShowTeamsModal] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { login, redirectBasedOnRole, error, loading } = useLogin();
  const { user } = useUser();
  const { loading: teamsLoading, error: teamsError } = useTeamsConnect();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      console.log('Todos los campos son requeridos');
      return;
    }

    try {
      const user = await login(form.email, form.password);

      // Check if user needs Teams connection
      if (user && !user.isConnected) {
        setShowTeamsModal(true);
      }
      // If user is already connected, login hook will handle the redirect
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  const handleProceedToPage = () => {
    setShowTeamsModal(false);
    // Use the current user from context to redirect based on role
    if (user) {
      redirectBasedOnRole(user);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <Image
        src="/fuerzaLeona.jpg"
        alt="Fondo con león"
        fill
        className="object-cover pt-20"
        priority
      />

      <div className="relative z-20 flex w-full px-10 md:px-20 items-center justify-between">
        <div className="text-white max-w-md">
          <h1 className="text-5xl font-bold mb-4">¡Bienvenid@!</h1>
          <p className="text-lg font-medium">
            Inicia sesión para aprovechar al máximo todas nuestras herramientas
            de gestión y análisis.
          </p>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#313A26]">
            Inicia Sesión
          </h2>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="rounded-md bg-gray-200 py-2 px-4 text-black placeholder:text-gray-500 focus:outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="rounded-md bg-gray-200 py-2 px-4 text-black placeholder:text-gray-500 focus:outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading || teamsLoading}
              className="bg-[#13202A] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
            >
              {loading || teamsLoading ? 'Cargando...' : 'Iniciar sesión'}
            </button>

            {(error || teamsError) && (
              <p className="text-red-500 text-sm mt-1">{error || teamsError}</p>
            )}

            <p className="text-sm text-center mt-2 text-gray-700">
              ¿Aún no tienes una cuenta?{' '}
              <span className="underline">Contáctanos</span>
            </p>
          </form>
        </div>
      </div>

      {showTeamsModal && !user?.isConnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md mx-4 border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-[#313A26] mb-4">
                Conectar con Microsoft Teams
              </h3>
              <p className="text-gray-600 mb-6">
                Para aprovechar al máximo nuestras funcionalidades, te
                recomendamos conectar tu cuenta con Microsoft Teams.
              </p>

              <TeamsConnectButton onSkip={handleProceedToPage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
