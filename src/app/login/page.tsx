'use client'
import { useRef, useState } from "react";

export default function Home() {
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center text-center justify-center mt-24">
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
                  className={"w-full rounded-lg bg-gray-200 py-[2px] placeholder:text-neutral-500 text-black focus:outline-none px-2"}
                  placeholder="Johndoe@gmail.com"
                ></input>
                <h2 className="font-bold">Contraseña</h2>
                <input
                  type="password"
                  name="password"
                  autoComplete="on"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={"w-full rounded-lg bg-gray-200 py-[2px] placeholder:text-neutral-500 text-black focus:outline-none px-2"}
                ></input>
              </div>
            </div>
            
            <div className="flex justify-center m-5">
              <button type="submit" disabled={loading} className="inline-block px-5 py-3 rounded-[2.4rem] text-base bg-[#13202A] text-white border-2 tracking-[0.06rem] font-semibold transition duration-300 ease-in-out cursor-pointer">
                Log In
              </button>
            </div>
          </div>
        </form>
        
      </div>
    </div>
  );
}