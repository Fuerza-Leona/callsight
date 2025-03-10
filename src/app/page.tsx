import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <Image
        src="/fuerzaLeona.jpg"
        alt="Logo"
        fill
        className="object-cover pt-20"
      />

      <div className="absolute bg-white/40 p-8 rounded-lg shadow-lg w-[90%] max-w-xl text-center">
        <h2 className="text-white text-2xl font-bold">OBTEN INSIGHTS VALIOSOS DE TUS REUNIONES</h2>
        <p className="text-white/90 mt-2">Potencia tu relación con clientes con análisis inteligentes. Nuestra plataforma transforma las reuniones en dashboards, estadísticas y resúmenes accionables con IA, ayudando a mejorar la comunicación y la toma de decisiones.</p>
      </div>
    </div>
  );
}