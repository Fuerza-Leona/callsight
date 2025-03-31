'use client'

import { useRef, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useLogin } from "@/hooks/useLogin";

export default function Home() {
  const router = useRouter();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login, data, error, loading } = useLogin(); // Using the custom hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform login
    await login(form.email, form.password);
  };

  // Handle successful login
  useEffect(() => {
    const handleSession = async () => {
      if (data) {
        try {
          // Send login response to session API to set cookie
          const sessionResponse = await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data), // include access_token, refresh_token, user
          });

          if (sessionResponse.ok) {
            router.push("/perfil");
          } else {
            console.error("Failed to set session cookie");
          }
        } catch (err) {
          console.error("Session error:", err);
        }
      }
    };

    handleSession();
  }, [data]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center text-center justify-center">
      <div className="flex flex-col">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="flex-col">
            <h1 className="font-bold text-2xl my-10">Bienvenido</h1>

            <div className="flex text-start">
              <div className="square h-[100px] w-[29px]"></div>
              <div className="">
                <h2 className="font-bold">Correo</h2>
                <input
                  type="email"
                  name="email"
                  autoComplete="on"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-gray-200 py-[2px] placeholder:text-neutral-500 text-black focus:outline-none px-2"
                  placeholder="Johndoe@gmail.com"
                />

                <h2 className="font-bold mt-4">Contraseña</h2>
                <input
                  type="password"
                  name="password"
                  autoComplete="on"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-gray-200 py-[2px] placeholder:text-neutral-500 text-black focus:outline-none px-2"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}

            <div className="flex justify-center m-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-block px-5 py-3 rounded-[2.4rem] text-base bg-[#13202A] text-white border-2 tracking-[0.06rem] font-semibold transition duration-300 ease-in-out cursor-pointer"
              >
                {loading ? "Cargando..." : "Log In"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}