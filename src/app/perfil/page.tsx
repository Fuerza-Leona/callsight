'use client'
import { useRef, useState } from "react";

export default function Home() {

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px] pt-[65px]">
      <div className="w-full text-start">
        <p className="mx-20">Regresar</p>
        <div className="w-full text-white text-4xl text-start">
          <p className="bg-[#13202A] rounded-2xl mx-20 p-8">Nombre</p>
        </div>
      </div>
      <div className="flex w-[calc(100%-18rem)] justify-between mt-10">
        <div className="flex flex-col bg-gray-200 w-60 h-35 rounded-2xl justify-center items-center">
          <p>Rol</p>
          <h2 className="font-thin text-6xl">Admin</h2>
        </div>


        <div className="flex flex-col bg-gray-200 w-60 h-35 rounded-2xl justify-center items-center">
          <p>Satisfacción promedio por llamada</p>
          <h2 className="font-thin text-6xl">4.3</h2>
        </div>

        <div className="flex flex-col bg-gray-200 w-60 h-35 rounded-2xl justify-center items-center">
          <p>Duración promedio por llamada</p>
          <div className="flex">
            <h2 className="font-thin text-6xl">23</h2>
            <p>min</p>
          </div>
        </div>
      </div>
      <div className="flex w-[calc(100%-18rem)] justify-start gap-31 mt-10">
        <div className="flex flex-col bg-gray-200 w-60 h-35 rounded-2xl justify-center items-center">
          <p>Llamadas totales</p>
          <h2 className="font-thin text-6xl">192</h2>
        </div>

        <div className="flex flex-col bg-gray-200 w-155 h-70 rounded-2xl justify-center items-center">
          <p>Clientes</p>
          <h2 className="font-thin text-6xl">
            aliqua irure officia culpa labore
          </h2>
        </div>
      </div>
    </div>
  );
}