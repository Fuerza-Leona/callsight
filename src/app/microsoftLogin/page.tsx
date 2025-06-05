'use client';

import { useRef, useState } from 'react';
import { useLogin } from '@/hooks/useLogin';
import Image from 'next/image';

export default function Home() {
  const formRef = useRef(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { login, error, loading } = useLogin();

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
      await login(form.email, form.password);
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center ">
      {/* Imagen de fondo */}
      <Image
        src="/fuerzaLeona.jpg"
        alt="Fondo con león"
        fill
        className="object-cover pt-20"
        priority
      />

      {/* Contenido */}
      <div className="relative z-20 flex w-full px-10 md:px-20 items-center justify-between">
        {/* Texto izquierda */}
        <div className="text-white max-w-md">
          <h1 className="text-5xl font-bold mb-4">¡Bienvenid@!</h1>
          <p className="text-lg font-medium">
            Inicia sesión para aprovechar al máximo todas nuestras herramientas
            de gestión y análisis.
          </p>
        </div>

        {/* Formulario derecha */}
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
              disabled={loading}
              className="bg-[#13202A] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <p className="text-sm text-center mt-2 text-gray-700">
              ¿Aún no tienes una cuenta?{' '}
              <span className="underline cursor-pointer">Contáctanos</span>
            </p>
            <p className="text-sm text-center text-gray-700 underline cursor-pointer">
              ¿Olvidaste tu contraseña?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
